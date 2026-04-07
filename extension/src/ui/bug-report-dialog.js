/**
 * Bug-report dialog component for HelpButton.qs.
 *
 * Modal overlay with a form that collects bug-report data and
 * submits it to a configurable webhook URL.  Context data (user info,
 * Qlik Sense version, app/sheet IDs) is gathered asynchronously and
 * displayed as read-only form fields — matching the HTML injection
 * variant's polished look.
 */

import { makeSvg } from "./icons";
import { escapeHtml, resolveTemplateFields } from "../util/template-fields";
import { resolveText } from "../i18n/index";
import logger from "../util/logger";
import { fetchSenseVersionLabel } from "../util/product-info";
import {
  formatTimestamp,
  DEFAULT_DIALOG_FORMAT,
  DEFAULT_PAYLOAD_FORMAT,
} from "../util/timestamp-formats";
import { createTabbedMarkdownEditor } from "./markdown-toolbar";

// ---------------------------------------------------------------------------
// Field labels — maps internal field keys to user-visible labels.
// Matches the HTML variant's FIELD_LABELS dictionary.
// ---------------------------------------------------------------------------
const DEFAULT_FIELD_LABELS = {
  userId: "User ID",
  userName: "User Name",
  userDirectory: "User Directory",
  senseVersion: "Qlik Sense Version",
  appId: "App ID",
  sheetId: "Sheet ID",
  urlPath: "URL Path",
  platform: "Platform",
  browser: "Browser",
  timestamp: "Timestamp",
  tenantId: "Tenant ID",
  status: "Status",
  picture: "Picture",
  preferredZoneinfo: "Preferred Zone Info",
  roles: "Roles",
};

// Fields that should render side-by-side in a paired row.
// Key = first field, value = second field.
const PAIRED_FIELDS = {
  userName: "platform",
  appId: "sheetId",
  userDirectory: "userId",
};

// Canonical display order for context fields.
const FIELD_ORDER = [
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
];

/**
 * @typedef {object} BugReportConfig
 * @property {string} webhookUrl - URL to POST bug reports to.
 * @property {string} [authStrategy] - Auth strategy: 'none', 'header', 'sense-session', 'custom'.
 * @property {string} [authToken] - Bearer token (for 'header' strategy).
 * @property {string} [authHeaderName] - Custom header name (for 'header' strategy).
 * @property {string} [authHeaderValue] - Custom header value (for 'header' strategy).
 * @property {object} [customHeaders] - Additional headers (for 'custom' strategy).
 * @property {string[]} [collectFields] - Context fields to collect and display.
 * @property {object} [dialogStrings] - Overrides for dialog text strings.
 * @property {object} [popupStyle] - Style properties for the dialog.
 */

/**
 * Open the bug-report dialog.
 *
 * @param {BugReportConfig} config - Bug report configuration from layout.
 * @param {'client-managed' | 'cloud'} platformType - Current platform.
 * @returns {void}
 */
