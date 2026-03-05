/**
 * Bug-report dialog component for qs-help-button.
 *
 * Modal overlay with a form that collects bug-report data and
 * submits it to a configurable webhook URL.
 */

import { makeSvg } from './icons';
import { escapeHtml, resolveTemplateFields } from '../util/template-fields';
import { resolveText } from '../i18n/index';
import logger from '../util/logger';

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
        webhookUrl = '',
        authStrategy = 'none',
        authToken = '',
        authHeaderName = 'Authorization',
        authHeaderValue = '',
        customHeaders = {},
        dialogStrings = {},
    } = config;

    // collectFields can be a comma-separated string (from property panel)
    // or an array (legacy). Normalise to an array.
    let collectFields;
    if (typeof config.collectFields === 'string') {
        collectFields = config.collectFields.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
        collectFields = config.collectFields || ['userName', 'appId', 'sheetId', 'urlPath'];
    }

    // Remove any existing dialog
    const existing = document.getElementById('qshb-bug-report-overlay');
    if (existing) existing.remove();

    // Localized strings
    const title = resolveText(dialogStrings.title, 'bugReportTitle');
    const descriptionLabel = resolveText(dialogStrings.descriptionLabel, 'bugReportDescriptionLabel');
    const descriptionPlaceholder = resolveText(
        dialogStrings.descriptionPlaceholder,
        'bugReportDescriptionPlaceholder'
    );
    const submitText = resolveText(dialogStrings.submitButton, 'bugReportSubmit');
    const cancelText = resolveText(dialogStrings.cancelButton, 'bugReportCancel');
    const successMsg = resolveText(dialogStrings.successMessage, 'bugReportSuccessMessage');
    const errorMsg = resolveText(dialogStrings.errorMessage, 'bugReportErrorMessage');
    const contextHeader = resolveText(dialogStrings.contextHeader, 'bugReportContextHeader');

    // Collect context data
    const context = collectContextData(collectFields, platformType);

    // -- Build dialog DOM --
    const overlay = document.createElement('div');
    overlay.id = 'qshb-bug-report-overlay';
    overlay.className = 'qshb-bug-report-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'qshb-bug-report-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', title);

    // Header
    const headerEl = document.createElement('div');
    headerEl.className = 'qshb-bug-report-header';

    const titleEl = document.createElement('h2');
    titleEl.className = 'qshb-bug-report-title';
    titleEl.textContent = title;
    headerEl.appendChild(titleEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'qshb-bug-report-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = makeSvg('close', 20);
    closeBtn.addEventListener('click', () => closeDialog());
    headerEl.appendChild(closeBtn);

    dialog.appendChild(headerEl);

    // Context section
    if (collectFields.length > 0 && Object.keys(context).length > 0) {
        const contextSection = document.createElement('div');
        contextSection.className = 'qshb-bug-report-context';

        const contextTitle = document.createElement('div');
        contextTitle.className = 'qshb-bug-report-context-title';
        contextTitle.textContent = contextHeader;
        contextSection.appendChild(contextTitle);

        const contextGrid = document.createElement('div');
        contextGrid.className = 'qshb-bug-report-context-grid';

        for (const [key, value] of Object.entries(context)) {
            const row = document.createElement('div');
            row.className = 'qshb-bug-report-context-row';

            const keyEl = document.createElement('span');
            keyEl.className = 'qshb-bug-report-context-key';
            keyEl.textContent = key;
            row.appendChild(keyEl);

            const valEl = document.createElement('span');
            valEl.className = 'qshb-bug-report-context-value';
            valEl.textContent = value || '—';
            row.appendChild(valEl);

            contextGrid.appendChild(row);
        }

        contextSection.appendChild(contextGrid);
        dialog.appendChild(contextSection);
    }

    // Description textarea
    const formSection = document.createElement('div');
    formSection.className = 'qshb-bug-report-form';

    const label = document.createElement('label');
    label.className = 'qshb-bug-report-label';
    label.textContent = descriptionLabel;
    label.htmlFor = 'qshb-bug-report-description';
    formSection.appendChild(label);

    const textarea = document.createElement('textarea');
    textarea.id = 'qshb-bug-report-description';
    textarea.className = 'qshb-bug-report-textarea';
    textarea.placeholder = descriptionPlaceholder;
    textarea.rows = 6;
    formSection.appendChild(textarea);

    dialog.appendChild(formSection);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'qshb-bug-report-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'qshb-bug-report-btn qshb-bug-report-btn-cancel';
    cancelBtn.type = 'button';
    cancelBtn.textContent = cancelText;
    cancelBtn.addEventListener('click', () => closeDialog());
    actions.appendChild(cancelBtn);

    const submitBtn = document.createElement('button');
    submitBtn.className = 'qshb-bug-report-btn qshb-bug-report-btn-submit';
    submitBtn.type = 'button';
    submitBtn.textContent = submitText;
    submitBtn.disabled = true;
    actions.appendChild(submitBtn);

    dialog.appendChild(actions);

    // Enable submit only when description is non-empty
    textarea.addEventListener('input', () => {
        submitBtn.disabled = !textarea.value.trim();
    });

    // Submit handler
    submitBtn.addEventListener('click', async () => {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<span class="qshb-spinner"></span> ' + escapeHtml(submitText);

        try {
            const payload = {
                timestamp: new Date().toISOString(),
                context,
                description: textarea.value.trim(),
            };

            const headers = buildAuthHeaders(authStrategy, {
                authToken,
                authHeaderName,
                authHeaderValue,
                customHeaders,
            });
            headers['Content-Type'] = 'application/json';

            const resolvedUrl = resolveTemplateFields(webhookUrl);

            const resp = await fetch(resolvedUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            showToast(successMsg, 'success');
            closeDialog();
            logger.info('Bug report submitted successfully');
        } catch (err) {
            logger.error('Bug report submission failed:', err);
            showToast(errorMsg, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = submitText;
        }
    });

    // Prevent Qlik keyboard shortcuts while dialog is open
    dialog.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Escape') closeDialog();
    });

    overlay.appendChild(dialog);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog();
    });

    document.body.appendChild(overlay);

    // Focus the textarea
    requestAnimationFrame(() => textarea.focus());

    function closeDialog() {
        overlay.remove();
    }

    logger.debug('Bug report dialog opened');
}

