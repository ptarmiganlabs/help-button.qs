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

// ---------------------------------------------------------------------------
// Sheet & object utilities (for tooltip targeting)
// ---------------------------------------------------------------------------

/**
 * Detect the current sheet ID from the URL.
 *
 * @returns {string | null} Sheet ID or null.
 */
export function getCurrentSheetId() {
    const match = window.location.href.match(/\/sheet\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
}

/** Object types to exclude from sheet object lists. */
const EXCLUDE_TYPES = [
    'sheet', 'story', 'appprops', 'loadmodel',
    'dimension', 'measure', 'masterobject',
    'bookmark', 'snapshot', 'variable',
];

/**
 * Get the list of objects on the current sheet.
 *
 * @param {object} app - Enigma app object.
 * @returns {Promise<Array<{id: string, title: string, type: string}>>}
 */
export async function getSheetObjects(app) {
    try {
        let infos = await app.getAllInfos();
        const sheetId = getCurrentSheetId();

        if (sheetId) {
            try {
                const sheetObj = await app.getObject(sheetId);
                const sheetLayout = await sheetObj.getLayout();
                let sheetObjectIds = (sheetLayout.cells || []).map((c) => c.name);

                for (const id of [...sheetObjectIds]) {
                    try {
                        const objHandle = await app.getObject(id);
                        const layout = await objHandle.getLayout();
                        if (layout.qChildList?.qItems) {
                            layout.qChildList.qItems.forEach((item) => {
                                sheetObjectIds.push(item.qInfo.qId);
                            });
                        }
                    } catch (e) {
                        logger.warn(`Cloud: could not get layout for object ${id}:`, e);
                    }
                }

                if (sheetLayout.qChildList?.qItems) {
                    const childIds = sheetLayout.qChildList.qItems.map((item) => item.qInfo.qId);
                    sheetObjectIds = [...new Set([...sheetObjectIds, ...childIds])];
                }

                const filtered = infos.filter((info) => sheetObjectIds.includes(info.qId));
                if (filtered.length > 0) infos = filtered;
            } catch (e) {
                logger.warn('Cloud: could not filter by sheet:', e);
            }
        }

        const objects = infos
            .filter((info) => !EXCLUDE_TYPES.includes(info.qType) && !info.qType.includes('system'))
            .map((info) => ({ id: info.qId, title: info.qTitle || info.qId, type: info.qType }));

        if (objects.length < 100) {
            const enriched = await Promise.all(
                objects.map(async (obj) => {
                    if (obj.title === obj.id) {
                        try {
                            const objHandle = await app.getObject(obj.id);
                            const layout = await objHandle.getLayout();
                            return {
                                ...obj,
                                title: layout.title || layout.qMeta?.title || obj.id,
                                type: layout.qInfo?.qType || obj.type,
                            };
                        } catch { /* ignored */ }
                    }
                    return obj;
                })
            );
            return enriched.sort((a, b) => a.title.localeCompare(b.title));
        }

        return objects.sort((a, b) => a.title.localeCompare(b.title));
    } catch (err) {
        logger.error('Cloud: failed to get sheet objects:', err);
        return [];
    }
}

/**
 * Get the CSS selector for a specific Qlik object by ID.
 *
 * @param {string} objectId - The Qlik object ID.
 * @param {string} [codePath] - Code-path name.
 * @returns {string} CSS selector string.
 */
export function getObjectSelector(objectId, codePath) {
    const sels = getSelectors('cloud', codePath);
    return sels.objectById(objectId);
}
