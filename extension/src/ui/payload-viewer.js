/**
 * Shared payload-viewer modal for the bug-report and feedback dialogs.
 *
 * Renders a modal overlay showing the resolved webhook URL, HTTP method,
 * request headers (with sensitive values redacted), and the JSON body.
 * Restores keyboard focus when the viewer is closed.
 */

import { makeSvg } from "./icons";
import { escapeHtml } from "../util/template-fields";
import { getTranslation } from "../i18n/index";

// ---------------------------------------------------------------------------
// Header redaction helpers
// ---------------------------------------------------------------------------

/**
 * Return true if the given header name is considered sensitive and its value
 * should be redacted before display.
 *
 * @param {string} name - HTTP header name.
 * @returns {boolean}
 */
function isSensitiveHeader(name) {
  if (!name) return false;
  const n = String(name).toLowerCase();
  return (
    n === "authorization" ||
    n === "proxy-authorization" ||
    n === "cookie" ||
    n === "set-cookie" ||
    n === "x-api-key" ||
    n === "api-key" ||
    n === "apikey" ||
    n === "x-auth-token" ||
    n === "x-access-token" ||
    n === "access-token" ||
    /\btoken\b/.test(n) ||
    /\bsecret\b/.test(n) ||
    /\bkey\b/.test(n)
  );
}

/**
 * Format a single header value for display.
 * Sensitive values are replaced with "<redacted>".
 *
 * @param {string} name - Header name.
 * @param {*} value - Header value.
 * @returns {string}
 */
function formatHeaderValue(name, value) {
  if (isSensitiveHeader(name)) return "<redacted>";
  if (Array.isArray(value)) return value.join(", ");
  return String(value === null || value === undefined ? "" : value);
}

/**
 * Build an array of "Name: Value" strings for display in the payload viewer.
 *
 * When the actual `headers` object is provided (from `buildAuthHeaders()`),
 * it is used as the single source of truth with sensitive values redacted.
 * Otherwise the auth-strategy parameters are used as a fallback.
 *
 * @param {string} authStrategy - Auth strategy name.
 * @param {string} authToken - Bearer token (header strategy).
 * @param {string} authHeaderName - Custom auth header name (header strategy).
 * @param {string} authHeaderValue - Custom auth header value (header strategy).
 * @param {*} customHeaders - Custom headers array/object (custom strategy).
 * @param {object|null} headers - Actual headers built by buildAuthHeaders().
 * @returns {string[]} Array of display lines.
 */
export function buildHeaderDisplay(
  authStrategy,
  authToken,
  authHeaderName,
  authHeaderValue,
  customHeaders,
  headers,
) {
  const display = [];

  // Use the actual headers object when available.
  if (headers && typeof headers === "object" && !Array.isArray(headers)) {
    const entries = Object.entries(headers);
    const hasContentType = entries.some(
      ([k]) => String(k).toLowerCase() === "content-type",
    );
    if (!hasContentType) {
      display.push("Content-Type: application/json");
    }
    entries.forEach(([k, v]) => {
      display.push(`${k}: ${formatHeaderValue(k, v)}`);
    });
    return display;
  }

  // Fallback: derive from auth-strategy parameters.
  display.push("Content-Type: application/json");

  if (authStrategy === "header") {
    if (authHeaderName && authHeaderValue) {
      display.push(
        `${authHeaderName}: ${formatHeaderValue(authHeaderName, authHeaderValue)}`,
      );
    } else if (authToken) {
      display.push("Authorization: <redacted>");
    }
  } else if (authStrategy === "sense-session") {
    display.push("X-Qlik-Xrfkey: <generated>");
  } else if (authStrategy === "custom") {
    if (Array.isArray(customHeaders)) {
      customHeaders.forEach((h) => {
        if (h && h.name) {
          display.push(`${h.name}: ${formatHeaderValue(h.name, h.value)}`);
        }
      });
    } else if (customHeaders && typeof customHeaders === "object") {
      Object.entries(customHeaders).forEach(([k, v]) => {
        display.push(`${k}: ${formatHeaderValue(k, v)}`);
      });
    }
  }

  return display;
}

// ---------------------------------------------------------------------------
// JSON syntax highlighting
// ---------------------------------------------------------------------------

/**
 * Convert a JSON object to an HTML string with syntax highlighting.
 *
 * All non-matched structural characters are HTML-escaped so that the
 * resulting string is safe to assign to `innerHTML`.
 *
 * @param {object} obj - The object to stringify and highlight.
 * @returns {string} HTML string with syntax-highlighting spans.
 */
export function syntaxHighlightJson(obj) {
  const json = JSON.stringify(obj, null, 2);
  const pattern =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

  let result = "";
  let lastIndex = 0;

  json.replace(pattern, (match, ...rest) => {
    // `rest` contains capture groups and then offset, string, groups.
    // offset is always at index rest.length - 2 (before the source string).
    const offset = rest[rest.length - 2];
    // Escape structural characters (brackets, commas, whitespace) before match.
    result += escapeHtml(json.slice(lastIndex, offset));
    lastIndex = offset + match.length;

    let cls = "hl-number";
    if (/^"/.test(match)) {
      cls = /:$/.test(match) ? "hl-key" : "hl-string";
    } else if (/true|false/.test(match)) {
      cls = "hl-bool";
    } else if (/null/.test(match)) {
      cls = "hl-null";
    }

    result += '<span class="' + cls + '">' + escapeHtml(match) + "</span>";
    return match;
  });

  // Escape any remaining structural characters after the last match.
  result += escapeHtml(json.slice(lastIndex));
  return result;
}