export function openBugReportDialog(config, platformType) {
  const {
    webhookUrl = "",
    authStrategy = "none",
    authToken = "",
    authHeaderName = "Authorization",
    authHeaderValue = "",
    customHeaders = {},
    enableSeverity = true,
    descriptionMaxLength = 1000,
    dialogStrings = {},
    dialogTimestampFormat = DEFAULT_DIALOG_FORMAT,
    payloadTimestampFormat = DEFAULT_PAYLOAD_FORMAT,
    showPayloadButton = false,
  } = config;

  // Derive which fields to show in the dialog and which to send in the payload.
  // New config uses dialogFields / payloadFields objects; fall back to legacy
  // comma-separated collectFields string for backward compatibility.
  let dialogFields;
  let payloadFields;

  const defaultOnFields = [
    "userName",
    "appId",
    "sheetId",
    "urlPath",
    "platform",
    "timestamp",
  ];

  // Helper: resolve a field-toggle object where missing keys fall back to
  // their default values (handles instances saved before toggles existed).
  function resolveFieldToggle(obj) {
    return FIELD_ORDER.filter((f) => {
      if (f in obj) return obj[f];
      return defaultOnFields.includes(f);
    });
  }

  if (config.dialogFields && typeof config.dialogFields === "object") {
    dialogFields = resolveFieldToggle(config.dialogFields);
  } else if (typeof config.collectFields === "string") {
    dialogFields = config.collectFields
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (Array.isArray(config.collectFields)) {
    dialogFields = config.collectFields;
  } else {
    dialogFields = defaultOnFields;
  }

  if (config.payloadFields && typeof config.payloadFields === "object") {
    payloadFields = resolveFieldToggle(config.payloadFields);
  } else {
    // Legacy: payload mirrors dialog fields
    payloadFields = dialogFields;
  }

  // Union of both sets — we need to gather data for all of them.
  const allFields = [...new Set([...dialogFields, ...payloadFields])];

  // Remove any existing dialog
  const existing = document.getElementById("hbqs-bug-report-overlay");
  if (existing) existing.remove();

  // Localized strings
  const title = resolveText(dialogStrings.title, "bugReportTitle");
  const descriptionLabel = resolveText(
    dialogStrings.descriptionLabel,
    "bugReportDescriptionLabel",
  );
  const descriptionPlaceholder = resolveText(
    dialogStrings.descriptionPlaceholder,
    "bugReportDescriptionPlaceholder",
  );
  const submitText = resolveText(dialogStrings.submitButton, "bugReportSubmit");
  const cancelText = resolveText(dialogStrings.cancelButton, "bugReportCancel");
  const successMsg = resolveText(
    dialogStrings.successMessage,
    "bugReportSuccessMessage",
  );
  const errorMsg = resolveText(
    dialogStrings.errorMessage,
    "bugReportErrorMessage",
  );
  const loadingText = resolveText(
    dialogStrings.loadingMessage,
    "bugReportLoadingMessage",
  );

  // -- Build dialog DOM --
  const overlay = document.createElement("div");
  overlay.id = "hbqs-bug-report-overlay";
  overlay.className = "hbqs-bug-report-overlay";

  const dialog = document.createElement("div");
  dialog.className = "hbqs-bug-report-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", title);

  // Header
  const headerEl = document.createElement("div");
  headerEl.className = "hbqs-bug-report-header";

  const titleEl = document.createElement("h2");
  titleEl.className = "hbqs-bug-report-title";
  titleEl.textContent = title;
  headerEl.appendChild(titleEl);

  const closeBtn = document.createElement("button");
  closeBtn.className = "hbqs-bug-report-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = makeSvg("close", 20);
  closeBtn.addEventListener("click", () => closeDialog());
  headerEl.appendChild(closeBtn);

  dialog.appendChild(headerEl);

  // Toast area (hidden initially — used for success/error messages inside the dialog)
  const toastArea = document.createElement("div");
  toastArea.className = "hbqs-bug-report-toast";
  dialog.appendChild(toastArea);

  // Body — initially shows a loading spinner
  const body = document.createElement("div");
  body.className = "hbqs-bug-report-body";

  const loadingEl = document.createElement("div");
  loadingEl.className = "hbqs-bug-report-loading";
  loadingEl.innerHTML =
    '<div class="hbqs-spinner hbqs-spinner-context"></div>' +
    "<span>" +
    escapeHtml(loadingText) +
    "</span>";
  body.appendChild(loadingEl);

  dialog.appendChild(body);

  // Footer (hidden until context loads)
  const footer = document.createElement("div");
  footer.className = "hbqs-bug-report-actions";
  footer.style.display = "none";
  dialog.appendChild(footer);

  // Prevent Qlik keyboard shortcuts while dialog is open
  dialog.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Escape") closeDialog();
  });

  overlay.appendChild(dialog);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDialog();
  });

  document.body.appendChild(overlay);
  dialog.setAttribute("tabindex", "-1");
  dialog.focus();

  // Track form state
  let selectedSeverity = null; // 'low' | 'medium' | 'high' | null
  let descriptionTextarea = null;

  // -- Gather context asynchronously, then build the form --
  gatherContextData(allFields, platformType, dialogTimestampFormat).then(
    (context) => {
      logger.debug("Context gathered:", JSON.stringify(context, null, 2));

      // Remove loading indicator
      body.removeChild(loadingEl);

      // --- Context fields (read-only inputs) ---
      const rendered = new Set();

      for (const field of dialogFields) {
        if (rendered.has(field)) continue;
        if (context[field] === undefined) continue;

        const pairRight = PAIRED_FIELDS[field];
        if (
          pairRight &&
          dialogFields.includes(pairRight) &&
          context[pairRight] !== undefined
        ) {
          // Render both fields side-by-side
          const row = document.createElement("div");
          row.className = "hbqs-bug-report-field-row";

          const leftWrap = document.createElement("div");
          leftWrap.className = "hbqs-bug-report-field-row-item";
          leftWrap.appendChild(makeReadonlyField(field, context[field]));
          row.appendChild(leftWrap);

          const rightWrap = document.createElement("div");
          rightWrap.className = "hbqs-bug-report-field-row-item";
          rightWrap.appendChild(
            makeReadonlyField(pairRight, context[pairRight]),
          );
          row.appendChild(rightWrap);

          body.appendChild(row);
          rendered.add(pairRight);
        } else {
          body.appendChild(makeReadonlyField(field, context[field]));
        }
        rendered.add(field);
      }

      // --- Severity picker ---
      if (enableSeverity) {
        const severityGroup = document.createElement("div");
        severityGroup.className = "hbqs-bug-report-field-group";

        const severityLabel = document.createElement("label");
        severityLabel.className = "hbqs-bug-report-label";
        severityLabel.textContent =
          resolveText(dialogStrings.severityLabel, "bugReportSeverityLabel") ||
          "Severity";
        severityGroup.appendChild(severityLabel);

        const severityBar = document.createElement("div");
        severityBar.className = "hbqs-severity-bar";
        severityBar.setAttribute("role", "radiogroup");
        severityBar.setAttribute(
          "aria-label",
          resolveText(dialogStrings.severityLabel, "bugReportSeverityLabel") ||
            "Severity",
        );

        const SEVERITY_OPTIONS = [
          {
            value: "low",
            label:
              resolveText(
                dialogStrings.severityLowLabel,
                "bugReportSeverityLowLabel",
              ) || "Low",
            color: "#22c55e",
          },
          {
            value: "medium",
            label:
              resolveText(
                dialogStrings.severityMediumLabel,
                "bugReportSeverityMediumLabel",
              ) || "Medium",
            color: "#eab308",
          },
          {
            value: "high",
            label:
              resolveText(
                dialogStrings.severityHighLabel,
                "bugReportSeverityHighLabel",
              ) || "High",
            color: "#ef4444",
          },
        ];

        for (const opt of SEVERITY_OPTIONS) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "hbqs-severity-btn";
          btn.dataset.severity = opt.value;
          btn.setAttribute("role", "radio");
          btn.setAttribute("aria-checked", "false");
          btn.setAttribute("aria-label", opt.label);

          // Colored circle SVG
          const circle =
            `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">` +
            `<circle cx="7" cy="7" r="6" fill="${opt.color}" stroke="${opt.color}" stroke-width="1"/>` +
            `</svg>`;

          btn.innerHTML = circle + "<span>" + escapeHtml(opt.label) + "</span>";

          btn.addEventListener("click", () => {
            selectedSeverity = opt.value;
            // Update all buttons
            for (const b of severityBar.querySelectorAll(
              ".hbqs-severity-btn",
            )) {
              const isActive = b.dataset.severity === opt.value;
              b.classList.toggle("hbqs-severity-btn-active", isActive);
              b.setAttribute("aria-checked", isActive ? "true" : "false");
            }
            updateSubmitState();
          });

          severityBar.appendChild(btn);
        }

        severityGroup.appendChild(severityBar);
        body.appendChild(severityGroup);
      }

      // --- Description textarea ---
      const descGroup = document.createElement("div");
      descGroup.className = "hbqs-bug-report-field-group";

      const label = document.createElement("label");
      label.className = "hbqs-bug-report-label";
      label.textContent = descriptionLabel;
      label.htmlFor = "hbqs-bug-report-description";
      descGroup.appendChild(label);

      // Tabbed Write/Preview Markdown editor
      const { container: tabbedEditor, textarea: tabbedTextarea } =
        createTabbedMarkdownEditor({
          id: "hbqs-bug-report-description",
          placeholder: descriptionPlaceholder,
          rows: 4,
          maxLength: descriptionMaxLength > 0 ? descriptionMaxLength : 0,
          className: "hbqs-bug-report-textarea",
        });
      descriptionTextarea = tabbedTextarea;
      descGroup.appendChild(tabbedEditor);

      // Character counter
      if (descriptionMaxLength > 0) {
        const counter = document.createElement("div");
        counter.className = "hbqs-feedback-char-counter";
        counter.textContent =
          descriptionMaxLength + " / " + descriptionMaxLength;

        descriptionTextarea.addEventListener("input", () => {
          const remaining =
            descriptionMaxLength - descriptionTextarea.value.length;
          counter.textContent = remaining + " / " + descriptionMaxLength;
          if (remaining < 0) {
            counter.classList.add("hbqs-feedback-char-counter-exceeded");
          } else {
            counter.classList.remove("hbqs-feedback-char-counter-exceeded");
          }
          updateSubmitState();
        });

        descGroup.appendChild(counter);
      } else {
        descriptionTextarea.addEventListener("input", () => {
          updateSubmitState();
        });
      }

      body.appendChild(descGroup);

      // --- Footer buttons ---
      footer.style.display = "flex";
      footer.style.gap = "10px";

      const leftGroup = document.createElement("div");
      leftGroup.className = "hbqs-bug-report-actions-left";

      if (showPayloadButton) {
        const showPayloadText =
          resolveText(
            dialogStrings.showPayloadButton,
            "bugReportShowPayload",
          ) || "Show payload";
        const showPayloadBtn = document.createElement("button");
        showPayloadBtn.className =
          "hbqs-bug-report-btn hbqs-bug-report-btn-show-payload";
        showPayloadBtn.type = "button";
        showPayloadBtn.innerHTML =
          makeSvg("code", 14, "#374151") +
          "<span>" +
          escapeHtml(showPayloadText) +
          "</span>";

        showPayloadBtn.addEventListener("click", () => {
          const payload = buildPayload(
            context,
            config,
            payloadFields,
            descriptionTextarea.value.trim(),
            selectedSeverity,
            payloadTimestampFormat,
          );
          const headers = buildAuthHeaders(authStrategy, {
            authToken,
            authHeaderName,
            authHeaderValue,
            customHeaders,
          });
          headers["Content-Type"] = "application/json";
          const resolvedUrl = resolveTemplateFields(webhookUrl);
          showPayloadViewer(
            payload,
            resolvedUrl,
            headers,
            authStrategy,
            authToken,
            authHeaderName,
            authHeaderValue,
            customHeaders,
          );
        });
        leftGroup.appendChild(showPayloadBtn);
      }

      footer.appendChild(leftGroup);

      const rightGroup = document.createElement("div");
      rightGroup.className = "hbqs-bug-report-actions-right";

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "hbqs-bug-report-btn hbqs-bug-report-btn-cancel";
      cancelBtn.type = "button";
      cancelBtn.textContent = cancelText;
      cancelBtn.addEventListener("click", () => closeDialog());
      rightGroup.appendChild(cancelBtn);

      const submitBtn = document.createElement("button");
      submitBtn.className = "hbqs-bug-report-btn hbqs-bug-report-btn-submit";
      submitBtn.type = "button";
      submitBtn.innerHTML =
        makeSvg("send", 14, "#ffffff") +
        "<span>" +
        escapeHtml(submitText) +
        "</span>";
      submitBtn.disabled = true;
      submitBtn.classList.add("hbqs-bug-report-btn-submit-disabled");
      rightGroup.appendChild(submitBtn);

      footer.appendChild(rightGroup);

      // Enable/disable submit — description text is required
      function updateSubmitState() {
        const hasText =
          descriptionTextarea && descriptionTextarea.value.trim().length > 0;
        submitBtn.disabled = !hasText;
        if (hasText) {
          submitBtn.classList.remove("hbqs-bug-report-btn-submit-disabled");
        } else {
          submitBtn.classList.add("hbqs-bug-report-btn-submit-disabled");
        }
      }

      // Submit handler
      submitBtn.addEventListener("click", async () => {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="hbqs-spinner"></span> ' +
          "<span>" +
          escapeHtml(submitText) +
          "</span>";

        try {
          // Build payload context using only payloadFields, remapping
          // keys via payloadKeyNames so users can choose lowercase etc.
          const keyNames = config.payloadKeyNames || {};
          const payloadContext = {};
          for (const f of payloadFields) {
            if (context[f] !== undefined) {
              const key = (keyNames[f] && keyNames[f].trim()) || f;
              payloadContext[key] = context[f];
            }
          }

          // Re-format payload context timestamp using the payload format
          // (dialog context may use a different format for display).
          if (payloadFields.includes("timestamp")) {
            const tsKey =
              (keyNames.timestamp && keyNames.timestamp.trim()) || "timestamp";
            payloadContext[tsKey] = formatTimestamp(
              new Date(),
              payloadTimestampFormat,
            );
          }

          const payload = {
            timestamp: formatTimestamp(new Date(), payloadTimestampFormat),
            context: payloadContext,
            description: descriptionTextarea.value.trim(),
          };

          if (enableSeverity && selectedSeverity) {
            payload.severity = selectedSeverity;
          }

          const headers = buildAuthHeaders(authStrategy, {
            authToken,
            authHeaderName,
            authHeaderValue,
            customHeaders,
          });
          headers["Content-Type"] = "application/json";

          const resolvedUrl = resolveTemplateFields(webhookUrl);

          const resp = await fetch(resolvedUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });

          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

          showDialogToast(toastArea, successMsg, "success");
          logger.info("Bug report submitted successfully");

          // Auto-close after a brief delay
          setTimeout(() => closeDialog(), 1500);
        } catch (err) {
          logger.error("Bug report submission failed:", err);
          showDialogToast(toastArea, errorMsg, "error");
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            makeSvg("send", 14, "#ffffff") +
            "<span>" +
            escapeHtml(submitText) +
            "</span>";
        }
      });

      // Focus the textarea once the form is built
      requestAnimationFrame(() => descriptionTextarea.focus());
    },
  );

  function closeDialog() {
    overlay.remove();
  }

  logger.debug("Bug report dialog opened");
}

