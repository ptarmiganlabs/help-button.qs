/**
 * Minimal Markdown-to-HTML converter for tooltip and dialog content.
 *
 * Supports:
 *   - **bold** and *italic*
 *   - [links](url)
 *   - ![images](url "optional title")
 *   - `inline code`
 *   - Line breaks (double newline → paragraph, single newline → <br>)
 *   - Unordered lists (- item or * item)
 *   - Ordered lists (1. item)
 *   - Headings (### h3, #### h4 — h1/h2 intentionally omitted for popovers)
 *   - > blockquotes
 *   - --- horizontal rules
 *
 * Intentionally minimal (~60 lines) to keep the bundle small.
 * Ported from Onboard.qs.
 */

/**
 * Convert a Markdown string to HTML.
 *
 * @param {string} md - Markdown source text.
 * @returns {string} HTML string.
 */
export function markdownToHtml(md) {
    if (!md) return '';

    // Normalize line endings
    let text = md.replace(/\r\n?/g, '\n');

    // Escape HTML entities (but preserve already-written HTML tags for power users)
    text = text.replace(/&(?!#?\w+;)/g, '&amp;').replace(/<(?![/a-zA-Z!])/g, '&lt;');

    // Horizontal rules
    text = text.replace(/^(?:[-*_]){3,}\s*$/gm, '<hr>');

    // Headings (h3–h6 only; h1/h2 are too large for popovers)
    text = text.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    text = text.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    text = text.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    text = text.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');

    // Blockquotes (single level)
    text = text.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    text = text.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Unordered lists
    text = text.replace(/(?:^[*-]\s+.+\n?)+/gm, (match) => {
        const items = match
            .trim()
            .split('\n')
            .map((line) => `<li>${line.replace(/^[*-]\s+/, '')}</li>`)
            .join('');
        return `<ul>${items}</ul>`;
    });

    // Ordered lists
    text = text.replace(/(?:^\d+\.\s+.+\n?)+/gm, (match) => {
        const items = match
            .trim()
            .split('\n')
            .map((line) => `<li>${line.replace(/^\d+\.\s+/, '')}</li>`)
            .join('');
        return `<ol>${items}</ol>`;
    });

    // Images: ![alt](src "title")
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, src, title) => {
        const titleAttr = title ? ` title="${title}"` : '';
        return `<img src="${src}" alt="${alt}"${titleAttr} style="max-width:100%;height:auto;" />`;
    });

    // Links: [text](url)
    text = text.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>'
    );

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/(?<![a-zA-Z0-9])_(.+?)_(?![a-zA-Z0-9])/g, '<em>$1</em>');

    // Paragraphs
    text = text.replace(/\n{2,}/g, '</p><p>');

    // Single newlines → <br>
    text = text.replace(/(?<!<\/(?:li|ul|ol|blockquote|h[3-6]|hr|p)>)\n(?!<)/g, '<br>');

    // Wrap in paragraph tags
    text = `<p>${text}</p>`;

    // Clean up empty paragraphs
    text = text.replace(/<p>\s*<\/p>/g, '');

    return text;
}
