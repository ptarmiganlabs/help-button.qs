/**
 * Tooltip injector for HelpButton.qs.
 *
 * Renders tooltip trigger icons on Qlik Sense chart objects or arbitrary
 * CSS-selected elements. Each icon shows a hover popup and optionally
 * opens a detail dialog on click.
 */

import { makeSvg } from './icons';
import { showHover, scheduleHide, cancelHide, hideHover } from './tooltip-hover';
import { openTooltipDialog } from './tooltip-dialog';
import { resolveColor } from '../util/color';
import logger from '../util/logger';

/** Prefix for tooltip icon element IDs. */
const ID_PREFIX = 'hbqs-tooltip-';

/** CSS class applied to targets to ensure position:relative. */
const POSITIONED_CLASS = 'hbqs-tooltip-target';

/** Active MutationObserver for lazy-loaded targets. */
let retryObserver = null;
/** Timeout handle for the retry observer safety stop. */
let retryTimeout = null;

/** Pending tooltip items waiting for their target to appear. */
let pendingItems = [];

/**
 * Inject all tooltip icons defined in the layout.
 *
 * @param {object} layout - Extension layout containing `tooltips[]`.
 * @param {object} adapter - Platform adapter module.
 * @param {{ type: string, codePath: string }} platform - Platform detection result.
 */
export function injectTooltips(layout, adapter, platform) {
    destroyTooltips();

    const tooltips = layout.tooltips || [];
    if (tooltips.length === 0) return;

    logger.debug(`Injecting ${tooltips.length} tooltip(s)`);

    pendingItems = [];

    tooltips.forEach((item, index) => {
        // Visibility check: skip tooltip when showCondition evaluates to 0
        if (isTooltipHidden(item)) {
            logger.debug(`Tooltip "${item.tooltipLabel}" hidden by show condition`);
            return;
        }

        const targetEl = resolveTarget(item, adapter, platform);
        if (targetEl) {
            mountTooltipIcon(item, targetEl, index);
        } else {
            // Target not yet in DOM — queue for retry
            pendingItems.push({ item, index });
            logger.debug(`Tooltip "${item.tooltipLabel}" target not found, queued for retry`);
        }
    });

    // Set up observer for pending items
    if (pendingItems.length > 0) {
        startRetryObserver(adapter, platform);
    }
}

/**
 * Remove all injected tooltip icons and clean up.
 */
export function destroyTooltips() {
    // Remove all tooltip icons
    document.querySelectorAll(`[id^="${ID_PREFIX}"]`).forEach((el) => el.remove());

    // Remove positioned class from targets
    document.querySelectorAll(`.${POSITIONED_CLASS}`).forEach((el) => {
        el.classList.remove(POSITIONED_CLASS);
    });

    // Clean up retry observer
    if (retryTimeout !== null) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
    }
    if (retryObserver) {
        retryObserver.disconnect();
        retryObserver = null;
    }
    pendingItems = [];

    // Hide any active hover
    hideHover();
}

/**
 * Determine whether a tooltip should be hidden based on its show condition.
 *
 * An empty or undefined condition means the tooltip is always visible.
 * Hide ONLY if explicitly "0" or "false".
 *
 * @param {object} item - Tooltip configuration item.
 * @returns {boolean} True if the tooltip should be hidden.
 */
function isTooltipHidden(item) {
    // If showCondition is undefined or placeholder, show the item.
    // If it's an expression, the engine replaces it in the layout with the result string.
    if (item.showCondition === undefined || item.showCondition === null || item.showCondition === '') {
        return false;
    }

    // Qlik expressions returning false/0 often result in the string "0".
    // Hide ONLY if explicitly "0" or "false".
    const condition = String(item.showCondition).trim();
    return condition === '0' || condition.toLowerCase() === 'false';
}

/**
 * Resolve the DOM element for a tooltip target.
 *
 * @param {object} item - Tooltip configuration item.
 * @param {object} adapter - Platform adapter.
 * @param {object} platform - Platform info.
 * @returns {Element | null} Target DOM element or null.
 */
function resolveTarget(item, adapter, platform) {
    if (item.targetType === 'css' && item.targetCssSelector) {
        return document.querySelector(item.targetCssSelector);
    }

    // Default: Qlik object by ID
    if (item.targetObjectId) {
        const selector = adapter.getObjectSelector(item.targetObjectId, platform.codePath);
        return document.querySelector(selector);
    }

    return null;
}

/**
 * Create and mount a tooltip icon on a target element.
 *
 * @param {object} item - Tooltip configuration.
 * @param {Element} targetEl - Target DOM element.
 * @param {number} index - Tooltip index (for unique ID).
 */
