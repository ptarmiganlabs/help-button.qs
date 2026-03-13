'use strict';

// Load .env file (if present) before reading any process.env values
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const winston = require('winston');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Configuration via environment variables
// ---------------------------------------------------------------------------
const HOST = process.env.HOST || 'localhost';
const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// ---------------------------------------------------------------------------
// TLS certificate paths
// ---------------------------------------------------------------------------
const CERT_DIR = path.join(__dirname, 'certs');
const CERT_PATH = process.env.TLS_CERT || path.join(CERT_DIR, 'cert.pem');
const KEY_PATH = process.env.TLS_KEY || path.join(CERT_DIR, 'key.pem');

// ---------------------------------------------------------------------------
// Winston logger — follows the pattern from github.com/ptarmiganlabs/butler
// ---------------------------------------------------------------------------
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new winston.transports.Console({
      name: 'console',
      level: LOG_LEVEL,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
    }),
  ],
});

// ---------------------------------------------------------------------------
// In-memory store for received submissions (most-recent-first, capped)
// ---------------------------------------------------------------------------
const MAX_STORED = 50;
const bugReports = [];
const feedbackEntries = [];

function storeEntry(list, entry) {
  list.unshift(entry);
  if (list.length > MAX_STORED) list.length = MAX_STORED;
}

// ---------------------------------------------------------------------------
// Helpers — format context fields for console output
// ---------------------------------------------------------------------------

/**
 * Pretty-print all context fields in a key: value format.
 * Adapts to whatever fields are present rather than hard-coding.
 */