// ---------------------------------------------------------------------------
// Helper — create a labelled read-only input field
// ---------------------------------------------------------------------------

/**
 * Create a field group with a label and a read-only input.
 *
 * @param {string} fieldKey - Internal field key (e.g. 'appId').
 * @param {string} value - The value to display.
 * @returns {HTMLDivElement} The field group element.
 */
function makeReadonlyField(fieldKey, value) {
  const group = document.createElement("div");
  group.className = "hbqs-bug-report-field-group";

  const label = document.createElement("label");
  label.className = "hbqs-bug-report-field-label";
  label.textContent = DEFAULT_FIELD_LABELS[fieldKey] || fieldKey;

  const input = document.createElement("input");
  input.type = "text";
  input.readOnly = true;
  input.value = value || "—";
  input.className = "hbqs-bug-report-readonly-input";
  input.tabIndex = -1;

  group.appendChild(label);
  group.appendChild(input);
  return group;
}

// ---------------------------------------------------------------------------
// In-dialog toast notification
// ---------------------------------------------------------------------------

/**
 * Show a toast message inside the dialog (between header and body).
 *
 * @param {HTMLElement} toastArea - The toast container element.
 * @param {string} message - Message text.
 * @param {'success' | 'error'} type - Toast type.
 */
function showDialogToast(toastArea, message, type) {
  toastArea.textContent = message;
  toastArea.className = `hbqs-bug-report-toast hbqs-bug-report-toast-${type} hbqs-bug-report-toast-visible`;
}

