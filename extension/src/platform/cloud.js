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
 * is injected into the top bar.
 *
 * @param {string} [codePath] - Code-path name.
 * @returns {Element | null} The toolbar anchor element, or null if not found.
 */
export function getToolbarAnchor(codePath) {
    const sels = getSelectors('cloud', codePath);
    const toolbar = document.querySelector(sels.toolbarAnchor);

    if (!toolbar) return null;

    // In Cloud, the toolbar is a flex container. We look for the right-side
    // actions area to inject our button. If not found, use the toolbar itself.
    const rightSection =
        toolbar.querySelector('[data-testid="top-bar-actions"]') ||
        toolbar.querySelector('[class*="right"]') ||
        toolbar.lastElementChild;

    return rightSection || toolbar;
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
 * Get user context for Cloud. Cloud does not expose /qps/user,
 * so we return minimal context.
 *
 * @returns {Promise<{ userDirectory: string, userId: string }>}
 */
export async function getUserContext() {
    // Cloud doesn't have a simple proxy API for user info
    logger.debug('Cloud platform — user context not available via proxy API');
    return { userDirectory: '', userId: '' };
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
