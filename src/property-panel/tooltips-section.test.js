// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

// The real logger reads build-time globals that only the bundler defines.
vi.mock('../util/logger', () => ({
    default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { closeMarkdownEditorDialog } from '../ui/markdown-editor-dialog.js';
import { extensionState } from '../util/extension-state.js';
import tooltipsSection from './tooltips-section.js';

const EXPR = "='**' & Name & '**'";

/** Let pending promise callbacks run. */
const flush = () => new Promise((r) => setTimeout(r, 0));

/**
 * The "Edit in Markdown editor" button definitions of the tooltip section.
 *
 * @returns {{ dialog: object, hover: object }} The two button definitions.
 */
function buttons() {
    const items = tooltipsSection(async () => []).items.tooltips.items;
    return {
        dialog: items.dialogSettings.items.dialogMain.items.editDialogContentBtn,
        hover: items.hoverSettings.items.hoverMain.items.editHoverContentBtn,
    };
}

/**
 * Build a fake object model holding one tooltip, plus a fake app whose
 * session objects evaluate every expression to `evaluated`.
 *
 * @param {object} tooltip - The tooltip item stored in the properties.
 * @param {string} [evaluated] - What any expression evaluates to.
 * @returns {{ model: object, app: object, saved: Function }} Fakes and a reader for the last save.
 */
function fakes(tooltip, evaluated = '**World**') {
    let last = null;
    const model = {
        getLayout: vi.fn(async () => ({ security: { allowedUriPatterns: '' } })),
        getProperties: vi.fn(async () => ({ tooltips: [structuredClone(tooltip)] })),
        setProperties: vi.fn(async (props) => {
            last = props;
        }),
    };
    const app = {
        createSessionObject: vi.fn(async () => ({
            id: 'tmp',
            getLayout: async () => ({ value: evaluated }),
        })),
        destroySessionObject: vi.fn(async () => {}),
    };
    return { model, app, saved: () => last?.tooltips[0] };
}

/** The open editor's parts. */
function editor() {
    const dialog = document.querySelector('.hbqs-md-editor-dialog');
    if (!dialog) return null;
    const [, tabPreview] = dialog.querySelectorAll('.hbqs-md-tabbed-tab');
    return {
        textarea: dialog.querySelector('textarea'),
        tabPreview,
        preview: dialog.querySelector('.hbqs-md-tabbed-panel--preview'),
        save: dialog.querySelector('.hbqs-md-editor-btn--save'),
    };
}

afterEach(() => {
    closeMarkdownEditorDialog();
    extensionState.model = null;
    extensionState.app = null;
});

describe('Edit in Markdown editor', () => {
    it('edits, previews and saves expression content with the panel model and app', async () => {
        const tooltip = { cId: 't1', dialogContent: { qStringExpression: { qExpr: EXPR } } };
        const { model, app, saved } = fakes(tooltip);

        // extensionState stays empty, as when the extension has not rendered.
        await buttons().dialog.action(structuredClone(tooltip), undefined, { model, app });

        const ed = editor();
        expect(ed.textarea.value).toBe(EXPR);

        ed.tabPreview.click();
        await flush();
        expect(ed.preview.querySelector('strong')?.textContent).toBe('World');
        expect(app.destroySessionObject).toHaveBeenCalledWith('tmp');

        ed.textarea.value = EXPR + " & '!'";
        ed.save.click();
        await flush();
        expect(saved().dialogContent).toEqual({
            qStringExpression: { qExpr: EXPR + " & '!'" },
        });
    });

    it('keeps plain text plain, even when it starts with =', async () => {
        const tooltip = { cId: 't1', hoverContent: 'Plain' };
        const { model, app, saved } = fakes(tooltip);

        await buttons().hover.action(structuredClone(tooltip), undefined, { model, app });

        const ed = editor();
        expect(ed.textarea.value).toBe('Plain');
        ed.textarea.value = '=Plain';
        ed.save.click();
        await flush();
        expect(saved().hoverContent).toBe('=Plain');
        expect(app.createSessionObject).not.toHaveBeenCalled();
    });

    it('falls back to extensionState when the panel passes no arguments', async () => {
        const tooltip = { cId: 't1', dialogContent: 'Text' };
        const { model, saved } = fakes(tooltip);
        extensionState.model = model;

        await buttons().dialog.action(structuredClone(tooltip));

        const ed = editor();
        ed.textarea.value = 'Text, edited';
        ed.save.click();
        await flush();
        expect(saved().dialogContent).toBe('Text, edited');
    });

    it('does not open the editor for a value of unknown shape', async () => {
        const tooltip = { cId: 't1', dialogContent: { qValueExpression: { qExpr: '=1' } } };
        const { model, app } = fakes(tooltip);

        await buttons().dialog.action(structuredClone(tooltip), undefined, { model, app });

        expect(editor()).toBeNull();
    });
});