// ---------------------------------------------------------------------------
// Async context data gathering
// ---------------------------------------------------------------------------

/**
 * Fetch current user info.
 *
 * On **client-managed** Qlik Sense the proxy API is used:
 *   GET /qps/user?targetUri=<current URL>
 *
 * On **Qlik Cloud** the REST API is used:
 *   GET /api/v1/users/me
 *   — `email` is mapped to `userId`, `name` to `userName`.
 *   — `userDirectory` is not applicable and returns '(N/A)'.
 *
 * @param {'client-managed' | 'cloud'} platformType - Current platform.
 * @returns {Promise<{userId: string, userDirectory: string, userName: string}>}
 */
function getUserInfo(platformType) {
  if (platformType === "cloud") {
    return fetch("/api/v1/users/me")
      .then((resp) => {
        if (!resp.ok)
          throw new Error("Cloud user info request failed: " + resp.status);
        return resp.json();
      })
      .then((data) => ({
        userId: data.email || "(unknown)",
        userDirectory: "(N/A)",
        userName: data.name || "(unknown)",
        tenantId: data.tenantId || "(unknown)",
        status: data.status || "(unknown)",
        picture: data.picture || "(unknown)",
        preferredZoneinfo: data.preferredZoneinfo || "(unknown)",
        roles:
          Array.isArray(data.roles) && data.roles.length > 0
            ? data.roles.map((r) => "[" + r + "]").join(", ")
            : "(none)",
      }))
      .catch((err) => {
        logger.warn("Failed to fetch Cloud user info:", err);
        return {
          userId: "(unknown)",
          userDirectory: "(N/A)",
          userName: "(unknown)",
          tenantId: "(unknown)",
          status: "(unknown)",
          picture: "(unknown)",
          preferredZoneinfo: "(unknown)",
          roles: "(unknown)",
        };
      });
  }

  // Client-managed: use the proxy API
  return fetch(
    "/qps/user?targetUri=" + encodeURIComponent(window.location.href),
  )
    .then((resp) => {
      if (!resp.ok) throw new Error("User info request failed: " + resp.status);
      return resp.json();
    })
    .then((data) => ({
      userId: data.userId || "(unknown)",
      userDirectory: data.userDirectory || "(unknown)",
      userName: data.userName || "(unknown)",
      tenantId: "(N/A)",
      status: "(N/A)",
      picture: "(N/A)",
      preferredZoneinfo: "(N/A)",
      roles: "(N/A)",
    }))
    .catch((err) => {
      logger.warn("Failed to fetch user info:", err);
      return {
        userId: "(unavailable)",
        userDirectory: "(unavailable)",
        userName: "(unavailable)",
        tenantId: "(N/A)",
        status: "(N/A)",
        picture: "(N/A)",
        preferredZoneinfo: "(N/A)",
        roles: "(N/A)",
      };
    });
}

