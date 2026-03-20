/**
 * Markdown tabbed editor component for HelpButton.qs.
 *
 * Creates a GitHub-style Write/Preview tabbed UI with a formatting toolbar.
 * Reused by bug-report dialogs, feedback dialogs, and the Markdown editor
 * dialog so that all Markdown editing surfaces share a consistent UX.
 *
 * Usage:
 *   const { container, textarea } = createTabbedMarkdownEditor({ ... });
 *   parentEl.appendChild(container);
 *
 * @module ui/markdown-toolbar
 */

import { markdownToHtml } from '../util/markdown';
import { attachMarkdownShortcuts } from '../util/markdown-shortcuts';

// ---------------------------------------------------------------------------
// Toolbar button definitions
// ---------------------------------------------------------------------------

const TOOLBAR_BUTTONS = [
    { label: 'B', title: 'Bold (Cmd/Ctrl+B)', action: 'bold', style: 'font-weight:700' },
    { label: 'I', title: 'Italic (Cmd/Ctrl+I)', action: 'italic', style: 'font-style:italic' },
    { label: '<>', title: 'Code (Cmd/Ctrl+E)', action: 'code', style: 'font-family:monospace;font-size:11px' },
    { label: '🔗', title: 'Link (Cmd/Ctrl+K)', action: 'link' },
    { type: 'separator' },
    { label: 'H3', title: 'Heading 3', action: 'h3', style: 'font-size:11px;font-weight:700' },
    { label: 'H4', title: 'Heading 4', action: 'h4', style: 'font-size:11px;font-weight:600' },
    { type: 'separator' },
    { label: '•', title: 'Bullet list', action: 'ul' },
    { label: '1.', title: 'Numbered list', action: 'ol', style: 'font-size:11px' },
    { label: '❝', title: 'Blockquote', action: 'blockquote' },
    { type: 'separator' },
    { label: '—', title: 'Horizontal rule', action: 'hr' },
];

// ---------------------------------------------------------------------------
// Action dispatcher
// ---------------------------------------------------------------------------

