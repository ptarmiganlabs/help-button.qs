/**
 * Bug-report dialog component for HelpButton.qs.
 *
 * Modal overlay with a form that collects bug-report data and
 * submits it to a configurable webhook URL.  Context data (user info,
 * Qlik Sense version, app/sheet IDs) is gathered asynchronously and
 * displayed as read-only form fields — matching the HTML injection
 * variant's polished look.
 */

import { makeSvg } from './icons';
import { escapeHtml, resolveTemplateFields } from '../util/template-fields';
import { resolveText } from '../i18n/index';
import logger from '../util/logger';

// ---------------------------------------------------------------------------
// Field labels — maps internal field keys to user-visible labels.
// Matches the HTML variant's FIELD_LABELS dictionary.
// ---------------------------------------------------------------------------
const DEFAULT_FIELD_LABELS = {
    userId: 'User ID',
    userName: 'User Name',
    userDirectory: 'User Directory',
    senseVersion: 'Qlik Sense Version',
    appId: 'App ID',
    sheetId: 'Sheet ID',
    urlPath: 'URL Path',
    platform: 'Platform',
    browser: 'Browser',
    timestamp: 'Timestamp',
    tenantId: 'Tenant ID',
    status: 'Status',
    picture: 'Picture',
    preferredZoneinfo: 'Preferred Zone Info',
    roles: 'Roles',
};

