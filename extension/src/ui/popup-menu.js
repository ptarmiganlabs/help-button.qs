/**
 * Popup menu component for qs-help-button.
 *
 * Creates a floating dropdown popup attached to the toolbar button.
 * Appended to document.body to avoid overflow:hidden clipping.
 */

import { makeSvg } from './icons';
import { resolveTemplateFields } from '../util/template-fields';
import logger from '../util/logger';

/**
 * @typedef {object} MenuItem
 * @property {string} label - Display text.
 * @property {string} [url] - Link URL (supports {{template}} fields).
 * @property {string} [icon] - Icon name (help, bug, info, mail, link).
 * @property {string} [target] - Link target (_blank, _self).
 * @property {string} [action] - Special action ('bugReport').
 * @property {string} [iconColor] - Icon color.
 * @property {string} [bgColor] - Background color.
 * @property {string} [bgColorHover] - Hover background color.
 * @property {string} [textColor] - Text color.
 */

/**
 * @typedef {object} PopupConfig
 * @property {string} popupTitle - Heading text.
 * @property {MenuItem[]} menuItems - Array of menu items.
 * @property {object} popupStyle - Style overrides.
 * @property {object} buttonStyle - Button style (for icon color reference).
 * @property {function} [onBugReport] - Callback when a bugReport action item is clicked.
 */

/**
 * Create and show the popup menu, positioned below the trigger button.
 *
 * @param {HTMLElement} triggerButton - The toolbar button that opens the popup.
 * @param {PopupConfig} config - Popup configuration from layout.
 * @returns {{ popup: HTMLElement, close: function, destroy: function }} Popup controls.
 */
export function createPopupMenu(triggerButton, config) {
    const { popupTitle, menuItems = [], popupStyle = {}, onBugReport } = config;

    // Remove any existing popup
    const existingPopup = document.getElementById('qshb-popup');
    if (existingPopup) existingPopup.remove();

    // -- Popup container --
    const popup = document.createElement('div');
    popup.id = 'qshb-popup';
    popup.className = 'qshb-popup';
    popup.setAttribute('role', 'menu');
    popup.setAttribute('aria-label', popupTitle || 'Help menu');

    // -- Header --
    const header = document.createElement('div');
    header.className = 'qshb-popup-header';
    if (popupStyle.headerBackgroundColor) {
        header.style.backgroundColor = popupStyle.headerBackgroundColor;
    }
    if (popupStyle.headerTextColor) {
        header.style.color = popupStyle.headerTextColor;
    }
    header.textContent = popupTitle || '';
    popup.appendChild(header);

    // -- Menu items --
    menuItems.forEach((item, idx) => {
        if (idx > 0) {
            const sep = document.createElement('hr');
            sep.className = 'qshb-popup-separator';
            if (popupStyle.separatorColor) {
                sep.style.borderTopColor = popupStyle.separatorColor;
            }
            popup.appendChild(sep);
        }

        const menuItem = document.createElement('a');
        menuItem.className = 'qshb-popup-menu-item';
        menuItem.setAttribute('role', 'menuitem');

        // Apply per-item colors
        if (item.bgColor) menuItem.style.backgroundColor = item.bgColor;
        if (item.textColor) menuItem.style.color = item.textColor;

        // Hover effect via data attributes (CSS handles hover via :hover)
        if (item.bgColorHover) menuItem.dataset.hoverBg = item.bgColorHover;
        if (item.iconColor) menuItem.style.setProperty('--qshb-item-icon-color', item.iconColor);

        // Icon + label
        const iconSpan = document.createElement('span');
        iconSpan.className = 'qshb-popup-item-icon';
        iconSpan.innerHTML = makeSvg(item.icon || 'help', 16, item.iconColor || '#165a9b');
        menuItem.appendChild(iconSpan);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'qshb-popup-item-label';
        labelSpan.textContent = item.label || '';
        menuItem.appendChild(labelSpan);

        // Action or URL
        if (item.action === 'bugReport' && typeof onBugReport === 'function') {
            menuItem.href = '#';
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closePopup();
                onBugReport();
            });
        } else {
            const itemUrl = item.url || '#';
            const itemTarget = item.target || '_blank';

            if (itemUrl.includes('{{')) {
                menuItem.href = '#';
                menuItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const resolved = resolveTemplateFields(itemUrl);
                    window.open(resolved, itemTarget, 'noopener,noreferrer');
                });
            } else {
                menuItem.href = itemUrl;
                menuItem.target = itemTarget;
                menuItem.rel = 'noopener noreferrer';
            }
        }

        // Hover handlers for per-item colors
        menuItem.addEventListener('mouseenter', () => {
            if (item.bgColorHover) menuItem.style.backgroundColor = item.bgColorHover;
            if (item.iconColor) menuItem.style.borderLeftColor = item.iconColor;
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.backgroundColor = item.bgColor || '';
            menuItem.style.borderLeftColor = 'transparent';
        });

        popup.appendChild(menuItem);
    });

    // Apply popup-level styles
    if (popupStyle.backgroundColor) popup.style.backgroundColor = popupStyle.backgroundColor;
    if (popupStyle.borderColor) popup.style.borderColor = popupStyle.borderColor;
    if (popupStyle.borderRadius) popup.style.borderRadius = popupStyle.borderRadius;

    // Append to body to escape overflow clipping
    document.body.appendChild(popup);

    // Position below the trigger button
    positionPopup(triggerButton, popup);

    // Close function
    function closePopup() {
        popup.style.display = 'none';
        triggerButton.setAttribute('aria-expanded', 'false');
    }

    function openPopup() {
        popup.style.display = 'block';
        positionPopup(triggerButton, popup);
        triggerButton.setAttribute('aria-expanded', 'true');
    }

    function togglePopup(e) {
        e.stopPropagation();
        if (popup.style.display === 'none' || !popup.style.display) {
            openPopup();
        } else {
            closePopup();
        }
    }

    // Click outside to close
    function onClickOutside(e) {
        if (!popup.contains(e.target) && !triggerButton.contains(e.target)) {
            closePopup();
        }
    }

    // Escape to close
    function onEscape(e) {
        if (e.key === 'Escape') {
            closePopup();
            triggerButton.focus();
        }
    }

    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onEscape);
    window.addEventListener('resize', () => positionPopup(triggerButton, popup));

    // Start hidden
    popup.style.display = 'none';

    function destroy() {
        document.removeEventListener('click', onClickOutside);
        document.removeEventListener('keydown', onEscape);
        popup.remove();
    }

    logger.debug('Popup menu created with', menuItems.length, 'items');

    return {
        popup,
        open: openPopup,
        close: closePopup,
        toggle: togglePopup,
        destroy,
    };
}

/**
 * Position the popup below the trigger button.
 *
 * @param {HTMLElement} trigger - The button element.
 * @param {HTMLElement} popup - The popup element.
 */
function positionPopup(trigger, popup) {
    const rect = trigger.getBoundingClientRect();
    popup.style.position = 'fixed';
    popup.style.top = `${rect.bottom + 8}px`;
    popup.style.right = `${window.innerWidth - rect.right}px`;
    popup.style.left = 'auto';
}