/**
 * Fetch Qlik Sense version from product-info.js (client-managed only).
 *
 * @returns {Promise<string>}
 */
function getSenseVersion() {
  return fetchSenseVersionLabel();
}

/**
 * Gather all context data asynchronously.
 * Returns a Promise that resolves to an object keyed by field name.
 *
 * @param {string[]} fields - Field names to collect.
 * @param {'client-managed' | 'cloud'} platformType - Current platform.
 * @returns {Promise<Record<string, string>>}
 */
function gatherContextData(fields, platformType, timestampFmt) {
  const path = window.location.pathname;
  const appMatch = path.match(/\/app\/([0-9a-f-]{36})/i);
  const sheetMatch = path.match(/\/sheet\/([^/]+)/);

  // Determine which async fetches we need
  const needUser =
    fields.includes("userId") ||
    fields.includes("userName") ||
    fields.includes("userDirectory") ||
    fields.includes("tenantId") ||
    fields.includes("status") ||
    fields.includes("picture") ||
    fields.includes("preferredZoneinfo") ||
    fields.includes("roles");
  const needVersion = fields.includes("senseVersion");

  const userPromise = needUser
    ? getUserInfo(platformType)
    : Promise.resolve({});
  const versionPromise = needVersion ? getSenseVersion() : Promise.resolve("");

  return Promise.all([userPromise, versionPromise]).then(([user, version]) => {
    const context = {};

    for (const field of fields) {
      switch (field) {
        case "userId":
          context.userId = user.userId || "(unavailable)";
          break;
        case "userName":
          context.userName = user.userName || "(unavailable)";
          break;
        case "userDirectory":
          context.userDirectory = user.userDirectory || "(unavailable)";
          break;
        case "tenantId":
          context.tenantId = user.tenantId || "(unavailable)";
          break;
        case "status":
          context.status = user.status || "(unavailable)";
          break;
        case "picture":
          context.picture = user.picture || "(unavailable)";
          break;
        case "preferredZoneinfo":
          context.preferredZoneinfo = user.preferredZoneinfo || "(unavailable)";
          break;
        case "roles":
          context.roles = user.roles || "(unavailable)";
          break;
        case "senseVersion":
          context.senseVersion =
            platformType === "cloud" ? "(N/A)" : version || "(unavailable)";
          break;
        case "appId":
          context.appId = appMatch ? appMatch[1] : "(not in an app)";
          break;
        case "sheetId":
          context.sheetId = sheetMatch ? sheetMatch[1] : "(no sheet selected)";
          break;
        case "urlPath":
          context.urlPath = window.location.pathname + window.location.search;
          break;
        case "platform":
          context.platform = platformType;
          break;
        case "browser":
          context.browser = navigator.userAgent;
          break;
        case "timestamp":
          context.timestamp = formatTimestamp(
            new Date(),
            timestampFmt || DEFAULT_DIALOG_FORMAT,
          );
          break;
        default:
          logger.debug("Unknown collect field:", field);
          break;
      }
    }

    return context;
  });
}