function formatContextFields(context) {
  if (!context || typeof context !== 'object') return '  (no context)';
  const lines = [];
  for (const [key, value] of Object.entries(context)) {
    // Pad key for alignment (right-align keys in a 20-char column)
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    lines.push(`  ${label.padStart(22)}: ${value}`);
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// HTML helpers — build a dashboard page from stored entries
// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderContextTable(context) {
  if (!context || typeof context !== 'object' || Object.keys(context).length === 0) {
    return '<p class="empty">No context fields</p>';
  }
  let html = '<table class="ctx">';
  for (const [key, value] of Object.entries(context)) {
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    html += `<tr><td class="ctx-key">${escapeHtml(label)}</td><td class="ctx-val">${escapeHtml(String(value))}</td></tr>`;
  }
  html += '</table>';
  return html;
}

function renderStars(rating) {
  if (typeof rating !== 'number') return '';
  return '<span class="stars">' + '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)</span>`;
}

function renderDashboard() {
  const severityHtml = { low: '🟢 Low', medium: '🟡 Medium', high: '🔴 High' };

  const bugRows = bugReports.map((b) => {
    const sev = b.severity
      ? `<div class="severity">${severityHtml[b.severity] || escapeHtml(b.severity)}</div>`
      : '';
    const desc = b.description
      ? `<div class="desc">${escapeHtml(b.description.length > 200 ? b.description.substring(0, 200) + '…' : b.description)}</div>`
      : '';
    return `<div class="card bug"><div class="card-header"><span class="badge bug-badge">BUG REPORT</span><span class="ts">${escapeHtml(b.receivedAt)}</span></div>${renderContextTable(b.context)}${sev}${desc}</div>`;
  }).join('');

  const fbRows = feedbackEntries.map((f) => {
    const rating = f.rating ? `<div class="rating">${renderStars(f.rating)}</div>` : '';
    const comment = f.comment
      ? `<div class="desc">${escapeHtml(f.comment.length > 200 ? f.comment.substring(0, 200) + '…' : f.comment)}</div>`
      : '';
    return `<div class="card fb"><div class="card-header"><span class="badge fb-badge">FEEDBACK</span><span class="ts">${escapeHtml(f.receivedAt)}</span></div>${renderContextTable(f.context)}${rating}${comment}</div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HelpButton.qs Demo Server</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI','Source Sans Pro',system-ui,sans-serif;background:#f0f2f5;color:#1a1a1a;padding:24px}
h1{font-size:22px;margin-bottom:4px;color:#0c3256}
.subtitle{color:#6b7280;font-size:13px;margin-bottom:24px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
.col h2{font-size:16px;margin-bottom:12px;color:#374151;border-bottom:2px solid #d1d5db;padding-bottom:6px}
.card{background:#fff;border-radius:8px;padding:14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.badge{font-size:11px;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:4px;letter-spacing:.04em}
.bug-badge{background:#fef2f2;color:#dc2626}
.fb-badge{background:#f5f3ff;color:#7c3aed}
.ts{font-size:11px;color:#9ca3af}
.ctx{width:100%;border-collapse:collapse;margin-bottom:6px}
.ctx td{padding:3px 6px;font-size:12px;border-bottom:1px solid #f3f4f6}
.ctx-key{font-weight:600;color:#4b5563;white-space:nowrap;width:1%;padding-right:12px}
.ctx-val{color:#6b7280;word-break:break-all}
.desc{font-size:13px;color:#374151;background:#f9fafb;padding:8px;border-radius:4px;margin-top:6px;white-space:pre-wrap}
.rating{margin-top:4px}
.severity{font-size:13px;font-weight:600;margin-top:4px}
.stars{font-size:16px;color:#f59e0b}
.empty{font-size:12px;color:#9ca3af;font-style:italic}
.no-data{text-align:center;padding:32px;color:#9ca3af;font-size:13px}
</style>
</head>
<body>
<h1>HelpButton.qs Demo Server</h1>
<p class="subtitle">Received submissions (last ${MAX_STORED} of each type, most recent first). Refresh to update.</p>
<div class="grid">
<div class="col"><h2>Bug Reports (${bugReports.length})</h2>${bugRows || '<div class="no-data">No bug reports received yet</div>'}</div>
<div class="col"><h2>Feedback (${feedbackEntries.length})</h2>${fbRows || '<div class="no-data">No feedback received yet</div>'}</div>
</div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Enable CORS for all origins (permissive — this is a demo server)
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  logger.verbose(`${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * Dashboard — HTML view of received submissions.
 * GET /
 */
app.get('/', (_req, res) => {
  res.type('html').send(renderDashboard());
});

/**
 * Health check endpoint.
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

/**
 * Bug report endpoint.
 * POST /api/bug-reports
 *
 * Accepts any JSON payload with { timestamp, context, description }.
 * Context fields are displayed adaptively — whatever is sent is shown.
 */
app.post('/api/bug-reports', (req, res) => {
  const { timestamp, context, description, severity } = req.body;

  // --- Validation ---
  const errors = [];
  if (!timestamp) errors.push('Missing required field: timestamp');
  if (!context || typeof context !== 'object') errors.push('Missing or invalid field: context');
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Missing or empty field: description');
  }

  if (errors.length > 0) {
    logger.warn(`BUG REPORT: Rejected — validation failed: ${errors.join('; ')}`);
    return res.status(400).json({ status: 'error', errors });
  }

  // --- Store ---
  const entry = {
    id: `br-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    context,
    description,
    severity: severity || null,
  };
  storeEntry(bugReports, entry);

  // --- Log (adaptive — shows whatever context fields are present) ---
  const descExcerpt = description.length > 80
    ? description.substring(0, 80) + '…'
    : description;

  const severityIcons = { low: '🟢', medium: '🟡', high: '🔴' };

  logger.info('─'.repeat(72));
  logger.info(`BUG REPORT received at ${timestamp}`);
  logger.info(formatContextFields(context));
  if (severity) {
    logger.info(`              Severity: ${severityIcons[severity] || '?'} ${severity}`);
  }
  logger.info(`           Description: ${descExcerpt}`);
  logger.info('─'.repeat(72));

  // Full payload at verbose level for debugging
  logger.verbose(`BUG REPORT: Full payload:\n${JSON.stringify(req.body, null, 2)}`);

  res.json({
    status: 'ok',
    message: 'Bug report received',
    id: entry.id,
  });
});

/**
 * User feedback endpoint.
 * POST /api/feedback
 *
 * Accepts any JSON payload with { timestamp, context, rating?, comment? }.
 * Context fields are displayed adaptively — whatever is sent is shown.
 */
app.post('/api/feedback', (req, res) => {
  const { timestamp, context, rating, comment } = req.body;

  // --- Validation ---
  const errors = [];
  if (!timestamp) errors.push('Missing required field: timestamp');
  if (!context || typeof context !== 'object') errors.push('Missing or invalid field: context');

  // At least one of rating or comment must be provided
  const hasRating = typeof rating === 'number' && rating >= 1 && rating <= 5;
  const hasComment = typeof comment === 'string' && comment.trim().length > 0;

  if (!hasRating && !hasComment) {
    errors.push('At least one of rating (1-5) or comment must be provided');
  }

  if (typeof rating !== 'undefined' && !hasRating) {
    errors.push('Rating must be a number between 1 and 5');
  }

  if (errors.length > 0) {
    logger.warn(`FEEDBACK: Rejected — validation failed: ${errors.join('; ')}`);
    return res.status(400).json({ status: 'error', errors });
  }

  // --- Store ---
  const entry = {
    id: `fb-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    context,
    rating: hasRating ? rating : null,
    comment: hasComment ? comment : null,
  };
  storeEntry(feedbackEntries, entry);

  // --- Log (adaptive — shows whatever context fields are present) ---
  const commentExcerpt = hasComment
    ? (comment.length > 80 ? comment.substring(0, 80) + '…' : comment)
    : '(no comment)';

  logger.info('─'.repeat(72));
  logger.info(`FEEDBACK received at ${timestamp}`);
  logger.info(formatContextFields(context));
  if (hasRating) {
    logger.info(`                Rating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)`);
  }
  logger.info(`               Comment: ${commentExcerpt}`);
  logger.info('─'.repeat(72));

  // Full payload at verbose level for debugging
  logger.verbose(`FEEDBACK: Full payload:\n${JSON.stringify(req.body, null, 2)}`);

  res.json({
    status: 'ok',
    message: 'Feedback received',
    id: entry.id,
  });
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Route not found: ${req.method} ${req.url}` });
});

// ---------------------------------------------------------------------------
// Start server(s)
// ---------------------------------------------------------------------------

// Check whether TLS certificates are available
const hasCerts = fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH);

if (hasCerts) {
  // ---- HTTPS mode --------------------------------------------------------
  const certRaw = fs.readFileSync(CERT_PATH);
  const keyRaw = fs.readFileSync(KEY_PATH);

  const tlsOptions = {
    cert: certRaw,
    key: keyRaw,
  };

  https.createServer(tlsOptions, app).listen(HTTPS_PORT, HOST, () => {
    logger.info('═'.repeat(72));
    logger.info('  HelpButton.qs Demo Server  (HTTPS)');
    
    // Parse and log non-sensitive certificate info
    try {
      const x509 = new crypto.X509Certificate(certRaw);
      logger.info('  Certificate Info:');
      logger.info(`    Subject:          ${x509.subject}`);
      logger.info(`    Issuer:           ${x509.issuer}`);
      logger.info(`    Valid to:         ${x509.validTo}`);
      if (x509.subjectAltName) {
        logger.info(`    Subject Alt Name: ${x509.subjectAltName}`);
      }
    } catch (err) {
      logger.warn('  (Could not parse certificate details)');
    }

    logger.info(`  Listening on:  https://${HOST}:${HTTPS_PORT}`);
    logger.info(`  Bug reports:   POST https://${HOST}:${HTTPS_PORT}/api/bug-reports`);
    logger.info(`  Feedback:      POST https://${HOST}:${HTTPS_PORT}/api/feedback`);
    logger.info(`  Health check:  GET  https://${HOST}:${HTTPS_PORT}/health`);
    logger.info(`  Log level:     ${LOG_LEVEL}`);
    logger.info('═'.repeat(72));
  });
} else {
  // ---- HTTP mode (no certs found) ----------------------------------------
  logger.warn('No TLS certificates found — starting in plain HTTP mode.');
  logger.warn('  See README.md for instructions on generating certs.');

  app.listen(HTTP_PORT, HOST, () => {
    logger.info('═'.repeat(72));
    logger.info('  HelpButton.qs Demo Server  (HTTP)');
    logger.info(`  Listening on:  http://${HOST}:${HTTP_PORT}`);
    logger.info(`  Bug reports:   POST http://${HOST}:${HTTP_PORT}/api/bug-reports`);
    logger.info(`  Feedback:      POST http://${HOST}:${HTTP_PORT}/api/feedback`);
    logger.info(`  Health check:  GET  http://${HOST}:${HTTP_PORT}/health`);
    logger.info(`  Log level:     ${LOG_LEVEL}`);
    logger.info('═'.repeat(72));
  });
}
