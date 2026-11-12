// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import { markdownToHtml } from '../util/markdown.js';
import { createTabbedMarkdownEditor } from './markdown-toolbar.js';

/**
 * Create an editor and return handles to its tabs and preview panel.
 *
 * @param {object} options - Options for createTabbedMarkdownEditor.
 * @returns {object} The textarea, both tabs and the preview panel.
 */
function setup(options) {
    const { container, textarea } = createTabbedMarkdownEditor(options);
    const [tabWrite, tabPreview] = container.querySelectorAll('.hbqs-md-tabbed-tab');
    const preview = container.querySelector('.hbqs-md-tabbed-panel--preview');
    return { textarea, tabWrite, tabPreview, preview };
}

/**
 * A promise with its resolve and reject functions exposed.
 *
 * @returns {{ promise: Promise, resolve: Function, reject: Function }}
 */
function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

/** Let pending promise callbacks run. */
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('createTabbedMarkdownEditor preview', () => {
    it('renders the textarea text at once when there is no resolver', () => {
        const { tabPreview, preview } = setup({ value: '**bold**' });

        tabPreview.click();

        expect(preview.innerHTML).toBe(markdownToHtml('**bold**', { allowedUriPatterns: '' }));
    });

    it('renders the resolved Markdown when a resolver is given', async () => {
        const seen = [];
        const { tabPreview, preview } = setup({
            value: "='**' & Name & '**'",
            resolvePreviewSource: async (text) => {
                seen.push(text);
                return '**World**';
            },
        });

        tabPreview.click();
        expect(preview.textContent).toBe('Evaluating expression…');

        await flush();
        expect(seen).toEqual(["='**' & Name & '**'"]);
        expect(preview.querySelector('strong')?.textContent).toBe('World');
    });

    it('ignores a result that arrives after a newer request', async () => {
        const calls = [];
        const { tabWrite, tabPreview, preview } = setup({
            value: '=1',
            resolvePreviewSource: () => {
                const d = deferred();
                calls.push(d);
                return d.promise;
            },
        });

        tabPreview.click();
        tabWrite.click();
        tabPreview.click();

        calls[1].resolve('newer');
        await flush();
        calls[0].resolve('older');
        await flush();

        expect(preview.textContent.trim()).toBe('newer');
    });

    it('ignores a result that arrives after switching back to Write', async () => {
        const d = deferred();
        const { tabWrite, tabPreview, preview } = setup({
            value: '=1',
            resolvePreviewSource: () => d.promise,
        });

        tabPreview.click();
        tabWrite.click();
        d.resolve('late');
        await flush();

        expect(preview.textContent).toBe('Evaluating expression…');
    });

    it('shows the error as text when the resolver fails', async () => {
        const { tabPreview, preview } = setup({
            value: '=1',
            resolvePreviewSource: async () => {
                throw new Error('<img src=x onerror=alert(1)>');
            },
        });

        tabPreview.click();
        await flush();

        expect(preview.querySelector('img')).toBeNull();
        expect(preview.textContent).toBe(
            'Could not evaluate the expression: <img src=x onerror=alert(1)>'
        );
    });
});
