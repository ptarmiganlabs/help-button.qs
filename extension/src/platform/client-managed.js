/**
 * Client-managed Qlik Sense platform adapter.
 *
 * Encapsulates all DOM interaction and Sense API calls specific to
 * Qlik Sense Enterprise on Windows (client-managed).
 */

import logger from '../util/logger';
import { fetchSenseVersionInfo } from '../util/product-info';
import { getSelectors } from './selectors';

// ---------------------------------------------------------------------------
// Version detection
// ---------------------------------------------------------------------------

/**
 * Detect the running Qlik Sense version by fetching the product-info manifest.
 *
 * @returns {Promise<{ version: string, releaseLabel: string } | null>}
 */
export async function getSenseVersion() {
    return fetchSenseVersionInfo();
}

// ---------------------------------------------------------------------------
// Code-path resolution
// ---------------------------------------------------------------------------

/**
 * Version-range-to-code-path mapping.
 *
 * @type {Array<{ minVersion: string, maxVersion: string, codePath: string }>}
 */
const versionRanges = [
    // Example: { minVersion: '15.0.0', maxVersion: '99.999.999', codePath: 'future' },
];

/**
 * Simple semver comparison.
 *
 * @param {string} a - Version string.
 * @param {string} b - Version string.
 * @returns {number} Negative if a < b, 0 if equal, positive if a > b.
 */
function compareVersions(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        const diff = (pa[i] || 0) - (pb[i] || 0);
        if (diff !== 0) return diff;
    }
    return 0;
}

/**
 * Resolve the code-path name for a given Sense version.
 *
 * @param {string | null} version - Sense version string.
 * @returns {string} Code-path name.
 */
export function resolveCodePath(version) {
    if (!version) return 'default';

    for (const range of versionRanges) {
        if (
            compareVersions(version, range.minVersion) >= 0 &&
            compareVersions(version, range.maxVersion) <= 0
        ) {
            return range.codePath;
        }
    }

    return 'default';
}

// ---------------------------------------------------------------------------
// Toolbar anchor
// ---------------------------------------------------------------------------

/**
 * Get the toolbar anchor element where the help button should be injected.
 *
 * @param {string} [codePath] - Code-path name.
 * @returns {Element | null} The toolbar anchor element, or null if not found.
 */
export function getToolbarAnchor(codePath) {
    const sels = getSelectors('client-managed', codePath);
    return document.querySelector(sels.toolbarAnchor);
}

/**
 * Get the toolbar anchor CSS selector string.
 *
 * @param {string} [codePath] - Code-path name.
 * @returns {string} CSS selector for the toolbar anchor.
 */
export function getToolbarAnchorSelector(codePath) {
    const sels = getSelectors('client-managed', codePath);
    return sels.toolbarAnchor;
}

// ---------------------------------------------------------------------------
// User context
// ---------------------------------------------------------------------------

/**
 * Cached user context.
 *
 * @type {{ userDirectory: string, userId: string } | null}
 */
let cachedUserContext = null;

/**
 * Fetch user context from the Qlik Sense proxy API.
 *
 * @returns {Promise<{ userDirectory: string, userId: string }>}
 */
export async function getUserContext() {
    if (cachedUserContext) return cachedUserContext;

    try {
        const resp = await fetch('/qps/user?targetUri=' + encodeURIComponent(window.location.href));
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        cachedUserContext = {
            userDirectory: data.userDirectory || '',
            userId: data.userId || '',
        };
        logger.debug('CM user context loaded:', JSON.stringify(cachedUserContext));
        return cachedUserContext;
    } catch (err) {
        logger.warn('Failed to fetch CM user context:', err);
        return { userDirectory: '', userId: '' };
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
 * Detect the current sheet ID from the URL or Qlik API.
 *
 * @returns {string | null} Sheet ID or null.
 */
export function getCurrentSheetId() {
    const url = window.location.href;

    // Pattern 1: URL /sheet/ID
    const match = url.match(/\/sheet\/([a-zA-Z0-9-]+)/);
    if (match) return match[1];

    // Pattern 2: Qlik global API
    try {
        if (window.qlik?.navigation?.getCurrentSheetId) {
            const qlikSheetId = window.qlik.navigation.getCurrentSheetId();
            const id = typeof qlikSheetId === 'string' ? qlikSheetId : qlikSheetId?.id;
            if (id) return id;
        }
    } catch { /* ignored */ }

    // Pattern 3: DOM fallback
    try {
        const sels = getSelectors('client-managed');
        const sheetEl = document.querySelector(sels.sheetContainer);
        if (sheetEl) {
            const domId =
                sheetEl.getAttribute('data-id') ||
                sheetEl.getAttribute('data-qid') ||
                sheetEl.getAttribute('id')?.replace('qv-sheet-', '');
            if (domId && domId.length > 5) return domId;
        }
    } catch { /* ignored */ }

    return null;
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

                // Add children of objects (e.g. layout containers)
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
                        logger.warn(`Could not get layout for object ${id}:`, e);
                    }
                }

                if (sheetLayout.qChildList?.qItems) {
                    const childIds = sheetLayout.qChildList.qItems.map((item) => item.qInfo.qId);
                    sheetObjectIds = [...new Set([...sheetObjectIds, ...childIds])];
                }

                const filtered = infos.filter((info) => sheetObjectIds.includes(info.qId));
                if (filtered.length > 0) infos = filtered;
            } catch (e) {
                logger.warn('Could not filter by sheet:', e);
            }
        }

        const objects = infos
            .filter((info) => !EXCLUDE_TYPES.includes(info.qType) && !info.qType.includes('system'))
            .map((info) => ({ id: info.qId, title: info.qTitle || info.qId, type: info.qType }));

        // Enrich titles for objects that only have an ID as title
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
        logger.error('Failed to get sheet objects:', err);
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
    const sels = getSelectors('client-managed', codePath);
    return sels.objectById(objectId);
}
