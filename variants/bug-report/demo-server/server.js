'use strict';

// Load .env file (if present) before reading any process.env values
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const winston = require('winston');
const https = require('https');
const fs = require('fs');
const path = require('path');

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
 * Expected payload:
 * {
 *   "timestamp": "2026-02-14T10:30:45.123Z",
 *   "context": {
 *     "userName": "Göran Sander",
 *     "userDirectory": "LAB",
 *     "userId": "goran",
 *     "senseVersion": "November 2025 (v14.254.6)",
 *     "appId": "4634fbc8-65eb-4aff-a686-34e75326e534",
 *     "sheetId": "tAyTET",
 *     "urlPath": "/sense/app/4634fbc8-.../sheet/tAyTET/state/analysis"
 *   },
 *   "description": "Free-text description of the issue"
 * }
 */
app.post('/api/bug-reports', (req, res) => {
  const { timestamp, context, description } = req.body;

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

  // --- Log the bug report ---
  const user = context.userName || context.userId || '(unknown user)';
  const userDir = context.userDirectory ? `${context.userDirectory}\\` : '';
  const userId = context.userId || '';
  const app = context.appId || '(no app)';
  const sheet = context.sheetId || '(no sheet)';
  const version = context.senseVersion || '(unknown version)';

  // Truncate description for the summary line (max 80 chars)
  const descExcerpt = description.length > 80
    ? description.substring(0, 80) + '…'
    : description;

  logger.info('─'.repeat(72));
  logger.info(`BUG REPORT received at ${timestamp}`);
  logger.info(`  User:      ${user} (${userDir}${userId})`);
  logger.info(`  Version:   ${version}`);
  logger.info(`  App:       ${app}`);
  logger.info(`  Sheet:     ${sheet}`);
  logger.info(`  Description: ${descExcerpt}`);
  logger.info('─'.repeat(72));

  // Full payload at verbose level for debugging
  logger.verbose(`BUG REPORT: Full payload:\n${JSON.stringify(req.body, null, 2)}`);

  res.json({
    status: 'ok',
    message: 'Bug report received',
    id: `br-${Date.now()}`,
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
  const tlsOptions = {
    cert: fs.readFileSync(CERT_PATH),
    key: fs.readFileSync(KEY_PATH),
  };

  https.createServer(tlsOptions, app).listen(HTTPS_PORT, HOST, () => {
    logger.info('═'.repeat(72));
    logger.info('  HelpButton.qs Demo Server  (HTTPS)');
    logger.info(`  Listening on:  https://${HOST}:${HTTPS_PORT}`);
    logger.info(`  Bug reports:   POST https://${HOST}:${HTTPS_PORT}/api/bug-reports`);
    logger.info(`  Health check:  GET  https://${HOST}:${HTTPS_PORT}/health`);
    logger.info(`  Log level:     ${LOG_LEVEL}`);

    // Note!! In a production server, you would NOT log the cert paths like this — this is just for demo purposes.
    logger.info(`  TLS cert:      ${CERT_PATH}`);
    logger.info(`  TLS key:       ${KEY_PATH}`);
    logger.info('═'.repeat(72));
  });
} else {
  // ---- HTTP mode (no certs found) ----------------------------------------
  logger.warn('No TLS certificates found — starting in plain HTTP mode.');
  logger.warn(`  Looked for cert: ${CERT_PATH}`);
  logger.warn(`  Looked for key:  ${KEY_PATH}`);
  logger.warn('  See README.md in demo-server/ for instructions on generating certs.');

  app.listen(HTTP_PORT, HOST, () => {
    logger.info('═'.repeat(72));
    logger.info('  HelpButton.qs Demo Server  (HTTP)');
    logger.info(`  Listening on:  http://${HOST}:${HTTP_PORT}`);
    logger.info(`  Bug reports:   POST http://${HOST}:${HTTP_PORT}/api/bug-reports`);
    logger.info(`  Health check:  GET  http://${HOST}:${HTTP_PORT}/health`);
    logger.info(`  Log level:     ${LOG_LEVEL}`);
    logger.info('═'.repeat(72));
  });
}
