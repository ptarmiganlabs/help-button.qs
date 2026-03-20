/**
 * Markdown editor dialog for HelpButton.qs.
 *
 * Opens a modal with the shared tabbed Write/Preview Markdown editor.
 * Used by the property-panel "Edit Markdown" buttons so that tooltip
 * authors get a proper editing experience instead of the tiny native
 * textarea.
 */

import { createTabbedMarkdownEditor } from './markdown-toolbar';
import { makeSvg } from './icons';
import logger from '../util/logger';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let activeBackdrop = null;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Open the Markdown editor dialog.
 *
 * @param {object} options
 * @param {string} options.title - Dialog heading.
 * @param {string} options.value - Current Markdown text.
 * @param {number} [options.maxLength] - Max chars (0 = unlimited).
 * @param {function(string): void} options.onSave - Called with the new text on save.
 */
export function openMarkdownEditorDialog({ title, value, maxLength, onSave }) {
    closeMarkdownEditorDialog();

    // -- Backdrop --
    const backdrop = document.createElement('div');
    backdrop.className = 'hbqs-md-editor-backdrop';
    activeBackdrop = backdrop;

    // -- Dialog --
    const dialog = document.createElement('div');
    dialog.className = 'hbqs-md-editor-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', title || 'Markdown Editor');
    dialog.addEventListener('click', (e) => e.stopPropagation());

    // -- Header --
    const header = document.createElement('div');
    header.className = 'hbqs-md-editor-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'hbqs-md-editor-title';
    titleEl.textContent = title || 'Edit Markdown';
    header.appendChild(titleEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'hbqs-md-editor-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = makeSvg('close', 16);
    closeBtn.addEventListener('click', closeMarkdownEditorDialog);
    header.appendChild(closeBtn);

    dialog.appendChild(header);

    // -- Tabbed Markdown editor --
    const { container: editorContainer, textarea } = createTabbedMarkdownEditor({
        value: value || '',
        maxLength: maxLength || 0,
        rows: 16,
    });
    // Give the tabbed editor flex growth inside the dialog
    editorContainer.style.flex = '1';
    editorContainer.style.minHeight = '0';
    editorContainer.style.display = 'flex';
    editorContainer.style.flexDirection = 'column';

    dialog.appendChild(editorContainer);

    // -- Character counter --
    if (maxLength > 0) {
        const counter = document.createElement('div');
        counter.className = 'hbqs-md-editor-counter';
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = remaining + ' / ' + maxLength + ' characters remaining';
            counter.classList.toggle('hbqs-md-editor-counter--exceeded', remaining < 0);
        };
        updateCounter();
        textarea.addEventListener('input', updateCounter);
        dialog.appendChild(counter);
    }

    // -- Footer --
    const footer = document.createElement('div');
    footer.className = 'hbqs-md-editor-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'hbqs-md-editor-btn hbqs-md-editor-btn--cancel';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', closeMarkdownEditorDialog);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'hbqs-md-editor-btn hbqs-md-editor-btn--save';
    saveBtn.type = 'button';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => {
        if (typeof onSave === 'function') {
            onSave(textarea.value);
        }
        closeMarkdownEditorDialog();
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);
    dialog.appendChild(footer);

    // -- Keyboard handler --
    const onKeyDown = (e) => {
        if (e.key === 'Escape') closeMarkdownEditorDialog();
    };
    document.addEventListener('keydown', onKeyDown);
    backdrop._hbqsKeyHandler = onKeyDown;

    // -- Mount --
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
    textarea.focus();

    logger.debug('Markdown editor dialog opened:', title);
}

/**
 * Close the Markdown editor dialog if open.
 */
export function closeMarkdownEditorDialog() {
    if (activeBackdrop) {
        if (activeBackdrop._hbqsKeyHandler) {
            document.removeEventListener('keydown', activeBackdrop._hbqsKeyHandler);
        }
        activeBackdrop.remove();
        activeBackdrop = null;
    }
}
