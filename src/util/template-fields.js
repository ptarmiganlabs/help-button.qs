/**
 * Template field resolution for dynamic URL placeholders.
 *
 * Resolves {{…}} placeholders in URLs using live Qlik Sense context.
 * Platform-aware: CM uses /qps/user, Cloud uses different detection.
 */

import logger from './logger';

/**
 * Cached template context — populated once by fetchTemplateContext().
 *
 * @type {{ userDirectory: string, userId: string }}
 */
let templateContext = { userDirectory: '', userId: '' };

/**
 * Whether template context has been fetched.
 *
 * @type {boolean}
 */
let contextFetched = false;

/**
 * Fetch user context and cache it for template resolution.
 * Fire-and-forget on startup.
 *
 * **Client-managed**: fetches from `/qps/user`.
 * **Cloud**: fetches from `/api/v1/users/me` — `email` is mapped to
 * `userId`; `userDirectory` is left empty (not applicable on Cloud).
 *
 * @param {'client-managed' | 'cloud'} platformType - Current platform.
 * @returns {Promise<void>}
 */
export async function fetchTemplateContext(platformType) {
    if (contextFetched) return;
    contextFetched = true;

    if (platformType === 'cloud') {
        try {
            const resp = await fetch('/api/v1/users/me');
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            templateContext.userId = data.email || '';
            templateContext.userDirectory = '';
            logger.debug('Cloud template context loaded:', JSON.stringify(templateContext));
        } catch (err) {
            logger.warn('Failed to fetch Cloud template context (user info):', err);
        }
        return;
    }

    try {
        const resp = await fetch('/qps/user?targetUri=' + encodeURIComponent(window.location.href));
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        templateContext.userDirectory = data.userDirectory || '';
        templateContext.userId = data.userId || '';
        logger.debug('Template context loaded:', JSON.stringify(templateContext));
    } catch (err) {
        logger.warn('Failed to fetch template context (user info):', err);
    }
}

/**
 * Replace {{…}} template placeholders in a URL with live Qlik Sense context.
 *
 * Supported fields:
 *   {{userDirectory}} — User directory (e.g. "CORP")
 *   {{userId}}        — User ID (e.g. "jsmith")
 *   {{appId}}         — Current app GUID (from URL)
 *   {{sheetId}}       — Current sheet ID (from URL)
 *
 * Unresolvable placeholders are replaced with an empty string and any
 * resulting double-slashes in the URL path are collapsed to a single slash.
 *
 * @param {string} url - URL string, possibly containing {{…}} placeholders.
 * @returns {string} Resolved URL.
 */
export function resolveTemplateFields(url) {
    if (!url || !url.includes('{{')) return url;

    // Parse app/sheet IDs fresh from the current URL (changes on SPA navigation)
    const path = window.location.pathname;
    const appMatch = path.match(/\/app\/([0-9a-f-]{36})/i);
    const sheetMatch = path.match(/\/sheet\/([^/]+)/);

    let resolved = url
        .replace(/\{\{userDirectory\}\}/g, templateContext.userDirectory || '')
        .replace(/\{\{userId\}\}/g, templateContext.userId || '')
        .replace(/\{\{appId\}\}/g, appMatch ? appMatch[1] : '')
        .replace(/\{\{sheetId\}\}/g, sheetMatch ? sheetMatch[1] : '');

    // Clean up double-slashes in the path portion (preserve :// in protocol)
    const protocolEnd = resolved.indexOf('://');
    if (protocolEnd >= 0) {
        const protocol = resolved.substring(0, protocolEnd + 3);
        let rest = resolved.substring(protocolEnd + 3);
        rest = rest.replace(/\/{2,}/g, '/');
        resolved = protocol + rest;
    } else {
        resolved = resolved.replace(/\/{2,}/g, '/');
    }

    logger.debug('Template URL resolved:', url, '→', resolved);
    return resolved;
}

/**
 * Escape a string for safe HTML injection.
 *
 * @param {string} str - Untrusted string.
 * @returns {string} HTML-safe string.
 */
export function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
