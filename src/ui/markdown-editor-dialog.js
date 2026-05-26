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
// Unsaved-changes confirmation
// ---------------------------------------------------------------------------

/**
 * Show an inline confirmation dialog asking whether to discard unsaved changes.
 * Returns a Promise that resolves to `true` (discard) or `false` (stay).
 *
 * @returns {Promise<boolean>}
 */
function confirmDiscardChanges() {
    return new Promise((resolve) => {
        // Prevent stacking – keep focus inside the existing confirmation
        const existing = document.querySelector('.hbqs-md-confirm-backdrop');
        if (existing) {
            const existingKeepBtn = existing.querySelector('.hbqs-md-confirm-btn--keep');
            if (existingKeepBtn) existingKeepBtn.focus();
            resolve(false);
            return;
        }

        const backdrop = document.createElement('div');
        backdrop.className = 'hbqs-md-confirm-backdrop';

        const box = document.createElement('div');
        box.className = 'hbqs-md-confirm-dialog';
        box.setAttribute('role', 'alertdialog');
        box.setAttribute('aria-modal', 'true');
        box.setAttribute('aria-label', 'Unsaved changes');
        box.addEventListener('click', (e) => e.stopPropagation());

        const msg = document.createElement('p');
        msg.className = 'hbqs-md-confirm-msg';
        msg.textContent = 'You have unsaved changes. Are you sure you want to discard them?';
        box.appendChild(msg);

        const actions = document.createElement('div');
        actions.className = 'hbqs-md-confirm-actions';

        const keepBtn = document.createElement('button');
        keepBtn.className = 'hbqs-md-editor-btn hbqs-md-editor-btn--cancel';
        keepBtn.type = 'button';
        keepBtn.textContent = 'Keep editing';

        const discardBtn = document.createElement('button');
        discardBtn.className = 'hbqs-md-editor-btn hbqs-md-editor-btn--discard';
        discardBtn.type = 'button';
        discardBtn.textContent = 'Discard changes';

        actions.appendChild(keepBtn);
        actions.appendChild(discardBtn);
        box.appendChild(actions);
        backdrop.appendChild(box);
        document.body.appendChild(backdrop);

        const cleanup = (result) => {
            document.removeEventListener('keydown', onKey, true);
            backdrop.remove();
            resolve(result);
        };

        keepBtn.addEventListener('click', () => cleanup(false));
        discardBtn.addEventListener('click', () => cleanup(true));
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) cleanup(false);
        });

        // Capture-phase handler so the confirmation Escape is consumed
        // before the editor's own keydown listener fires.
        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                cleanup(false);
            }
        };
        document.addEventListener('keydown', onKey, true);

        // Focus the safe option to prevent accidental data loss
        keepBtn.focus();
    });
}

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
 * @param {string} [options.allowedUriPatterns=''] - Comma-separated URL prefixes
 *   for allowed iframe/video src in Preview. Empty = allow all.
 * @param {function(string): void} options.onSave - Called with the new text on save.
 */
export function openMarkdownEditorDialog({ title, value, maxLength, allowedUriPatterns, onSave }) {
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
    header.appendChild(closeBtn);

    dialog.appendChild(header);

    // -- Tabbed Markdown editor --
    const { container: editorContainer, textarea } = createTabbedMarkdownEditor({
        value: value || '',
        maxLength: maxLength || 0,
        rows: 16,
        allowedUriPatterns: allowedUriPatterns || '',
    });

    // Capture baseline from the actual textarea after creation so that any
    // normalisation performed by createTabbedMarkdownEditor is accounted for.
    const initialValue = textarea.value;
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

    // -- Dirty check helper --
    const hasPendingChanges = () => textarea.value !== initialValue;

    /**
     * Attempt to close the editor dialog.
     * If there are unsaved changes, show a confirmation dialog first.
     */
    const guardedClose = async () => {
        if (hasPendingChanges()) {
            const discard = await confirmDiscardChanges();
            if (!discard) {
                // Only refocus the textarea when no confirmation overlay is
                // still visible (it keeps focus on its own "Keep editing" btn).
                if (!document.querySelector('.hbqs-md-confirm-backdrop')) {
                    textarea.focus();
                }
                return;
            }
        }
        closeMarkdownEditorDialog();
    };

    // -- Wire up close button to guarded close --
    closeBtn.addEventListener('click', guardedClose);

    // -- Footer --
    const footer = document.createElement('div');
    footer.className = 'hbqs-md-editor-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'hbqs-md-editor-btn hbqs-md-editor-btn--cancel';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', guardedClose);

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
        if (e.key === 'Escape') {
            e.preventDefault();
            guardedClose();
        }
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
