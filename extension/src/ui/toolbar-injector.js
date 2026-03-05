/**
 * Toolbar injection module for qs-help-button.
 *
 * Handles finding the toolbar anchor, creating the help button element,
 * injecting it, and watching for SPA navigation/removal.
 */

import { makeSvg } from './icons';
import { createPopupMenu } from './popup-menu';
import { openBugReportDialog } from './bug-report-dialog';
import { escapeHtml } from '../util/template-fields';
import { resolveText } from '../i18n/index';
import logger from '../util/logger';

/**
 * Unique ID for the injected help button container.
 *
 * @type {string}
 */
const CONTAINER_ID = 'qshb-container';

/**
 * Active popup controls — stored to allow cleanup.
 *
 * @type {{ destroy: function } | null}
 */
let activePopup = null;

/**
 * Active removal watcher observer.
 *
 * @type {MutationObserver | null}
 */
let removalObserver = null;

/**
 * Last-known injection config — stored so watchForRemoval can
 * re-inject the button after SPA navigation even when the
 * Supernova component is no longer mounted.
 *
 * @type {{ layout: object, adapter: object, platform: object } | null}
 */
let lastConfig = null;

/**
 * Inject the help button into the toolbar.
 *
 * @param {object} layout - The extension layout (from useLayout).
 * @param {object} adapter - Platform adapter module.
 * @param {{ type: string, codePath: string }} platform - Platform detection result.
 * @returns {function} Cleanup function to remove the button and listeners.
 */
export function injectHelpButton(layout, adapter, platform) {
    // Persist config so watchForRemoval can re-inject without the component
    lastConfig = { layout, adapter, platform };

    // Guard against double-injection
    if (document.getElementById(CONTAINER_ID)) {
        logger.debug('Help button already exists, updating config');
        destroyHelpButton();
    }

    const anchor = adapter.getToolbarAnchor(platform.codePath);
    if (!anchor) {
        logger.debug('Toolbar anchor not found, will retry via observer');
        return waitAndInject(layout, adapter, platform);
    }

    logger.debug('Toolbar anchor found. Injecting help button…');

    // Read config from layout
    const buttonLabel = resolveText(layout.buttonLabel, 'buttonLabel');
    const buttonTooltip = resolveText(layout.buttonTooltip, 'buttonTooltip');
    const buttonIcon = layout.buttonIcon || 'help';
    const buttonStyle = layout.buttonStyle || {};
    const popupTitle = resolveText(layout.popupTitle, 'popupTitle');
    const popupStyle = layout.popupStyle || {};
    const menuItems = layout.menuItems || [];
    const bugReport = layout.bugReport || {};

    // -- Container --
    const container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.className = 'qshb-container';

    // -- Toolbar button --
    const btn = document.createElement('button');
    btn.id = 'qshb-button';
    btn.className = 'qshb-button';
    btn.type = 'button';
    btn.title = buttonTooltip;
    btn.setAttribute('aria-label', buttonTooltip);
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');

    // Apply button colors from layout
    if (buttonStyle.backgroundColor) btn.style.setProperty('--qshb-btn-bg', buttonStyle.backgroundColor);
    if (buttonStyle.backgroundColorHover) btn.style.setProperty('--qshb-btn-bg-hover', buttonStyle.backgroundColorHover);
    if (buttonStyle.textColor) btn.style.setProperty('--qshb-btn-text', buttonStyle.textColor);
    if (buttonStyle.borderColor) btn.style.setProperty('--qshb-btn-border', buttonStyle.borderColor);
    if (buttonStyle.borderRadius) btn.style.setProperty('--qshb-btn-radius', buttonStyle.borderRadius);

    btn.innerHTML =
        `<span class="qshb-button-icon">${makeSvg(buttonIcon, 16, buttonStyle.textColor || '#ffffff')}</span>` +
        `<span class="qshb-button-label">${escapeHtml(buttonLabel)}</span>`;

    container.appendChild(btn);

    // -- Inject into toolbar --
    if (platform.type === 'client-managed') {
        // CM: insert as first child of #top-bar-right-side
        anchor.insertBefore(container, anchor.firstChild);
        // Ensure the anchor is wide enough
        anchor.style.width = 'auto';
        anchor.style.minWidth = '300px';
    } else {
        // Cloud: insert into the toolbar's right section
        anchor.insertBefore(container, anchor.firstChild);
    }

    // -- Create popup menu --
    const popupControls = createPopupMenu(btn, {
        popupTitle,
        menuItems,
        popupStyle,
        buttonStyle,
        onBugReport: bugReport.enabled
            ? () => openBugReportDialog(bugReport, platform.type)
            : undefined,
    });
    activePopup = popupControls;

    // Toggle popup on button click
    btn.addEventListener('click', popupControls.toggle);

    // -- Watch for removal (SPA navigation) --
    watchForRemoval();

    logger.info('Help button injected into toolbar');

    return () => destroyHelpButton();
}