// Fields that should render side-by-side in a paired row.
// Key = first field, value = second field.
const PAIRED_FIELDS = { userDirectory: 'userId' };

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
    const existing = document.getElementById('hbqs-bug-report-overlay');
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
    const loadingText = resolveText(dialogStrings.loadingMessage, 'bugReportLoadingMessage');

    // -- Build dialog DOM --
    const overlay = document.createElement('div');
    overlay.id = 'hbqs-bug-report-overlay';
    overlay.className = 'hbqs-bug-report-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'hbqs-bug-report-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', title);

    // Header
    const headerEl = document.createElement('div');
    headerEl.className = 'hbqs-bug-report-header';

    const titleEl = document.createElement('h2');
    titleEl.className = 'hbqs-bug-report-title';
    titleEl.textContent = title;
    headerEl.appendChild(titleEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'hbqs-bug-report-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = makeSvg('close', 20);
    closeBtn.addEventListener('click', () => closeDialog());
    headerEl.appendChild(closeBtn);

    dialog.appendChild(headerEl);

    // Toast area (hidden initially — used for success/error messages inside the dialog)
    const toastArea = document.createElement('div');
    toastArea.className = 'hbqs-bug-report-toast';
    dialog.appendChild(toastArea);

    // Body — initially shows a loading spinner
    const body = document.createElement('div');
    body.className = 'hbqs-bug-report-body';

    const loadingEl = document.createElement('div');
    loadingEl.className = 'hbqs-bug-report-loading';
    loadingEl.innerHTML =
        '<div class="hbqs-spinner hbqs-spinner-context"></div>' +
        '<span>' + escapeHtml(loadingText) + '</span>';
    body.appendChild(loadingEl);

    dialog.appendChild(body);

    // Footer (hidden until context loads)
    const footer = document.createElement('div');
    footer.className = 'hbqs-bug-report-actions';
    footer.style.display = 'none';
    dialog.appendChild(footer);

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
    dialog.setAttribute('tabindex', '-1');
    dialog.focus();

    // -- Gather context asynchronously, then build the form --
    let resolvedContext = {};

    gatherContextData(collectFields, platformType).then((context) => {
        resolvedContext = context;
        logger.debug('Context gathered:', JSON.stringify(context, null, 2));

        // Remove loading indicator
        body.removeChild(loadingEl);

        // --- Context fields (read-only inputs) ---
        // Build a set of "skip" fields (second items in pairs, rendered inline)
        const skipFields = {};
        for (const pf of Object.keys(PAIRED_FIELDS)) {
            skipFields[PAIRED_FIELDS[pf]] = true;
        }

        for (const field of collectFields) {
            if (context[field] === undefined) continue;
            if (skipFields[field]) continue; // rendered as part of a pair

            // Check if this field starts a side-by-side pair
            if (PAIRED_FIELDS[field]) {
                const pairField = PAIRED_FIELDS[field];
                const row = document.createElement('div');
                row.className = 'hbqs-bug-report-field-row';

                const leftWrap = document.createElement('div');
                leftWrap.className = 'hbqs-bug-report-field-row-item';
                leftWrap.appendChild(makeReadonlyField(field, context[field]));
                row.appendChild(leftWrap);

                if (context[pairField] !== undefined) {
                    const rightWrap = document.createElement('div');
                    rightWrap.className = 'hbqs-bug-report-field-row-item';
                    rightWrap.appendChild(makeReadonlyField(pairField, context[pairField]));
                    row.appendChild(rightWrap);
                }

                body.appendChild(row);
            } else {
                body.appendChild(makeReadonlyField(field, context[field]));
            }
        }

        // --- Description textarea ---
        const descGroup = document.createElement('div');
        descGroup.className = 'hbqs-bug-report-field-group';

        const label = document.createElement('label');
        label.className = 'hbqs-bug-report-label';
        label.textContent = descriptionLabel;
        label.htmlFor = 'hbqs-bug-report-description';
        descGroup.appendChild(label);

        const textarea = document.createElement('textarea');
        textarea.id = 'hbqs-bug-report-description';
        textarea.className = 'hbqs-bug-report-textarea';
        textarea.placeholder = descriptionPlaceholder;
        textarea.rows = 4;
        descGroup.appendChild(textarea);

        body.appendChild(descGroup);

        // --- Footer buttons ---
        footer.style.display = 'flex';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'hbqs-bug-report-btn hbqs-bug-report-btn-cancel';
        cancelBtn.type = 'button';
        cancelBtn.textContent = cancelText;
        cancelBtn.addEventListener('click', () => closeDialog());
        footer.appendChild(cancelBtn);

        const submitBtn = document.createElement('button');
        submitBtn.className = 'hbqs-bug-report-btn hbqs-bug-report-btn-submit';
        submitBtn.type = 'button';
        submitBtn.innerHTML =
            makeSvg('send', 14, '#ffffff') +
            '<span>' + escapeHtml(submitText) + '</span>';
        submitBtn.disabled = true;
        footer.appendChild(submitBtn);

        // Enable/disable submit based on textarea content
        textarea.addEventListener('input', () => {
            const hasText = textarea.value.trim().length > 0;
            submitBtn.disabled = !hasText;
            if (hasText) {
                submitBtn.classList.remove('hbqs-bug-report-btn-submit-disabled');
            } else {
                submitBtn.classList.add('hbqs-bug-report-btn-submit-disabled');
            }
        });
        // Start in disabled visual state
        submitBtn.classList.add('hbqs-bug-report-btn-submit-disabled');

        // Submit handler
        submitBtn.addEventListener('click', async () => {
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<span class="hbqs-spinner"></span> ' +
                '<span>' + escapeHtml(submitText) + '</span>';

            try {
                const payload = {
                    timestamp: new Date().toISOString(),
                    context: resolvedContext,
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

                showDialogToast(toastArea, successMsg, 'success');
                logger.info('Bug report submitted successfully');

                // Auto-close after a brief delay
                setTimeout(() => closeDialog(), 1500);
            } catch (err) {
                logger.error('Bug report submission failed:', err);
                showDialogToast(toastArea, errorMsg, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML =
                    makeSvg('send', 14, '#ffffff') +
                    '<span>' + escapeHtml(submitText) + '</span>';
            }
        });

        // Focus the textarea once the form is built
        requestAnimationFrame(() => textarea.focus());
    });

    function closeDialog() {
        overlay.remove();
    }

    logger.debug('Bug report dialog opened');
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
    const group = document.createElement('div');
    group.className = 'hbqs-bug-report-field-group';

    const label = document.createElement('label');
    label.className = 'hbqs-bug-report-field-label';
    label.textContent = DEFAULT_FIELD_LABELS[fieldKey] || fieldKey;

    const input = document.createElement('input');
    input.type = 'text';
    input.readOnly = true;
    input.value = value || '—';
    input.className = 'hbqs-bug-report-readonly-input';
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
    if (platformType === 'cloud') {
        return fetch('/api/v1/users/me')
            .then((resp) => {
                if (!resp.ok) throw new Error('Cloud user info request failed: ' + resp.status);
                return resp.json();
            })
            .then((data) => ({
                userId: data.email || '(unknown)',
                userDirectory: '(N/A)',
                userName: data.name || '(unknown)',
                tenantId: data.tenantId || '(unknown)',
                status: data.status || '(unknown)',
                picture: data.picture || '(unknown)',
                preferredZoneinfo: data.preferredZoneinfo || '(unknown)',
                roles: Array.isArray(data.roles) && data.roles.length > 0
                    ? data.roles.map((r) => '[' + r + ']').join(', ')
                    : '(none)',
            }))
            .catch((err) => {
                logger.warn('Failed to fetch Cloud user info:', err);
                return {
                    userId: '(unknown)',
                    userDirectory: '(N/A)',
                    userName: '(unknown)',
                    tenantId: '(unknown)',
                    status: '(unknown)',
                    picture: '(unknown)',
                    preferredZoneinfo: '(unknown)',
                    roles: '(unknown)',
                };
            });
    }

    // Client-managed: use the proxy API
    return fetch('/qps/user?targetUri=' + encodeURIComponent(window.location.href))
        .then((resp) => {
            if (!resp.ok) throw new Error('User info request failed: ' + resp.status);
            return resp.json();
        })
        .then((data) => ({
            userId: data.userId || '(unknown)',
            userDirectory: data.userDirectory || '(unknown)',
            userName: data.userName || '(unknown)',
            tenantId: '(N/A)',
            status: '(N/A)',
            picture: '(N/A)',
            preferredZoneinfo: '(N/A)',
            roles: '(N/A)',
        }))
        .catch((err) => {
            logger.warn('Failed to fetch user info:', err);
            return {
                userId: '(unavailable)',
                userDirectory: '(unavailable)',
                userName: '(unavailable)',
                tenantId: '(N/A)',
                status: '(N/A)',
                picture: '(N/A)',
                preferredZoneinfo: '(N/A)',
                roles: '(N/A)',
            };
        });
}

/**
 * Fetch Qlik Sense version from product-info.js (client-managed only).
 * GET /resources/autogenerated/product-info.js — parse the AMD module.
 *
 * @returns {Promise<string>}
 */
function getSenseVersion() {
    return fetch('/resources/autogenerated/product-info.js')
        .then((resp) => {
            if (!resp.ok) throw new Error('Product info request failed: ' + resp.status);
            return resp.text();
        })
        .then((text) => {
            // AMD module: define([], /** ... */ { ... });
            const json = text
                .replace(/^define\(\[],\s*\/\*\*.*?\*\/\s*/s, '')
                .replace(/\s*\);?\s*$/, '');
            const info = JSON.parse(json);
            const comp = info.composition || {};
            return (comp.releaseLabel || 'Unknown') + ' (v' + (comp.version || '?') + ')';
        })
        .catch((err) => {
            logger.warn('Failed to fetch Sense version:', err);
            return '(unavailable)';
        });
}

/**
 * Gather all context data asynchronously.
 * Returns a Promise that resolves to an object keyed by field name.
 *
 * @param {string[]} fields - Field names to collect.
 * @param {'client-managed' | 'cloud'} platformType - Current platform.
 * @returns {Promise<Record<string, string>>}
 */
function gatherContextData(fields, platformType) {
    const path = window.location.pathname;
    const appMatch = path.match(/\/app\/([0-9a-f-]{36})/i);
    const sheetMatch = path.match(/\/sheet\/([^/]+)/);

    // Determine which async fetches we need
    const needUser =
        fields.includes('userId') ||
        fields.includes('userName') ||
        fields.includes('userDirectory') ||
        fields.includes('tenantId') ||
        fields.includes('status') ||
        fields.includes('picture') ||
        fields.includes('preferredZoneinfo') ||
        fields.includes('roles');
    const needVersion = fields.includes('senseVersion');

    const userPromise = needUser ? getUserInfo(platformType) : Promise.resolve({});
    const versionPromise = needVersion ? getSenseVersion() : Promise.resolve('');

    return Promise.all([userPromise, versionPromise]).then(([user, version]) => {
        const context = {};

        for (const field of fields) {
            switch (field) {
                case 'userId':
                    context.userId = user.userId || '(unavailable)';
                    break;
                case 'userName':
                    context.userName = user.userName || '(unavailable)';
                    break;
                case 'userDirectory':
                    context.userDirectory = user.userDirectory || '(unavailable)';
                    break;
                case 'tenantId':
                    context.tenantId = user.tenantId || '(unavailable)';
                    break;
                case 'status':
                    context.status = user.status || '(unavailable)';
                    break;
                case 'picture':
                    context.picture = user.picture || '(unavailable)';
                    break;
                case 'preferredZoneinfo':
                    context.preferredZoneinfo = user.preferredZoneinfo || '(unavailable)';
                    break;
                case 'roles':
                    context.roles = user.roles || '(unavailable)';
                    break;
                case 'senseVersion':
                    context.senseVersion = platformType === 'cloud' ? '(N/A)' : (version || '(unavailable)');
                    break;
                case 'appId':
                    context.appId = appMatch ? appMatch[1] : '(not in an app)';
                    break;
                case 'sheetId':
                    context.sheetId = sheetMatch ? sheetMatch[1] : '(no sheet selected)';
                    break;
                case 'urlPath':
                    context.urlPath = window.location.pathname + window.location.search;
                    break;
                case 'platform':
                    context.platform = platformType;
                    break;
                case 'browser':
                    context.browser = navigator.userAgent;
                    break;
                case 'timestamp':
                    context.timestamp = new Date().toLocaleString();
                    break;
                default:
                    logger.debug('Unknown collect field:', field);
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