function applyAction(textarea, action) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selected = value.slice(start, end);

    const wrap = (before, after, placeholder) => {
        const inner = selected || placeholder || '';
        const replacement = before + inner + after;
        textarea.value = value.slice(0, start) + replacement + value.slice(end);
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + inner.length;
        textarea.focus();
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const linePrefix = (prefix) => {
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = value.indexOf('\n', end);
        if (lineEnd === -1) lineEnd = value.length;

        const block = value.slice(lineStart, lineEnd);
        const lines = block.split('\n');
        const isOl = prefix === 'ol';
        const olPat = /^\d+\.\s/;

        const allPrefixed = lines.every(l => isOl ? olPat.test(l) : l.startsWith(prefix));
        let replaced;
        if (allPrefixed) {
            replaced = lines.map(l => isOl ? l.replace(olPat, '') : l.slice(prefix.length)).join('\n');
        } else {
            replaced = lines.map((l, i) => {
                if (isOl) return olPat.test(l) ? l : (i + 1) + '. ' + l;
                return l.startsWith(prefix) ? l : prefix + l;
            }).join('\n');
        }
        textarea.value = value.slice(0, lineStart) + replaced + value.slice(lineEnd);
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart + replaced.length;
        textarea.focus();
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    };

    switch (action) {
        case 'bold':       wrap('**', '**', 'bold'); break;
        case 'italic':     wrap('*', '*', 'italic'); break;
        case 'code':       wrap('`', '`', 'code'); break;
        case 'link': {
            if (selected) {
                const rep = '[' + selected + '](url)';
                textarea.value = value.slice(0, start) + rep + value.slice(end);
                const urlStart = start + selected.length + 3;
                textarea.selectionStart = urlStart;
                textarea.selectionEnd = urlStart + 3;
            } else {
                const rep = '[text](url)';
                textarea.value = value.slice(0, start) + rep + value.slice(end);
                textarea.selectionStart = start + 1;
                textarea.selectionEnd = start + 5;
            }
            textarea.focus();
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            break;
        }
        case 'h3':         wrap('### ', '', 'heading'); break;
        case 'h4':         wrap('#### ', '', 'heading'); break;
        case 'ul':         linePrefix('- '); break;
        case 'ol':         linePrefix('ol'); break;
        case 'blockquote': linePrefix('> '); break;
        case 'hr': {
            const before = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
            const rule = '---\n';
            textarea.value = value.slice(0, start) + before + rule + value.slice(end);
            textarea.selectionStart = textarea.selectionEnd = start + before.length + rule.length;
            textarea.focus();
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            break;
        }
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a tabbed Markdown editor component (Write / Preview tabs).
 *
 * Returns a container element plus a reference to the textarea so
 * callers can read `.value` or listen for events.
 *
 * @param {object} options
 * @param {string} [options.id]          - HTML id for the textarea.
 * @param {string} [options.placeholder] - Textarea placeholder text.
 * @param {number} [options.rows=4]      - Textarea rows.
 * @param {number} [options.maxLength=0] - Max characters (0 = unlimited).
 * @param {string} [options.value='']    - Initial Markdown text.
 * @param {string} [options.className=''] - Extra CSS class for the textarea.
 * @returns {{ container: HTMLElement, textarea: HTMLTextAreaElement }}
 */
export function createTabbedMarkdownEditor({
    id,
    placeholder,
    rows = 4,
    maxLength = 0,
    value = '',
    className = '',
} = {}) {
    // -- Outer container --
    const container = document.createElement('div');
    container.className = 'hbqs-md-tabbed';

    // -- Tab bar (Write | Preview) + toolbar buttons --
    const tabBar = document.createElement('div');
    tabBar.className = 'hbqs-md-tabbed-header';

    const tabWrite = document.createElement('button');
    tabWrite.type = 'button';
    tabWrite.className = 'hbqs-md-tabbed-tab hbqs-md-tabbed-tab--active';
    tabWrite.textContent = 'Write';

    const tabPreview = document.createElement('button');
    tabPreview.type = 'button';
    tabPreview.className = 'hbqs-md-tabbed-tab';
    tabPreview.textContent = 'Preview';

    tabBar.appendChild(tabWrite);
    tabBar.appendChild(tabPreview);

    // Toolbar buttons (visible only on Write tab)
    const toolbarGroup = document.createElement('span');
    toolbarGroup.className = 'hbqs-md-tabbed-toolbar';

    // -- Body panels --
    const writePanel = document.createElement('div');
    writePanel.className = 'hbqs-md-tabbed-panel hbqs-md-tabbed-panel--write';

    const textarea = document.createElement('textarea');
    textarea.className = 'hbqs-md-tabbed-textarea' + (className ? ' ' + className : '');
    if (id) textarea.id = id;
    if (placeholder) textarea.placeholder = placeholder;
    textarea.rows = rows;
    textarea.value = value;
    textarea.spellcheck = true;
    if (maxLength > 0) textarea.maxLength = maxLength;
    writePanel.appendChild(textarea);

    const previewPanel = document.createElement('div');
    previewPanel.className = 'hbqs-md-tabbed-panel hbqs-md-tabbed-panel--preview hbqs-markdown-content';
    previewPanel.style.display = 'none';

    function updatePreview() {
        previewPanel.innerHTML = markdownToHtml(textarea.value)
            || '<p style="color:#9ca3af;font-style:italic">Nothing to preview</p>';
    }

    // Wire toolbar buttons
    for (const def of TOOLBAR_BUTTONS) {
        if (def.type === 'separator') {
            const sep = document.createElement('span');
            sep.className = 'hbqs-md-tabbed-toolbar-sep';
            toolbarGroup.appendChild(sep);
            continue;
        }
        const btn = document.createElement('button');
        btn.className = 'hbqs-md-tabbed-toolbar-btn';
        btn.type = 'button';
        btn.title = def.title;
        btn.textContent = def.label;
        if (def.style) btn.style.cssText = def.style;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            applyAction(textarea, def.action);
        });
        toolbarGroup.appendChild(btn);
    }

    tabBar.appendChild(toolbarGroup);

    // -- Tab switching --
    tabWrite.addEventListener('click', () => {
        tabWrite.classList.add('hbqs-md-tabbed-tab--active');
        tabPreview.classList.remove('hbqs-md-tabbed-tab--active');
        writePanel.style.display = '';
        previewPanel.style.display = 'none';
        toolbarGroup.style.visibility = '';
        textarea.focus();
    });

    tabPreview.addEventListener('click', () => {
        tabPreview.classList.add('hbqs-md-tabbed-tab--active');
        tabWrite.classList.remove('hbqs-md-tabbed-tab--active');
        writePanel.style.display = 'none';
        previewPanel.style.display = '';
        toolbarGroup.style.visibility = 'hidden';
        updatePreview();
    });

    // Keyboard shortcuts
    attachMarkdownShortcuts(textarea);

    // Assemble
    container.appendChild(tabBar);
    container.appendChild(writePanel);
    container.appendChild(previewPanel);

    return { container, textarea };
}
