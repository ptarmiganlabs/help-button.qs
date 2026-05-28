"use strict";

// Load .env file (if present) before reading any process.env values
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const winston = require("winston");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ---------------------------------------------------------------------------
// Configuration via environment variables
// ---------------------------------------------------------------------------
const HOST = process.env.HOST || "localhost";
const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const DEBUG_LOG_AUTH = process.env.DEBUG_LOG_AUTH === "true";

// ---------------------------------------------------------------------------
// TLS certificate paths
// ---------------------------------------------------------------------------
const CERT_DIR = path.join(__dirname, "certs");
const CERT_PATH = process.env.TLS_CERT || path.join(CERT_DIR, "cert.pem");
const KEY_PATH = process.env.TLS_KEY || path.join(CERT_DIR, "key.pem");

// ---------------------------------------------------------------------------
// Winston logger — follows the pattern from github.com/ptarmiganlabs/butler
// ---------------------------------------------------------------------------
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console({
      name: "console",
      level: LOG_LEVEL,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
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
const dashboardClients = new Set();

function storeEntry(list, entry, req) {
  // Detect authentication strategy from request headers
  let authType = "none";
  let authDetails = "";

  const authHeader = req.get("Authorization");

  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      authType = "header";
      if (DEBUG_LOG_AUTH) {
        // Mask token but show first/last bits for debugging (only when explicitly enabled)
        const token = authHeader.substring(7);
        const masked =
          token.length > 12
            ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}`
            : "***";
        authDetails = `Bearer token: ${masked}`;
      } else {
        // Do not store or log any token-derived data by default
        authDetails = "Bearer token present";
      }
    } else {
      authType = "custom";
      authDetails = "Authorization header (non-Bearer)";
    }
  } else {
    // Check for other headers with a custom/vendor prefix to
    // distinguish 'custom' from 'none', without relying on a
    // brittle allowlist of standard browser headers.
    const customHeaders = Object.keys(req.headers).filter(function (h) {
      const name = h.toLowerCase();
      return name.indexOf("x-") === 0;
    });

    if (customHeaders.length > 0) {
      authType = "custom";
      authDetails = `${customHeaders.length} custom header(s): ${customHeaders.join(", ")}`;
    }
  }

  entry.auth = { type: authType, details: authDetails };

  list.unshift(entry);
  if (list.length > MAX_STORED) list.length = MAX_STORED;
}

// ---------------------------------------------------------------------------
// Default context key names — used to detect custom payload key mappings.
// These match the camelCase defaults defined in the extension's
// object-properties.js → payloadKeyNames.
// ---------------------------------------------------------------------------
const DEFAULT_CONTEXT_KEYS = new Set([
  "userName",
  "platform",
  "appId",
  "sheetId",
  "urlPath",
  "timestamp",
  "userId",
  "userDirectory",
  "senseVersion",
  "browser",
  "tenantId",
  "status",
  "picture",
  "preferredZoneinfo",
  "roles",
]);

// ---------------------------------------------------------------------------
// Helpers — format context fields for console output
// ---------------------------------------------------------------------------

/**
 * Pretty-print all context fields in a key: value format.
 * Adapts to whatever fields are present rather than hard-coding.
 */
function formatContextFields(context) {
  if (!context || typeof context !== "object") return "  (no context)";
  const lines = [];
  for (const [key, value] of Object.entries(context)) {
    // Pad key for alignment (right-align keys in a 20-char column)
    const label = formatContextLabel(key);
    lines.push(`  ${label.padStart(22)}: ${value}`);
  }
  return lines.join("\n");
}

/**
 * Return true if the context object contains any key that is NOT in the
 * default camelCase set (i.e. the user has customised payload key names).
 */
function hasCustomKeyNames(context) {
  if (!context || typeof context !== "object") return false;
  return Object.keys(context).some((k) => !DEFAULT_CONTEXT_KEYS.has(k));
}

// ---------------------------------------------------------------------------
// HTML helpers — build a dashboard page from stored entries
// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatContextLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
}

function renderContextTable(context) {
  if (
    !context ||
    typeof context !== "object" ||
    Object.keys(context).length === 0
  ) {
    return '<p class="empty">No context fields</p>';
  }
  let html = '<table class="ctx">';
  for (const [key, value] of Object.entries(context)) {
    const label = formatContextLabel(key);
    html += `<tr><td class="ctx-key">${escapeHtml(label)}</td><td class="ctx-val">${escapeHtml(String(value))}</td></tr>`;
  }
  html += "</table>";
  return html;
}

function renderStars(rating) {
  if (typeof rating !== "number" || !Number.isFinite(rating)) return "";
  const safeRating = Math.floor(rating);
  if (safeRating < 1 || safeRating > 5) return "";
  return (
    '<span class="stars">' +
    "★".repeat(safeRating) +
    "☆".repeat(5 - safeRating) +
    ` (${safeRating}/5)</span>`
  );
}

function renderAuthHtml(auth) {
  if (!auth || auth.type === "none") return '<span class="ts">None</span>';
  const typeLabel = {
    header: "🛡️ Authorization (Bearer)",
    custom: "⚙️ Custom Headers",
  };
  return `<span class="ts" title="${escapeHtml(auth.details || "")}">${typeLabel[auth.type] || escapeHtml(auth.type)}${auth.details ? " ℹ️" : ""}</span>`;
}

function renderNoData(message) {
  return `<div class="no-data">${escapeHtml(message)}</div>`;
}

function renderBugCard(entry) {
  const severityHtml = { low: "🟢 Low", medium: "🟡 Medium", high: "🔴 High" };
  const severity = entry.severity
    ? `<div class="severity">${severityHtml[entry.severity] || escapeHtml(entry.severity)}</div>`
    : "";
  const description = entry.description
    ? `<div class="desc">${escapeHtml(entry.description.length > 200 ? entry.description.substring(0, 200) + "…" : entry.description)}</div>`
    : "";
  const clientTimestamp = entry.clientTimestamp
    ? `<span class="ts" title="Client timestamp">${escapeHtml(entry.clientTimestamp)}</span>`
    : "";
  const auth = `<div class="card-footer"><span class="badge auth-badge">Auth: ${renderAuthHtml(entry.auth)}</span></div>`;

  return `<div class="card bug" data-entry-id="${escapeHtml(entry.id || "")}"><div class="card-header"><span class="badge bug-badge">BUG REPORT</span>${clientTimestamp}<span class="ts">${escapeHtml(entry.receivedAt)}</span></div>${renderContextTable(entry.context)}${severity}${description}${auth}</div>`;
}

function renderFeedbackCard(entry) {
  const rating = entry.rating
    ? `<div class="rating">${renderStars(entry.rating)}</div>`
    : "";
  const comment = entry.comment
    ? `<div class="desc">${escapeHtml(entry.comment.length > 200 ? entry.comment.substring(0, 200) + "…" : entry.comment)}</div>`
    : "";
  const clientTimestamp = entry.clientTimestamp
    ? `<span class="ts" title="Client timestamp">${escapeHtml(entry.clientTimestamp)}</span>`
    : "";
  const auth = `<div class="card-footer"><span class="badge auth-badge">Auth: ${renderAuthHtml(entry.auth)}</span></div>`;

  return `<div class="card fb" data-entry-id="${escapeHtml(entry.id || "")}"><div class="card-header"><span class="badge fb-badge">FEEDBACK</span>${clientTimestamp}<span class="ts">${escapeHtml(entry.receivedAt)}</span></div>${renderContextTable(entry.context)}${rating}${comment}${auth}</div>`;
}

function renderBugList(entries) {
  return entries.length > 0
    ? entries.map((entry) => renderBugCard(entry)).join("")
    : renderNoData("No bug reports received yet");
}

function renderFeedbackList(entries) {
  return entries.length > 0
    ? entries.map((entry) => renderFeedbackCard(entry)).join("")
    : renderNoData("No feedback received yet");
}

function createDashboardSnapshot() {
  return {
    bugReportsHtml: renderBugList(bugReports),
    bugReportCount: bugReports.length,
    feedbackHtml: renderFeedbackList(feedbackEntries),
    feedbackCount: feedbackEntries.length,
  };
}

function writeSseEvent(res, eventName, payload) {
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastDashboardEvent(eventName, payload) {
  for (const client of dashboardClients) {
    try {
      writeSseEvent(client, eventName, payload);
    } catch (error) {
      dashboardClients.delete(client);
      logger.warn(`SSE broadcast failed: ${error.message}`);
    }
  }
}

function renderDashboardScript() {
  return `<script>
(() => {
  const maxStored = ${MAX_STORED};
  const streamTargets = {
    bugReport: { listId: "bug-report-list", countId: "bug-report-count" },
    feedback: { listId: "feedback-list", countId: "feedback-count" },
  };
  const streamStatus = document.getElementById("stream-status");

  function setStreamStatus(state, label) {
    if (!streamStatus) return;
    streamStatus.dataset.state = state;
    streamStatus.textContent = label;
  }

  function getList(kind) {
    const target = streamTargets[kind];
    return target ? document.getElementById(target.listId) : null;
  }

  function setCount(kind, count) {
    const target = streamTargets[kind];
    const countNode = target ? document.getElementById(target.countId) : null;
    if (countNode) {
      countNode.textContent = String(count);
    }
  }

  function trimCards(listNode) {
    const cards = listNode.querySelectorAll(".card");
    for (let index = maxStored; index < cards.length; index += 1) {
      cards[index].remove();
    }
  }

  function animateNewCard(cardNode) {
    if (!cardNode) return;

    cardNode.classList.add("card-live-added");
    cardNode.addEventListener(
      "animationend",
      () => {
        cardNode.classList.remove("card-live-added");
      },
      { once: true },
    );
  }

  function setListContent(kind, html, count) {
    const listNode = getList(kind);
    if (!listNode) return;
    listNode.innerHTML = html;
    setCount(kind, count);
  }

  function prependCard(kind, html, count) {
    const listNode = getList(kind);
    if (!listNode) return;

    const emptyState = listNode.querySelector(".no-data");
    if (emptyState) {
      emptyState.remove();
    }

    listNode.insertAdjacentHTML("afterbegin", html);
    animateNewCard(listNode.firstElementChild);
    trimCards(listNode);
    setCount(kind, count);
  }

  if (!window.EventSource) {
    setStreamStatus("offline", "Live updates unavailable in this browser");
    return;
  }

  const stream = new EventSource("/api/stream");

  stream.addEventListener("open", () => {
    setStreamStatus("live", "Live updates connected");
  });

  stream.addEventListener("snapshot", (event) => {
    try {
      const payload = JSON.parse(event.data);
      setListContent("bugReport", payload.bugReportsHtml, payload.bugReportCount);
      setListContent("feedback", payload.feedbackHtml, payload.feedbackCount);
      setStreamStatus("live", "Live updates connected");
    } catch (error) {
      console.error("Failed to apply dashboard snapshot", error);
    }
  });

  stream.addEventListener("bug-report", (event) => {
    try {
      const payload = JSON.parse(event.data);
      prependCard("bugReport", payload.html, payload.count);
      setStreamStatus("live", "Live updates connected");
    } catch (error) {
      console.error("Failed to apply bug-report event", error);
    }
  });

  stream.addEventListener("feedback", (event) => {
    try {
      const payload = JSON.parse(event.data);
      prependCard("feedback", payload.html, payload.count);
      setStreamStatus("live", "Live updates connected");
    } catch (error) {
      console.error("Failed to apply feedback event", error);
    }
  });

  stream.addEventListener("error", () => {
    setStreamStatus("reconnecting", "Reconnecting live updates...");
  });
})();
</script>`;
}

function renderDashboard() {
  const snapshot = createDashboardSnapshot();

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
.subtitle{display:flex;flex-wrap:wrap;gap:10px;align-items:center;color:#6b7280;font-size:13px;margin-bottom:24px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
.col h2{font-size:16px;margin-bottom:12px;color:#374151;border-bottom:2px solid #d1d5db;padding-bottom:6px}
.entry-list{min-height:48px}
.card{background:#fff;border-radius:8px;padding:14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.card-live-added{animation:card-arrive .45s ease-out}
@keyframes card-arrive{0%{opacity:0;transform:translateY(-8px) scale(.985);box-shadow:0 10px 24px rgba(12,50,86,.08)}100%{opacity:1;transform:translateY(0) scale(1);box-shadow:0 1px 3px rgba(0,0,0,.08)}}
@media(prefers-reduced-motion:reduce){.card-live-added{animation:none}}
.card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.badge{font-size:11px;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:4px;letter-spacing:.04em}
.bug-badge{background:#fef2f2;color:#dc2626}
.fb-badge{background:#f5f3ff;color:#7c3aed}
.auth-badge{background:#fefcf2;color:#854d0e;margin-left:auto}
.stream-status{display:inline-flex;align-items:center;padding:3px 8px;border-radius:999px;font-size:12px;font-weight:600;background:#e5e7eb;color:#374151}
.stream-status[data-state="live"]{background:#ecfdf5;color:#047857}
.stream-status[data-state="reconnecting"]{background:#fff7ed;color:#c2410c}
.stream-status[data-state="offline"]{background:#f3f4f6;color:#6b7280}
.card-footer{display:flex;justify-content:flex-end;align-items:center;margin-top:8px;border-top:1px solid #f3f4f6;padding-top:4px}
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
<p class="subtitle">Received submissions (last ${MAX_STORED} of each type, most recent first). New entries appear automatically.<span id="stream-status" class="stream-status" data-state="connecting">Connecting live updates...</span></p>
<div class="grid">
<div class="col"><h2>Bug Reports (<span id="bug-report-count">${snapshot.bugReportCount}</span>)</h2><div id="bug-report-list" class="entry-list">${snapshot.bugReportsHtml}</div></div>
<div class="col"><h2>Feedback (<span id="feedback-count">${snapshot.feedbackCount}</span>)</h2><div id="feedback-list" class="entry-list">${snapshot.feedbackHtml}</div></div>
</div>
${renderDashboardScript()}
</body>
</html>`;
}

function registerDashboardClient(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  dashboardClients.add(res);
  writeSseEvent(res, "snapshot", createDashboardSnapshot());

  req.on("close", () => {
    dashboardClients.delete(res);
  });
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();

// Parse JSON bodies
app.use(express.json({ limit: "1mb" }));

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
app.get("/", (_req, res) => {
  res.type("html").send(renderDashboard());
});

/**
 * Health check endpoint.
 * GET /health
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

/**
 * Dashboard live updates.
 * GET /api/stream
 */
app.get("/api/stream", (req, res) => {
  registerDashboardClient(req, res);
});

/**
 * Bug report endpoint.
 * POST /api/bug-reports
 *
 * Accepts any JSON payload with { timestamp, context, description }.
 * Context fields are displayed adaptively — whatever is sent is shown.
 */
app.post("/api/bug-reports", (req, res) => {
  const { timestamp, context, description, severity } = req.body;

  // --- Validation ---
  const errors = [];
  if (!timestamp) errors.push("Missing required field: timestamp");
  if (!context || typeof context !== "object")
    errors.push("Missing or invalid field: context");
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    errors.push("Missing or empty field: description");
  }

  if (errors.length > 0) {
    logger.warn(
      `BUG REPORT: Rejected — validation failed: ${errors.join("; ")}`,
    );
    return res.status(400).json({ status: "error", errors });
  }

  // --- Store ---
  // The client-provided timestamp may use any of the supported format strings
  // (e.g. ISO 8601, locale-specific, compact) configured in the extension.
  // We store both the original client timestamp and a server-side receivedAt.
  const entry = {
    id: `br-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    clientTimestamp: timestamp,
    context,
    description,
    severity: severity || null,
  };
  storeEntry(bugReports, entry, req);
  broadcastDashboardEvent("bug-report", {
    html: renderBugCard(entry),
    count: bugReports.length,
  });

  // --- Log (adaptive — shows whatever context fields are present) ---
  const descExcerpt =
    description.length > 80 ? description.substring(0, 80) + "…" : description;

  const severityIcons = { low: "🟢", medium: "🟡", high: "🔴" };

  logger.info("─".repeat(72));
  logger.info(`BUG REPORT received at ${timestamp}`);
  logger.info(
    `                Auth: ${entry.auth.type} (${entry.auth.details || "no details"})`,
  );
  logger.info(formatContextFields(context));
  if (severity) {
    logger.info(
      `              Severity: ${severityIcons[severity] || "?"} ${severity}`,
    );
  }
  logger.info(`           Description: ${descExcerpt}`);
  logger.info("─".repeat(72));

  // When custom payload key names are detected, log the full payload at info
  // level so operators can see the remapped keys without switching to verbose.
  if (hasCustomKeyNames(context)) {
    logger.info(
      "BUG REPORT: Custom payload key names detected — full payload:",
    );
    logger.info(JSON.stringify(req.body, null, 2));
  }

  // Full payload at verbose level for debugging
  logger.verbose(
    `BUG REPORT: Full payload:\n${JSON.stringify(req.body, null, 2)}`,
  );

  res.json({
    status: "ok",
    message: "Bug report received",
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
app.post("/api/feedback", (req, res) => {
  const { timestamp, context, rating, comment } = req.body;

  // --- Validation ---
  const errors = [];
  if (!timestamp) errors.push("Missing required field: timestamp");
  if (!context || typeof context !== "object")
    errors.push("Missing or invalid field: context");

  // At least one of rating or comment must be provided
  const hasRating = Number.isInteger(rating) && rating >= 1 && rating <= 5;
  const hasComment = typeof comment === "string" && comment.trim().length > 0;
  const safeRating = hasRating ? rating : null;

  if (!hasRating && !hasComment) {
    errors.push("At least one of rating (1-5) or comment must be provided");
  }

  if (typeof rating !== "undefined" && !hasRating) {
    errors.push("Rating must be an integer between 1 and 5");
  }

  if (errors.length > 0) {
    logger.warn(`FEEDBACK: Rejected — validation failed: ${errors.join("; ")}`);
    return res.status(400).json({ status: "error", errors });
  }

  // --- Store ---
  // The client-provided timestamp may use any of the supported format strings
  // (e.g. ISO 8601, locale-specific, compact) configured in the extension.
  // We store both the original client timestamp and a server-side receivedAt.
  const entry = {
    id: `fb-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    clientTimestamp: timestamp,
    context,
    rating: safeRating,
    comment: hasComment ? comment : null,
  };
  storeEntry(feedbackEntries, entry, req);
  broadcastDashboardEvent("feedback", {
    html: renderFeedbackCard(entry),
    count: feedbackEntries.length,
  });

  // --- Log (adaptive — shows whatever context fields are present) ---
  const commentExcerpt = hasComment
    ? comment.length > 80
      ? comment.substring(0, 80) + "…"
      : comment
    : "(no comment)";

  logger.info("─".repeat(72));
  logger.info(`FEEDBACK received at ${timestamp}`);
  logger.info(
    `                Auth: ${entry.auth.type} (${entry.auth.details || "no details"})`,
  );
  logger.info(formatContextFields(context));
  if (hasRating) {
    logger.info(
      `                Rating: ${"★".repeat(safeRating)}${"☆".repeat(5 - safeRating)} (${safeRating}/5)`,
    );
  }
  logger.info(`               Comment: ${commentExcerpt}`);
  logger.info("─".repeat(72));

  // When custom payload key names are detected, log the full payload at info
  // level so operators can see the remapped keys without switching to verbose.
  if (hasCustomKeyNames(context)) {
    logger.info("FEEDBACK: Custom payload key names detected — full payload:");
    logger.info(JSON.stringify(req.body, null, 2));
  }

  // Full payload at verbose level for debugging
  logger.verbose(
    `FEEDBACK: Full payload:\n${JSON.stringify(req.body, null, 2)}`,
  );

  res.json({
    status: "ok",
    message: "Feedback received",
    id: entry.id,
  });
});

// Catch-all for unknown routes
app.use((req, res) => {
  res
    .status(404)
    .json({
      status: "error",
      message: `Route not found: ${req.method} ${req.url}`,
    });
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
    logger.info("═".repeat(72));
    logger.info("  HelpButton.qs Demo Server  (HTTPS)");

    // Parse and log non-sensitive certificate info
    try {
      const x509 = new crypto.X509Certificate(certRaw);
      logger.info("  Certificate Info:");
      logger.info(`    Subject:          ${x509.subject}`);
      logger.info(`    Issuer:           ${x509.issuer}`);
      logger.info(`    Valid to:         ${x509.validTo}`);
      if (x509.subjectAltName) {
        logger.info(`    Subject Alt Name: ${x509.subjectAltName}`);
      }
    } catch {
      logger.warn("  (Could not parse certificate details)");
    }

    logger.info(`  Listening on:  https://${HOST}:${HTTPS_PORT}`);
    logger.info(`  Dashboard:     GET  https://${HOST}:${HTTPS_PORT}/`);
    logger.info(`  Live stream:   GET  https://${HOST}:${HTTPS_PORT}/api/stream`);
    logger.info(
      `  Bug reports:   POST https://${HOST}:${HTTPS_PORT}/api/bug-reports`,
    );
    logger.info(
      `  Feedback:      POST https://${HOST}:${HTTPS_PORT}/api/feedback`,
    );
    logger.info(`  Health check:  GET  https://${HOST}:${HTTPS_PORT}/health`);
    logger.info(`  Log level:     ${LOG_LEVEL}`);
    logger.info("═".repeat(72));
  });
} else {
  // ---- HTTP mode (no certs found) ----------------------------------------
  logger.warn("No TLS certificates found — starting in plain HTTP mode.");
  logger.warn("  See README.md for instructions on generating certs.");

  app.listen(HTTP_PORT, HOST, () => {
    logger.info("═".repeat(72));
    logger.info("  HelpButton.qs Demo Server  (HTTP)");
    logger.info(`  Listening on:  http://${HOST}:${HTTP_PORT}`);
    logger.info(`  Dashboard:     GET  http://${HOST}:${HTTP_PORT}/`);
    logger.info(`  Live stream:   GET  http://${HOST}:${HTTP_PORT}/api/stream`);
    logger.info(
      `  Bug reports:   POST http://${HOST}:${HTTP_PORT}/api/bug-reports`,
    );
    logger.info(
      `  Feedback:      POST http://${HOST}:${HTTP_PORT}/api/feedback`,
    );
    logger.info(`  Health check:  GET  http://${HOST}:${HTTP_PORT}/health`);
    logger.info(`  Log level:     ${LOG_LEVEL}`);
    logger.info("═".repeat(72));
  });
}
