/**
 * Tooltip detail dialog for HelpButton.qs.
 *
 * Opens a modal overlay when the user clicks a tooltip icon.
 * Content is rendered from Markdown. Closes on backdrop click,
 * Escape key, or close button.
 */

import { markdownToHtml } from '../util/markdown';
import { makeSvg } from './icons';
import logger from '../util/logger';

/**
 * Size presets — CSS class suffix → dimensions applied via CSS.
 *
 * @type {Record<string, string>}
 */
const SIZE_CLASSES = {
    small: 'hbqs-tooltip-dialog--small',
    medium: 'hbqs-tooltip-dialog--medium',
    large: 'hbqs-tooltip-dialog--large',
    'x-large': 'hbqs-tooltip-dialog--x-large',
};

/**
 * Open the tooltip detail dialog.
 *
 * @param {object} options
 * @param {string} options.title - Dialog heading.
 * @param {string} options.content - Markdown content for the body.
 * @param {string} [options.size='medium'] - Size preset.
 */
export function openTooltipDialog({ title, content, size, headerBackgroundColor, headerTextColor, bodyBackgroundColor, bodyTextColor }) {
    // Remove any existing dialog
    closeTooltipDialog();

    const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.medium;

    // -- Backdrop --
    const backdrop = document.createElement('div');
    backdrop.className = 'hbqs-tooltip-dialog-backdrop';
    backdrop.addEventListener('click', closeTooltipDialog);

    // -- Dialog --
    const dialog = document.createElement('div');
    dialog.className = `hbqs-tooltip-dialog ${sizeClass}`;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', title || 'Tooltip details');

    // Prevent backdrop clicks from closing when clicking inside dialog
    dialog.addEventListener('click', (e) => e.stopPropagation());

    // -- Header --
    const header = document.createElement('div');
    header.className = 'hbqs-tooltip-dialog__header';
    if (headerBackgroundColor) header.style.background = headerBackgroundColor;

    const titleEl = document.createElement('h3');
    titleEl.className = 'hbqs-tooltip-dialog__title';
    titleEl.textContent = title || '';
    if (headerTextColor) titleEl.style.color = headerTextColor;
    header.appendChild(titleEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'hbqs-tooltip-dialog__close';
    closeBtn.setAttribute('aria-label', 'Close');
    if (headerTextColor) closeBtn.style.color = headerTextColor;
    closeBtn.innerHTML = makeSvg('close', 16);
    closeBtn.addEventListener('click', closeTooltipDialog);
    header.appendChild(closeBtn);

    dialog.appendChild(header);

    // -- Body --
    const body = document.createElement('div');
    body.className = 'hbqs-tooltip-dialog__body hbqs-markdown-content';
    body.innerHTML = markdownToHtml(content || '');
    if (bodyBackgroundColor) body.style.background = bodyBackgroundColor;
    if (bodyTextColor) body.style.color = bodyTextColor;
    dialog.appendChild(body);

    // -- Keyboard handler --
    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeTooltipDialog();
        }
    };
    document.addEventListener('keydown', onKeyDown);
    backdrop.dataset.hbqsKeyHandler = 'true';
    // Store handler reference for cleanup
    backdrop._hbqsKeyHandler = onKeyDown;

    // -- Mount --
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    // Focus close button for accessibility
    closeBtn.focus();

    logger.debug('Tooltip dialog opened:', title);
}

/**
 * Close the tooltip detail dialog if open.
 */
export function closeTooltipDialog() {
    const backdrop = document.querySelector('.hbqs-tooltip-dialog-backdrop');
    if (backdrop) {
        if (backdrop._hbqsKeyHandler) {
            document.removeEventListener('keydown', backdrop._hbqsKeyHandler);
        }
        backdrop.remove();
    }
}
