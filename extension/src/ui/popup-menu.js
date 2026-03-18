/**
 * Popup menu component for HelpButton.qs.
 *
 * Creates a floating dropdown popup attached to the toolbar button.
 * Appended to document.body to avoid overflow:hidden clipping.
 */

import { makeSvg } from './icons';
import { resolveTemplateFields } from '../util/template-fields';
import { resolveColor } from '../util/color';
import logger from '../util/logger';

/**
 * @typedef {object} MenuItem
 * @property {string} label - Display text.
 * @property {string} [url] - Link URL (supports {{template}} fields).
 * @property {string} [icon] - Icon name (help, bug, info, mail, link, star).
 * @property {string} [target] - Link target (_blank, _self).
 * @property {string} [action] - Special action ('bugReport', 'feedback', 'setVariable').
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
 * @property {function} [onFeedback] - Callback when a feedback action item is clicked.
 * @property {function} [onSetVariable] - Callback when a setVariable action item is clicked.
 */

/**
 * Create and show the popup menu, positioned below the trigger button.
 *
 * @param {HTMLElement} triggerButton - The toolbar button that opens the popup.
 * @param {PopupConfig} config - Popup configuration from layout.
 * @returns {{ popup: HTMLElement, close: function, destroy: function }} Popup controls.
 */
export function createPopupMenu(triggerButton, config) {
    const { popupTitle, menuItems = [], popupStyle = {}, onBugReport, onFeedback, onSetVariable } = config;

    // Remove any existing popup
    const existingPopup = document.getElementById('hbqs-popup');
    if (existingPopup) existingPopup.remove();

    // -- Popup container --
    const popup = document.createElement('div');
    popup.id = 'hbqs-popup';
    popup.className = 'hbqs-popup';
    popup.setAttribute('role', 'menu');
    popup.setAttribute('aria-label', popupTitle || 'Help menu');

    // -- Header --
    const header = document.createElement('div');
    header.className = 'hbqs-popup-header';
    const headerBg = resolveColor(popupStyle.headerBackgroundColor);
    const headerText = resolveColor(popupStyle.headerTextColor);
    if (headerBg) header.style.backgroundColor = headerBg;
    if (headerText) header.style.color = headerText;
    header.textContent = popupTitle || '';
    popup.appendChild(header);

    // -- Menu items --
    // Filter out items where showCondition is defined and evaluates to false/0
    const visibleMenuItems = menuItems.filter((item) => {
        // If showCondition is undefined or placeholder, show the item.
        // If it's an expression, the engine replaces it in the layout with the result string.
        if (item.showCondition === undefined || item.showCondition === null || item.showCondition === '') {
            return true;
        }

        // Qlik expressions returning false/0 often result in the string "0".
        // Hide ONLY if explicitly "0" or "false".
        const condition = String(item.showCondition).trim();
        return condition !== '0' && condition.toLowerCase() !== 'false';
    });

    visibleMenuItems.forEach((item, idx) => {
        if (idx > 0) {
            const sep = document.createElement('hr');
            sep.className = 'hbqs-popup-separator';
            const sepColor = resolveColor(popupStyle.separatorColor);
            if (sepColor) sep.style.borderTopColor = sepColor;
            popup.appendChild(sep);
        }

        const menuItem = document.createElement('a');
        menuItem.className = 'hbqs-popup-menu-item';
        menuItem.setAttribute('role', 'menuitem');

        // Resolve per-item colors from color-picker objects
        const itemBg = resolveColor(item.bgColor);
        const itemBgHover = resolveColor(item.bgColorHover);
        const itemText = resolveColor(item.textColor);
        const itemIcon = resolveColor(item.iconColor, '#165a9b');

        // Apply per-item colors
        if (itemBg) menuItem.style.backgroundColor = itemBg;
        if (itemText) menuItem.style.color = itemText;

        // Hover effect via data attributes (CSS handles hover via :hover)
        if (itemBgHover) menuItem.dataset.hoverBg = itemBgHover;
        if (itemIcon) menuItem.style.setProperty('--hbqs-item-icon-color', itemIcon);

        // Icon + label
        const iconSpan = document.createElement('span');
        iconSpan.className = 'hbqs-popup-item-icon';
        iconSpan.innerHTML = makeSvg(item.icon || 'help', 16, itemIcon);
        menuItem.appendChild(iconSpan);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'hbqs-popup-item-label';
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
        } else if (item.action === 'feedback' && typeof onFeedback === 'function') {
            menuItem.href = '#';
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closePopup();
                onFeedback();
            });
        } else if (item.action === 'setVariable' && typeof onSetVariable === 'function') {
            menuItem.href = '#';
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closePopup();
                onSetVariable(item.variableAction || {});
            });
        } else if (item.action === 'setVariable') {
            // Explicitly handle setVariable without a callback to avoid falling back to generic URL (#) handling
            menuItem.href = '#';
            menuItem.setAttribute('aria-disabled', 'true');
            menuItem.classList.add('hbqs-popup-item--disabled');
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                logger.warn(
                    'HelpButton.qs popup: "setVariable" menu item clicked but no onSetVariable handler was provided. Label: ' +
                        (item.label || '')
                );
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
            if (itemBgHover) menuItem.style.backgroundColor = itemBgHover;
            if (itemIcon) menuItem.style.borderLeftColor = itemIcon;
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.backgroundColor = itemBg || '';
            menuItem.style.borderLeftColor = 'transparent';
        });

        popup.appendChild(menuItem);
    });

    // Apply popup-level styles (resolve from color-picker objects)
    const popupBorder = resolveColor(popupStyle.borderColor);
    if (popupBorder) popup.style.borderColor = popupBorder;
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