/**
 * Collect context data based on configured fields.
 *
 * @param {string[]} fields - Field names to collect.
 * @param {'client-managed' | 'cloud'} platformType - Current platform.
 * @returns {Record<string, string>} Collected context data.
 */
function collectContextData(fields, platformType) {
    const context = {};
    const path = window.location.pathname;
    const appMatch = path.match(/\/app\/([0-9a-f-]{36})/i);
    const sheetMatch = path.match(/\/sheet\/([^/]+)/);

    for (const field of fields) {
        switch (field) {
            case 'userName':
                // Will be populated from cached template context
                context['User'] = '';
                break;
            case 'appId':
                context['App ID'] = appMatch ? appMatch[1] : '';
                break;
            case 'sheetId':
                context['Sheet ID'] = sheetMatch ? sheetMatch[1] : '';
                break;
            case 'urlPath':
                context['URL'] = window.location.pathname;
                break;
            case 'platform':
                context['Platform'] = platformType;
                break;
            case 'browser':
                context['Browser'] = navigator.userAgent;
                break;
            case 'timestamp':
                context['Timestamp'] = new Date().toLocaleString();
                break;
            default:
                break;
        }
    }

    return context;
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
        case 'header':
            if (options.authHeaderName && options.authHeaderValue) {
                headers[options.authHeaderName] = options.authHeaderValue;
            } else if (options.authToken) {
                headers['Authorization'] = `Bearer ${options.authToken}`;
            }
            break;

        case 'sense-session': {
            // XRF key for CSRF protection on CM Qlik Sense
            const xrfKey = generateXrfKey();
            headers['X-Qlik-Xrfkey'] = xrfKey;
            break;
        }

        case 'custom':
            if (options.customHeaders && typeof options.customHeaders === 'object') {
                Object.assign(headers, options.customHeaders);
            }
            break;

        case 'none':
        default:
            break;
    }

    return headers;
}

/**
 * Generate a 16-character XRF key for Qlik Sense CSRF protection.
 *
 * @returns {string} 16-character alphanumeric string.
 */
function generateXrfKey() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

/**
 * Show a temporary toast notification.
 *
 * @param {string} message - Toast message text.
 * @param {'success' | 'error'} type - Toast type.
 */
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `qshb-toast qshb-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('qshb-toast-visible');
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('qshb-toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