/**
 * Wait for the toolbar to appear, then inject.
 * Uses MutationObserver + polling fallback.
 *
 * @param {object} layout - Extension layout.
 * @param {object} adapter - Platform adapter module.
 * @param {object} platform - Platform detection result.
 * @returns {function} Cleanup function.
 */
function waitAndInject(layout, adapter, platform) {
    const startTime = Date.now();
    const timeout = 30000;
    const pollInterval = 500;
    let observer = null;
    let pollTimer = null;
    let cancelled = false;

    function tryInject() {
        if (cancelled) return false;
        const anchor = adapter.getToolbarAnchor(platform.codePath);
        if (anchor) {
            cleanup();
            injectHelpButton(layout, adapter, platform);
            return true;
        }
        return false;
    }

    function cleanup() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }

    // MutationObserver
    if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(() => {
            tryInject();
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    // Polling fallback
    pollTimer = setInterval(() => {
        if (tryInject()) return;
        if (Date.now() - startTime > timeout) {
            logger.warn('Timeout: toolbar anchor did not appear within', timeout, 'ms');
            cleanup();
        }
    }, pollInterval);

    return () => {
        cancelled = true;
        cleanup();
    };
}

/**
 * Watch for removal of the help button (SPA navigation).
 * Re-injects after a short delay when the button disappears.
 * Uses the module-level lastConfig for re-injection parameters.
 */
function watchForRemoval() {
    if (removalObserver) {
        removalObserver.disconnect();
        removalObserver = null;
    }

    if (typeof MutationObserver === 'undefined') return;

    removalObserver = new MutationObserver(() => {
        if (!document.getElementById(CONTAINER_ID) && lastConfig) {
            logger.debug('Help button removed from DOM (SPA navigation?). Re-injecting…');
            setTimeout(() => {
                if (lastConfig) {
                    injectHelpButton(lastConfig.layout, lastConfig.adapter, lastConfig.platform);
                }
            }, 300);
        }
    });

    removalObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
}

/**
 * Remove the help button and clean up all listeners.
 */
/**
 * Remove the help button and clean up all listeners.
 *
 * @param {{ clearConfig?: boolean }} options - When clearConfig is true,
 *   also wipe the stored config so watchForRemoval will NOT re-inject.
 *   Use clearConfig in edit-mode; omit it during normal unmount so the
 *   button survives sheet navigation.
 */
export function destroyHelpButton({ clearConfig = false } = {}) {
    if (activePopup) {
        activePopup.destroy();
        activePopup = null;
    }

    if (clearConfig) {
        lastConfig = null;
    }

    if (removalObserver) {
        removalObserver.disconnect();
        removalObserver = null;
    }

    const container = document.getElementById(CONTAINER_ID);
    if (container) {
        container.remove();
    }

    logger.debug('Help button destroyed', clearConfig ? '(config cleared)' : '(config kept)');
}