// ---------------------------------------------------------------------------
// Payload viewer modal
// ---------------------------------------------------------------------------

/**
 * Show a modal overlay with request details (URL, method, headers, body).
 *
 * Sensitive header values are redacted. Focus is restored to `focusTarget`
 * when the viewer is closed via any close path (X button, footer Close
 * button, backdrop click, or Escape key).
 *
 * @param {object} payload - The JSON payload object.
 * @param {string} url - The resolved webhook URL.
 * @param {object} headers - Headers built by buildAuthHeaders() (Content-Type included).
 * @param {string} authStrategy - Auth strategy used.
 * @param {string} authToken - Auth token (header strategy).
 * @param {string} authHeaderName - Custom auth header name.
 * @param {string} authHeaderValue - Custom auth header value.
 * @param {*} customHeaders - Custom headers array/object.
 * @param {HTMLElement|null} focusTarget - Element to restore focus to on close.
 */
export function showPayloadViewer(
  payload,
  url,
  headers,
  authStrategy,
  authToken,
  authHeaderName,
  authHeaderValue,
  customHeaders,
  focusTarget,
) {
  const overlay = document.createElement("div");
  overlay.className = "hbqs-payload-overlay";

  const modal = document.createElement("div");
  modal.className = "hbqs-payload-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute(
    "aria-label",
    getTranslation("payloadViewerAriaLabel"),
  );

  const closeViewer = () => {
    overlay.remove();
    if (focusTarget) focusTarget.focus();
  };

  // Header row (title + X close button)
  const headerEl = document.createElement("div");
  headerEl.className = "hbqs-payload-header";

  const titleEl = document.createElement("h3");
  titleEl.className = "hbqs-payload-title";
  titleEl.textContent = getTranslation("payloadViewerTitle");
  headerEl.appendChild(titleEl);

  const closeBtn = document.createElement("button");
  closeBtn.className = "hbqs-payload-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", getTranslation("payloadViewerClose"));
  closeBtn.innerHTML = makeSvg("close", 18);
  closeBtn.addEventListener("click", closeViewer);
  headerEl.appendChild(closeBtn);

  modal.appendChild(headerEl);

  // Body
  const bodyEl = document.createElement("div");
  bodyEl.className = "hbqs-payload-body";

  // URL section
  const urlSection = document.createElement("div");
  urlSection.className = "hbqs-payload-section";
  const urlTitle = document.createElement("div");
  urlTitle.className = "hbqs-payload-section-title";
  urlTitle.textContent = getTranslation("payloadViewerUrl");
  urlSection.appendChild(urlTitle);
  const urlPre = document.createElement("pre");
  urlPre.className = "hbqs-payload-code hl-url";
  urlPre.textContent = url;
  urlSection.appendChild(urlPre);
  bodyEl.appendChild(urlSection);

  // Method section
  const methodSection = document.createElement("div");
  methodSection.className = "hbqs-payload-section";
  const methodTitle = document.createElement("div");
  methodTitle.className = "hbqs-payload-section-title";
  methodTitle.textContent = getTranslation("payloadViewerMethod");
  methodSection.appendChild(methodTitle);
  const methodPre = document.createElement("pre");
  methodPre.className = "hbqs-payload-code hl-method";
  methodPre.textContent = "POST";
  methodSection.appendChild(methodPre);
  bodyEl.appendChild(methodSection);

  // Headers section
  const headersSection = document.createElement("div");
  headersSection.className = "hbqs-payload-section";
  const headersTitle = document.createElement("div");
  headersTitle.className = "hbqs-payload-section-title";
  headersTitle.textContent = getTranslation("payloadViewerHeaders");
  headersSection.appendChild(headersTitle);
  const headersPre = document.createElement("pre");
  headersPre.className = "hbqs-payload-code hl-headers";
  headersPre.textContent = buildHeaderDisplay(
    authStrategy,
    authToken,
    authHeaderName,
    authHeaderValue,
    customHeaders,
    headers,
  ).join("\n");
  headersSection.appendChild(headersPre);
  bodyEl.appendChild(headersSection);

  // Body section
  const bodySectionEl = document.createElement("div");
  bodySectionEl.className = "hbqs-payload-section";
  const bodyTitle = document.createElement("div");
  bodyTitle.className = "hbqs-payload-section-title";
  bodyTitle.textContent = getTranslation("payloadViewerBody");
  bodySectionEl.appendChild(bodyTitle);
  const bodyPre = document.createElement("pre");
  bodyPre.className = "hbqs-payload-code hl-body";
  bodyPre.innerHTML = syntaxHighlightJson(payload);
  bodySectionEl.appendChild(bodyPre);
  bodyEl.appendChild(bodySectionEl);

  modal.appendChild(bodyEl);

  // Footer
  const footerEl = document.createElement("div");
  footerEl.className = "hbqs-payload-footer";
  const closeFooterBtn = document.createElement("button");
  closeFooterBtn.className = "hbqs-bug-report-btn hbqs-bug-report-btn-cancel";
  closeFooterBtn.type = "button";
  closeFooterBtn.textContent = getTranslation("payloadViewerClose");
  closeFooterBtn.addEventListener("click", closeViewer);
  footerEl.appendChild(closeFooterBtn);
  modal.appendChild(footerEl);

  overlay.appendChild(modal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeViewer();
  });

  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeViewer();
  });

  document.body.appendChild(overlay);
  modal.setAttribute("tabindex", "-1");
  modal.focus();
}
