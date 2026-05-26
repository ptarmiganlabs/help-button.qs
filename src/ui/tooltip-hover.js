/**
 * Tooltip hover popup for HelpButton.qs.
 *
 * Shows a floating content panel when the user hovers over a tooltip icon.
 * Content is rendered from Markdown. The panel auto-positions near the icon
 * and stays open while the cursor is over it.
 */

import { markdownToHtml } from '../util/markdown';
import logger from '../util/logger';

/** Delay (ms) before hiding the hover popup when the cursor leaves. */
const HIDE_DELAY = 200;

/** Currently visible hover popup element. */
let activeHover = null;

/** Timer handle for delayed hide. */
let hideTimer = null;

/**
 * Show the hover popup near the given icon element.
 *
 * @param {HTMLElement} iconEl - The tooltip trigger icon element.
 * @param {string} content - Markdown content for the hover popup.
 * @param {object} [colors] - Optional theme colors for the popup.
 * @param {string} [colors.backgroundColor] - Popup background color.
 * @param {string} [colors.textColor] - Popup text color.
 * @param {string} [colors.borderColor] - Popup border color.
 * @param {string} [allowedUriPatterns] - Comma-separated URL prefixes for
 *   allowed iframe/video/source src attributes. Empty string = allow all.
 */
export function showHover(iconEl, content, colors, allowedUriPatterns) {
    // Don't re-create if already showing for this icon
    if (activeHover && activeHover.dataset.hbqsFor === iconEl.id) return;

    hideHover();

    if (!content) return;

    const popup = document.createElement('div');
    popup.className = 'hbqs-tooltip-hover hbqs-markdown-content';
    popup.dataset.hbqsFor = iconEl.id;
    popup.innerHTML = markdownToHtml(content, { allowedUriPatterns });

    // Apply theme colors
    if (colors) {
        if (colors.backgroundColor) popup.style.background = colors.backgroundColor;
        if (colors.textColor) popup.style.color = colors.textColor;
        if (colors.borderColor) popup.style.borderColor = colors.borderColor;
    }

    // Keep popup visible while cursor is over it
    popup.addEventListener('mouseenter', () => {
        clearTimeout(hideTimer);
    });
    popup.addEventListener('mouseleave', () => {
        scheduleHide();
    });

    document.body.appendChild(popup);
    activeHover = popup;

    // Position relative to the icon
    positionPopup(popup, iconEl);

    logger.debug('Tooltip hover shown for', iconEl.id);
}

/**
 * Schedule hiding of the hover popup after a short delay.
 * The delay allows the user to move their cursor from the icon to the popup.
 */
export function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        hideHover();
    }, HIDE_DELAY);
}

/**
 * Cancel a scheduled hide (e.g. when cursor re-enters the icon).
 */
export function cancelHide() {
    clearTimeout(hideTimer);
}

/**
 * Immediately hide the hover popup.
 */
export function hideHover() {
    clearTimeout(hideTimer);
    if (activeHover) {
        activeHover.remove();
        activeHover = null;
    }
}

/**
 * Position the popup below or above the icon depending on viewport space.
 *
 * @param {HTMLElement} popup - The hover popup element.
 * @param {HTMLElement} iconEl - The trigger icon element.
 */
function positionPopup(popup, iconEl) {
    const iconRect = iconEl.getBoundingClientRect();
    const gap = 8;

    // Temporarily make visible to measure
    popup.style.visibility = 'hidden';
    popup.style.display = 'block';
    const popupRect = popup.getBoundingClientRect();

    const spaceBelow = window.innerHeight - iconRect.bottom;
    const spaceAbove = iconRect.top;

    let top;
    if (spaceBelow >= popupRect.height + gap || spaceBelow >= spaceAbove) {
        // Show below
        top = iconRect.bottom + gap;
    } else {
        // Show above
        top = iconRect.top - popupRect.height - gap;
    }

    // Horizontal: center on icon, but clamp to viewport
    let left = iconRect.left + iconRect.width / 2 - popupRect.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - popupRect.width - 8));

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.visibility = 'visible';
}