/**
 * Build authentication headers based on the configured strategy.
 *
 * @param {string} strategy - Auth strategy name.
 * @param {object} options - Auth options.
 * @returns {Record<string, string>} HTTP headers.
 */
function buildAuthHeaders(strategy, options) {
  const headers = {};

  switch (strategy) {
    case "header":
      if (options.authHeaderName && options.authHeaderValue) {
        headers[options.authHeaderName] = options.authHeaderValue;
      } else if (options.authToken) {
        headers["Authorization"] = `Bearer ${options.authToken}`;
      }
      break;

    case "sense-session": {
      // XRF key for CSRF protection on CM Qlik Sense
      const xrfKey = generateXrfKey();
      headers["X-Qlik-Xrfkey"] = xrfKey;
      break;
    }

    case "custom":
      if (Array.isArray(options.customHeaders)) {
        options.customHeaders.forEach((header) => {
          if (header && header.name && header.value) {
            headers[header.name] = header.value;
          }
        });
      } else if (
        options.customHeaders &&
        typeof options.customHeaders === "object"
      ) {
        Object.assign(headers, options.customHeaders);
      }
      break;

    case "none":
    default:
      break;
  }

  return headers;
}

/**
 * Generate a 16-character XRF key for Qlik Sense CSRF protection.
 *
 * Uses crypto.getRandomValues() for cryptographically secure randomness.
 *
 * @returns {string} 16-character alphanumeric string.
 */
function generateXrfKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let key = "";
  for (let i = 0; i < 16; i++) {
    key += chars.charAt(bytes[i] % chars.length);
  }
  return key;
}

// ---------------------------------------------------------------------------
// Payload building (used by both submit and show-payload)
// ---------------------------------------------------------------------------

/**
 * Build the JSON payload object.
 *
 * @param {object} context - Gathered context data.
 * @param {object} config - Bug report config.
 * @param {string[]} payloadFields - Fields to include in payload.
 * @param {string} description - User's description text.
 * @param {string|null} selectedSeverity - Selected severity level.
 * @param {string} timestampFormat - Format for timestamp.
 * @returns {object} The payload object.
 */
function buildPayload(
  context,
  config,
  payloadFields,
  description,
  selectedSeverity,
  timestampFormat,
) {
  const keyNames = config.payloadKeyNames || {};
  const payloadContext = {};
  for (const f of payloadFields) {
    if (context[f] !== undefined) {
      const key = (keyNames[f] && keyNames[f].trim()) || f;
      payloadContext[key] = context[f];
    }
  }

  if (payloadFields.includes("timestamp")) {
    const tsKey =
      (keyNames.timestamp && keyNames.timestamp.trim()) || "timestamp";
    payloadContext[tsKey] = formatTimestamp(new Date(), timestampFormat);
  }

  const payload = {
    timestamp: formatTimestamp(new Date(), timestampFormat),
    context: payloadContext,
    description: description,
  };

  if (selectedSeverity) {
    payload.severity = selectedSeverity;
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Payload viewer modal
// ---------------------------------------------------------------------------

/**
 * Show a modal with the full JSON payload, URL, and headers.
 *
 * @param {object} payload - The JSON payload object.
 * @param {string} url - The resolved webhook URL.
 * @param {object} headers - Headers that will be sent (Content-Type already added).
 * @param {string} authStrategy - Auth strategy used.
 * @param {string} authToken - Auth token (for header strategy).
 * @param {string} authHeaderName - Custom auth header name.
 * @param {string} authHeaderValue - Custom auth header value.
 * @param {object} customHeaders - Custom headers array/object.
 */
function showPayloadViewer(
  payload,
  url,
  headers,
  authStrategy,
  authToken,
  authHeaderName,
  authHeaderValue,
  customHeaders,
) {
  const overlay = document.createElement("div");
  overlay.className = "hbqs-payload-overlay";

  const modal = document.createElement("div");
  modal.className = "hbqs-payload-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Payload details");

  // Store reference to the main dialog for focus management
  const mainDialog = document.querySelector(".hbqs-bug-report-dialog");

  const header = document.createElement("div");
  header.className = "hbqs-payload-header";

  const title = document.createElement("h3");
  title.className = "hbqs-payload-title";
  title.textContent = "Request Details";
  header.appendChild(title);

  const closeBtn = document.createElement("button");
  closeBtn.className = "hbqs-payload-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = makeSvg("close", 18);
  closeBtn.addEventListener("click", () => overlay.remove());
  header.appendChild(closeBtn);

  modal.appendChild(header);

  const body = document.createElement("div");
  body.className = "hbqs-payload-body";

  // URL section
  const urlSection = document.createElement("div");
  urlSection.className = "hbqs-payload-section";
  const urlTitle = document.createElement("div");
  urlTitle.className = "hbqs-payload-section-title";
  urlTitle.textContent = "URL";
  urlSection.appendChild(urlTitle);
  const urlPre = document.createElement("pre");
  urlPre.className = "hbqs-payload-code hl-url";
  urlPre.textContent = url;
  urlSection.appendChild(urlPre);
  body.appendChild(urlSection);

  // Request line (method)
  const requestLine = document.createElement("div");
  requestLine.className = "hbqs-payload-section";
  const requestTitle = document.createElement("div");
  requestTitle.className = "hbqs-payload-section-title";
  requestTitle.textContent = "Method";
  requestLine.appendChild(requestTitle);
  const requestLinePre = document.createElement("pre");
  requestLinePre.className = "hbqs-payload-code hl-method";
  requestLinePre.textContent = "POST";
  requestLine.appendChild(requestLinePre);
  body.appendChild(requestLine);

  // Headers section - show all headers including auth
  const headersSection = document.createElement("div");
  headersSection.className = "hbqs-payload-section";
  const headersTitle = document.createElement("div");
  headersTitle.className = "hbqs-payload-section-title";
  headersTitle.textContent = "Headers";
  headersSection.appendChild(headersTitle);
  const headersPre = document.createElement("pre");
  headersPre.className = "hbqs-payload-code hl-headers";

  // Build comprehensive headers display
  const headerDisplay = [];
  headerDisplay.push("Content-Type: application/json");

  if (authStrategy === "header") {
    if (authHeaderName && authHeaderValue) {
      headerDisplay.push(`${authHeaderName}: ${authHeaderValue}`);
    } else if (authToken) {
      headerDisplay.push(`Authorization: Bearer ${authToken.substring(0, 20)}...`);
    }
  } else if (authStrategy === "sense-session") {
    headerDisplay.push("X-Qlik-Xrfkey: <generated>");
  } else if (authStrategy === "custom") {
    if (Array.isArray(customHeaders)) {
      customHeaders.forEach((h) => {
        if (h && h.name && h.value) {
          headerDisplay.push(`${h.name}: ${h.value}`);
        }
      });
    } else if (customHeaders && typeof customHeaders === "object") {
      Object.entries(customHeaders).forEach(([k, v]) => {
        headerDisplay.push(`${k}: ${v}`);
      });
    }
  }

  headersPre.textContent = headerDisplay.join("\n");
  headersSection.appendChild(headersPre);
  body.appendChild(headersSection);

  // Body section
  const bodySection = document.createElement("div");
  bodySection.className = "hbqs-payload-section";
  const bodyTitle = document.createElement("div");
  bodyTitle.className = "hbqs-payload-section-title";
  bodyTitle.textContent = "Body";
  bodySection.appendChild(bodyTitle);
  const bodyPre = document.createElement("pre");
  bodyPre.className = "hbqs-payload-code hl-body";
  bodyPre.innerHTML = syntaxHighlightJson(payload);
  bodySection.appendChild(bodyPre);
  body.appendChild(bodySection);

  modal.appendChild(body);

  // Footer with close button
  const footer = document.createElement("div");
  footer.className = "hbqs-payload-footer";
  const closeFooterBtn = document.createElement("button");
  closeFooterBtn.className = "hbqs-bug-report-btn hbqs-bug-report-btn-cancel";
  closeFooterBtn.type = "button";
  closeFooterBtn.textContent = "Close";
  closeFooterBtn.addEventListener("click", () => overlay.remove());
  footer.appendChild(closeFooterBtn);
  modal.appendChild(footer);

  overlay.appendChild(modal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      overlay.remove();
      if (mainDialog) mainDialog.focus();
    }
  });

  document.body.appendChild(overlay);
  modal.setAttribute("tabindex", "-1");
  modal.focus();
}

// ---------------------------------------------------------------------------
// JSON syntax highlighting
// ---------------------------------------------------------------------------

/**
 * Convert a JSON object to an HTML string with syntax highlighting.
 *
 * @param {object} obj - The object to stringify and highlight.
 * @returns {string} HTML string with syntax highlighting spans.
 */
function syntaxHighlightJson(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match) {
      let cls = "hl-number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "hl-key";
        } else {
          cls = "hl-string";
        }
      } else if (/true|false/.test(match)) {
        cls = "hl-bool";
      } else if (/null/.test(match)) {
        cls = "hl-null";
      }
      return '<span class="' + cls + '">' + escapeHtml(match) + "</span>";
    },
  );
}