function mountTooltipIcon(item, targetEl, index) {
    // Ensure target is a positioning context
    const computed = getComputedStyle(targetEl);
    if (computed.position === 'static') {
        targetEl.classList.add(POSITIONED_CLASS);
    }

    const iconEl = document.createElement('div');
    iconEl.id = `${ID_PREFIX}${index}`;
    iconEl.className = 'hbqs-tooltip-trigger';
    iconEl.setAttribute('role', 'button');
    iconEl.setAttribute('tabindex', '0');
    iconEl.setAttribute('aria-label', item.tooltipLabel || 'Tooltip');

    // Icon appearance
    const iconColor = resolveColor(item.iconColor, '#ffffff');
    const bgColor = resolveColor(item.iconBackgroundColor, '#165a9b');
    const iconSize = item.iconSize || 20;

    iconEl.style.setProperty('--hbqs-tt-bg-color', bgColor);
    iconEl.style.setProperty('--hbqs-tt-size', `${iconSize + 8}px`);
    iconEl.innerHTML = makeSvg(item.iconName || 'info', iconSize, iconColor);

    // Position
    applyPosition(iconEl, item.iconPosition || 'top-right');

    // Resolve hover/dialog theme colors
    const hoverColors = {
        backgroundColor: resolveColor(item.hoverBackgroundColor, '#ffffff'),
        textColor: resolveColor(item.hoverTextColor, '#1f2937'),
        borderColor: resolveColor(item.hoverBorderColor, '#d1d5db'),
    };
    const dialogColors = {
        headerBackgroundColor: resolveColor(item.dialogHeaderBackgroundColor, '#f9fafb'),
        headerTextColor: resolveColor(item.dialogHeaderTextColor, '#111827'),
        bodyBackgroundColor: resolveColor(item.dialogBodyBackgroundColor, '#ffffff'),
        bodyTextColor: resolveColor(item.dialogBodyTextColor, '#374151'),
    };

    // Hover behavior
    iconEl.addEventListener('mouseenter', () => {
        cancelHide();
        if (item.hoverContent) {
            showHover(iconEl, item.hoverContent, hoverColors);
        }
    });
    iconEl.addEventListener('mouseleave', () => {
        scheduleHide();
    });

    // Click behavior
    if (item.dialogEnabled !== false) {
        iconEl.addEventListener('click', (e) => {
            e.stopPropagation();
            hideHover();
            openTooltipDialog({
                title: item.dialogTitle || item.tooltipLabel || '',
                content: item.dialogContent || '',
                size: item.dialogSize || 'medium',
                ...dialogColors,
            });
        });

        // Keyboard: Enter/Space
        iconEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                hideHover();
                openTooltipDialog({
                    title: item.dialogTitle || item.tooltipLabel || '',
                    content: item.dialogContent || '',
                    size: item.dialogSize || 'medium',
                    ...dialogColors,
                });
            }
        });
    }

    targetEl.appendChild(iconEl);
    logger.debug(`Tooltip "${item.tooltipLabel}" mounted on target (position: ${item.iconPosition})`);
}

/**
 * Apply CSS position offsets for the icon based on the position name.
 *
 * @param {HTMLElement} iconEl - The tooltip icon element.
 * @param {string} position - Position name (e.g. 'top-right', 'center-left').
 */
function applyPosition(iconEl, position) {
    // Reset
    iconEl.style.top = '';
    iconEl.style.bottom = '';
    iconEl.style.left = '';
    iconEl.style.right = '';
    iconEl.style.removeProperty('--hbqs-tt-translate');

    switch (position) {
        case 'top-left':
            iconEl.style.top = '4px';
            iconEl.style.left = '4px';
            break;
        case 'top-center':
            iconEl.style.top = '4px';
            iconEl.style.left = '50%';
            iconEl.style.setProperty('--hbqs-tt-translate', 'translateX(-50%)');
            break;
        case 'top-right':
            iconEl.style.top = '4px';
            iconEl.style.right = '4px';
            break;
        case 'center-left':
            iconEl.style.top = '50%';
            iconEl.style.left = '4px';
            iconEl.style.setProperty('--hbqs-tt-translate', 'translateY(-50%)');
            break;
        case 'center-right':
            iconEl.style.top = '50%';
            iconEl.style.right = '4px';
            iconEl.style.setProperty('--hbqs-tt-translate', 'translateY(-50%)');
            break;
        case 'bottom-left':
            iconEl.style.bottom = '4px';
            iconEl.style.left = '4px';
            break;
        case 'bottom-center':
            iconEl.style.bottom = '4px';
            iconEl.style.left = '50%';
            iconEl.style.setProperty('--hbqs-tt-translate', 'translateX(-50%)');
            break;
        case 'bottom-right':
            iconEl.style.bottom = '4px';
            iconEl.style.right = '4px';
            break;
        default:
            iconEl.style.top = '4px';
            iconEl.style.right = '4px';
    }
}

/**
 * Start a MutationObserver to retry mounting tooltips whose targets
 * weren't in the DOM initially (e.g. lazy-loaded Qlik objects).
 *
 * @param {object} adapter - Platform adapter.
 * @param {object} platform - Platform info.
 */
function startRetryObserver(adapter, platform) {
    // Clean up any previous observer and timeout
    if (retryTimeout !== null) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
    }
    if (retryObserver) {
        retryObserver.disconnect();
        retryObserver = null;
    }

    const observer = new MutationObserver(() => {
        if (pendingItems.length === 0) {
            observer.disconnect();
            if (retryObserver === observer) retryObserver = null;
            return;
        }

        const stillPending = [];
        for (const { item, index } of pendingItems) {
            // Skip if already mounted (e.g. by a previous mutation batch)
            if (document.getElementById(`${ID_PREFIX}${index}`)) continue;

            const targetEl = resolveTarget(item, adapter, platform);
            if (targetEl) {
                mountTooltipIcon(item, targetEl, index);
            } else {
                stillPending.push({ item, index });
            }
        }
        pendingItems = stillPending;

        if (pendingItems.length === 0) {
            observer.disconnect();
            if (retryObserver === observer) retryObserver = null;
        }
    });

    retryObserver = observer;
    observer.observe(document.body, { childList: true, subtree: true });

    // Safety: stop observing after 30 seconds to avoid leaks
    retryTimeout = setTimeout(() => {
        if (retryObserver === observer) {
            observer.disconnect();
            retryObserver = null;
            retryTimeout = null;
            if (pendingItems.length > 0) {
                logger.warn(`${pendingItems.length} tooltip target(s) not found after 30s timeout`);
            }
        }
    }, 30000);
}
