/**
 * Qlik Cloud platform adapter.
 *
 * Same interface as client-managed.js but with Cloud-specific
 * DOM selectors and API patterns. This is a STANDALONE module —
 * it does NOT delegate to client-managed.js so that Cloud-specific
 * changes can be made independently.
 */

import logger from '../util/logger';
import { getSelectors } from './selectors';

// ---------------------------------------------------------------------------
// Toolbar anchor
// ---------------------------------------------------------------------------

/**
 * Get the toolbar anchor element where the help button should be injected.
 *
 * Cloud toolbar structure uses data-testid attributes. The help button
 * is injected as the first child of the right-side actions area
 * (`[data-testid="top-bar-right-side"]`), placing it next to the
 * search / notifications / profile buttons.
 *
 * @param {string} [codePath] - Code-path name.
 * @returns {Element | null} The toolbar anchor element, or null if not found.
 */
export function getToolbarAnchor(codePath) {
    const sels = getSelectors('cloud', codePath);
    return document.querySelector(sels.toolbarAnchor);
}

/**
 * Get the toolbar anchor CSS selector string.
 *
 * @param {string} [codePath] - Code-path name.
 * @returns {string} CSS selector for the toolbar anchor.
 */
export function getToolbarAnchorSelector(codePath) {
    const sels = getSelectors('cloud', codePath);
    return sels.toolbarAnchor;
}

// ---------------------------------------------------------------------------
// User context
// ---------------------------------------------------------------------------

/**
 * Cached user context.
 *
 * @type {{ userDirectory: string, userId: string, userName: string } | null}
 */
let cachedUserContext = null;

/**
 * Get user context for Cloud via the `/api/v1/users/me` REST API.
 *
 * Returns the authenticated user's email as `userId` and display name
 * as `userName`. `userDirectory` is not applicable on Cloud and is
 * always returned as an empty string.
 *
 * @returns {Promise<{ userDirectory: string, userId: string, userName: string }>}
 */
export async function getUserContext() {
    if (cachedUserContext) return cachedUserContext;

    try {
        const resp = await fetch('/api/v1/users/me');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        cachedUserContext = {
            userDirectory: '',
            userId: data.email || '',
            userName: data.name || '',
        };
        logger.debug('Cloud user context loaded:', JSON.stringify(cachedUserContext));
        return cachedUserContext;
    } catch (err) {
        logger.warn('Failed to fetch Cloud user context:', err);
        return { userDirectory: '', userId: '', userName: '' };
    }
}

// ---------------------------------------------------------------------------
// CSS injection
// ---------------------------------------------------------------------------

/**
 * Inject a CSS string into the document <head> as a <style> element.
 * Idempotent — if an element with the given ID already exists, it is skipped.
 *
 * @param {string} css - CSS string to inject.
 * @param {string} id - Unique ID for the <style> element.
 */
export function injectCSS(css, id) {
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    logger.debug('Injected CSS:', id);
}
