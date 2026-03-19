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

/** Minimum pointer movement (px) before a click becomes a drag. */
const DRAG_THRESHOLD = 5;

/** Active MutationObserver for lazy-loaded targets. */
let retryObserver = null;
/** Timeout handle for the retry observer safety stop. */
let retryTimeout = null;

/** Pending tooltip items waiting for their target to appear. */
let pendingItems = [];

/**
 * Stores dragged icon positions so they survive hide/show (destroy/inject) cycles.
 * Key: tooltip index, Value: { left: string, top: string }.
 * Intentionally NOT cleared in destroyTooltips() so positions persist.
 */
const draggedPositions = new Map();

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
    applyPosition(iconEl, item);

    // Enable drag-to-move when floating toggle is on
    if (item.iconFloating) {
        iconEl.classList.add('hbqs-tooltip-trigger--floating');
        enableDrag(iconEl, targetEl, index);

        // Restore previously dragged position if available
        const saved = draggedPositions.get(index);
        if (saved) {
            iconEl.style.left = saved.left;
            iconEl.style.top = saved.top;
            iconEl.style.right = '';
            iconEl.style.bottom = '';
            iconEl.style.removeProperty('--hbqs-tt-translate');
        }
    }

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
    logger.debug(`Tooltip "${item.tooltipLabel}" mounted on target (position: ${item.iconPosition}${item.iconFloating ? ', floating' : ''})`);
}

/**
 * Enable drag-to-move on a tooltip icon constrained within its parent.
 *
 * A click is distinguished from a drag by a movement threshold:
 * if the pointer moves less than {@link DRAG_THRESHOLD} pixels the
 * interaction is treated as a normal click.
 *
 * @param {HTMLElement} iconEl - The tooltip icon element.
 * @param {Element} parentEl - The parent element that constrains movement.
 * @param {number} tooltipIndex - The tooltip's index, used to persist position.
 */
function enableDrag(iconEl, parentEl, tooltipIndex) {
    let startX, startY;
    let origLeft, origTop;
    let dragging = false;
    let didDrag = false;

    function toAbsoluteLeftTop() {
        // Convert whatever positioning the icon currently has into explicit
        // left / top values so we can manipulate them during drag.
        const parentRect = parentEl.getBoundingClientRect();
        const iconRect = iconEl.getBoundingClientRect();

        iconEl.style.left = `${iconRect.left - parentRect.left}px`;
        iconEl.style.top = `${iconRect.top - parentRect.top}px`;
        iconEl.style.right = '';
        iconEl.style.bottom = '';
        iconEl.style.removeProperty('--hbqs-tt-translate');
    }

    function onPointerDown(e) {
        // Only handle primary button
        if (e.button !== 0) return;
        // Do NOT preventDefault here — it would suppress focus-on-click for the
        // focusable icon element (tabindex="0"), breaking :focus-visible behaviour.
        // Text-selection during drag is prevented by setPointerCapture() below.

        toAbsoluteLeftTop();

        startX = e.clientX;
        startY = e.clientY;
        origLeft = parseFloat(iconEl.style.left);
        origTop = parseFloat(iconEl.style.top);
        dragging = false;
        didDrag = false;

        iconEl.setPointerCapture(e.pointerId);
        iconEl.addEventListener('pointermove', onPointerMove);
        iconEl.addEventListener('pointerup', onPointerUp);
        iconEl.addEventListener('pointercancel', onPointerCancel);
    }

    function onPointerMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!dragging) {
            if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
            // Drag confirmed — prevent text selection from this point onward.
            e.preventDefault();
            dragging = true;
            didDrag = true;
            iconEl.classList.add('hbqs-tooltip-trigger--dragging');
            hideHover();
        }

        const parentRect = parentEl.getBoundingClientRect();
        const iconSize = iconEl.offsetWidth;

        let newLeft = origLeft + dx;
        let newTop = origTop + dy;

        // Constrain within parent bounds
        newLeft = Math.max(0, Math.min(newLeft, parentRect.width - iconSize));
        newTop = Math.max(0, Math.min(newTop, parentRect.height - iconSize));

        iconEl.style.left = `${newLeft}px`;
        iconEl.style.top = `${newTop}px`;
    }

    function cleanupDrag(e) {
        iconEl.releasePointerCapture(e.pointerId);
        iconEl.removeEventListener('pointermove', onPointerMove);
        iconEl.removeEventListener('pointerup', onPointerUp);
        iconEl.removeEventListener('pointercancel', onPointerCancel);
        iconEl.classList.remove('hbqs-tooltip-trigger--dragging');
        dragging = false;
    }

    function onPointerUp(e) {
        cleanupDrag(e);
        // Persist position so it survives hide/show cycles
        if (didDrag) {
            draggedPositions.set(tooltipIndex, {
                left: iconEl.style.left,
                top: iconEl.style.top,
            });
        }
        // didDrag intentionally left true — the click handler clears it once it
        // fires (capture phase), so the dialog-open click is suppressed correctly.
    }

    function onPointerCancel(e) {
        cleanupDrag(e);
        // No click will follow a pointercancel, so reset didDrag explicitly to
        // avoid permanently suppressing the next real click.
        didDrag = false;
    }

    iconEl.addEventListener('pointerdown', onPointerDown);

    // Suppress click when the interaction was a drag
    iconEl.addEventListener(
        'click',
        (e) => {
            if (didDrag) {
                e.stopImmediatePropagation();
                didDrag = false;
            }
        },
        true, // capture phase so it fires before the dialog-opening click handler
    );
}

/**
 * Apply CSS position offsets for the icon based on the position config.
 *
 * @param {HTMLElement} iconEl - The tooltip icon element.
 * @param {object} item - Tooltip configuration item.
 */
function applyPosition(iconEl, item) {
    const position = item.iconPosition || 'top-right';

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
        case 'percentage': {
            const rawX = item.iconPositionX;
            const rawY = item.iconPositionY;
            logger.debug(`Percentage position — raw iconPositionX: ${rawX} (${typeof rawX}), iconPositionY: ${rawY} (${typeof rawY})`);
            const x = Math.max(0, Math.min(100, Number(rawX) || 50));
            const y = Math.max(0, Math.min(100, Number(rawY) || 50));
            iconEl.style.left = `${x}%`;
            iconEl.style.top = `${y}%`;
            iconEl.style.setProperty('--hbqs-tt-translate', 'translate(-50%, -50%)');
            break;
        }
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
