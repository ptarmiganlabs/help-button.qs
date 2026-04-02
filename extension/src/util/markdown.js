/**
 * Minimal Markdown-to-HTML converter for tooltip and dialog content.
 *
 * Supports:
 *   - **bold** and *italic*
 *   - [links](url)
 *   - ![images](url "optional title")
 *   - @[videos](url) — YouTube / Vimeo iframes, or .mp4/.webm/.ogg <video>
 *   - Raw HTML (e.g. <iframe>, <video>) — passed through and sanitized by DOMPurify
 *   - `inline code`
 *   - Line breaks (double newline → paragraph, single newline → <br>)
 *   - Unordered lists (- item or * item)
 *   - Ordered lists (1. item)
 *   - Headings (### h3, #### h4 — h1/h2 intentionally omitted for popovers)
 *   - > blockquotes
 *   - --- horizontal rules
 *
 * Intentionally minimal to keep the bundle small.
 * Ported from Onboard.qs.
 */

import DOMPurify from 'dompurify';

// ---------------------------------------------------------------------------
// Video embed helpers
// ---------------------------------------------------------------------------

/** Pattern for the video embed syntax: @[title](url) */
const VIDEO_RE = /@\[([^\]]*)\]\(([^)]+)\)/g;

/**
 * Extract a YouTube video ID from a URL.
 *
 * Handles youtube.com/watch?v=ID, youtu.be/ID, and youtube.com/embed/ID.
 *
 * @param {string} url
 * @returns {string|null} Video ID or null.
 */
function youtubeId(url) {
    const m = url.match(
        /(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([\w-]{11})/i
    );
    return m ? m[1] : null;
}

/**
 * Extract a Vimeo video ID from a URL.
 *
 * Handles vimeo.com/ID and player.vimeo.com/video/ID.
 *
 * @param {string} url
 * @returns {string|null} Video ID or null.
 */
function vimeoId(url) {
    const m = url.match(
        /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i
    );
    return m ? m[1] : null;
}

/** File extensions recognised as direct video sources. */
const VIDEO_EXT_RE = /\.(?:mp4|webm|ogg)(?:\?[^)]*)?$/i;

/**
 * Build a responsive iframe wrapper for a video embed URL.
 *
 * @param {string} embedUrl - The iframe src URL.
 * @param {string} title    - Accessible title for the iframe.
 * @returns {string} HTML string.
 */
function iframeHtml(embedUrl, title) {
    const safeUrl = embedUrl.replace(/"/g, '&quot;');
    const safeTitle = title.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return (
        '<div class="hbqs-video-wrapper">' +
        '<iframe src="' + safeUrl + '"' +
        ' title="' + safeTitle + '"' +
        ' frameborder="0"' +
        ' allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
        ' allowfullscreen' +
        '></iframe></div>'
    );
}

/**
 * Build a responsive <video> element for direct video file URLs.
 *
 * @param {string} src   - Direct URL to a video file.
 * @param {string} title - Accessible label.
 * @returns {string} HTML string.
 */
function videoTagHtml(src, title) {
    const safeSrc = src.replace(/"/g, '&quot;');
    const safeTitle = title.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return (
        '<div class="hbqs-video-wrapper hbqs-video-wrapper--native">' +
        '<video controls preload="metadata" title="' + safeTitle + '">' +
        '<source src="' + safeSrc + '">' +
        '</video></div>'
    );
}

// ---------------------------------------------------------------------------
// URI filter
// ---------------------------------------------------------------------------

/**
 * Remove iframe, video, and source elements whose src does not match any
 * of the allowed URI prefixes.
 *
 * @param {string} html - Sanitized HTML string.
 * @param {string} [allowedUriPatterns] - Comma-separated URL prefixes.
 *   Empty or omitted = allow all.
 * @returns {string} HTML with non-matching media elements removed.
 */
function filterMediaUris(html, allowedUriPatterns) {
    if (!allowedUriPatterns) return html;

    const prefixes = allowedUriPatterns
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    if (prefixes.length === 0) return html;

    const container = document.createElement('div');
    container.innerHTML = html;

    container.querySelectorAll('iframe, video, source').forEach((el) => {
        const src = el.getAttribute('src') || '';
        const allowed = prefixes.some((prefix) => src.startsWith(prefix));
        if (!allowed) {
            el.remove();
        }
    });

    // Clean up video elements that lost all their source children
    container.querySelectorAll('video').forEach((video) => {
        if (!video.querySelector('source') && !video.getAttribute('src')) {
            video.remove();
        }
    });

    return container.innerHTML;
}

// ---------------------------------------------------------------------------
// Main converter
// ---------------------------------------------------------------------------

/**
 * Convert a Markdown string to HTML.
 *
 * Raw HTML tags in the input are preserved and passed through DOMPurify
 * sanitization, so authors can embed `<iframe>` and `<video>` blocks directly.
 * The `@[title](url)` shorthand is also supported and generates iframes
 * automatically for YouTube/Vimeo URLs.
 *
 * @param {string} md - Markdown source text.
 * @param {object} [options] - Conversion options.
 * @param {string} [options.allowedUriPatterns] - Comma-separated URL prefixes
 *   for allowed iframe/video/source src attributes. Empty string = allow all.
 * @returns {string} Sanitized HTML string.
 */
export function markdownToHtml(md, options) {
    if (!md) return '';

    // Normalize line endings
    let text = md.replace(/\r\n?/g, '\n');

    // -------------------------------------------------------------------
    // Video embeds: @[title](url)
    // Processed BEFORE the HTML-escape pass so that the generated tags
    // survive.  Only allow-listed sources produce output.
    // -------------------------------------------------------------------
    text = text.replace(VIDEO_RE, (_, title, url) => {
        if (!/^https:\/\//i.test(url)) return '';

        const label = title || 'Video';
        const ytId = youtubeId(url);
        if (ytId) return iframeHtml('https://www.youtube.com/embed/' + ytId, label);

        const vmId = vimeoId(url);
        if (vmId) return iframeHtml('https://player.vimeo.com/video/' + vmId, label);

        if (VIDEO_EXT_RE.test(url)) return videoTagHtml(url, label);

        // Unknown host — ignore for security
        return '';
    });

    // -------------------------------------------------------------------
    // Partial HTML escape: preserve existing HTML tags (raw <iframe>,
    // <video>, etc.) while still protecting bare & and stray < that are
    // not part of a tag.  DOMPurify sanitizes the final output.
    // -------------------------------------------------------------------
    text = text.replace(/&(?!#?\w+;)/g, '&amp;').replace(/<(?![/a-zA-Z!])/g, '&lt;');

    // Collapse multi-line HTML tags so that the <br> pass later does not
    // inject <br> inside opening tags and break them.
    text = text.replace(/<[a-zA-Z][^>]*\n[^>]*>/g, (match) => match.replace(/\n\s*/g, ' '));

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
        if (!/^https?:\/\//i.test(src)) return '';
        const safeAlt = alt.replace(/"/g, '&quot;');
        const safeSrc = src.replace(/"/g, '&quot;');
        const titleAttr = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
        return `<img src="${safeSrc}" alt="${safeAlt}"${titleAttr} style="max-width:100%;height:auto;" />`;
    });

    // Links: [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, linkText, url) => {
        if (!/^https?:\/\/|^mailto:/i.test(url)) return linkText;
        const safeUrl = url.replace(/"/g, '&quot;');
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    });

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/(^|[^a-zA-Z0-9])_(.+?)_(?![a-zA-Z0-9])/g, '$1<em>$2</em>');

    // Paragraphs
    text = text.replace(/\n{2,}/g, '</p><p>');

    // Single newlines → <br> (skip newlines after block-level tags)
    text = text.replace(/\n(?!<)/g, (match, offset, str) => {
        const before = str.slice(0, offset);
        if (/<\/(?:li|ul|ol|blockquote|h[3-6]|p|div)>$/.test(before) || /<hr>$/.test(before)) {
            return '\n';
        }
        return '<br>';
    });

    // Wrap in paragraph tags
    text = `<p>${text}</p>`;

    // Strip <p> wrappers around block-level elements (invalid nesting)
    text = text.replace(/<p>\s*(<(?:ul|ol|blockquote|h[3-6]|hr|div)[\s>])/g, '$1');
    text = text.replace(/(<\/(?:ul|ol|blockquote|h[3-6]|div)>|<hr>)\s*<\/p>/g, '$1');

    // Clean up empty paragraphs
    text = text.replace(/<p>\s*<\/p>/g, '');

    // Sanitize with DOMPurify — allows <iframe>, <video>, <source> and their
    // relevant attributes on top of the default safe-HTML allowlist.
    const sanitized = DOMPurify.sanitize(text.trim(), {
        ADD_TAGS: ['iframe', 'video', 'source'],
        ADD_ATTR: [
            'target',
            'rel',
            'style',
            'frameborder',
            'controls',
            'autoplay',
            'muted',
            'loop',
            'poster',
            'preload',
            'playsinline',
            'allowfullscreen',
            'allow',
            'loading',
            'referrerpolicy',
        ],
    });

    return filterMediaUris(sanitized, options?.allowedUriPatterns);
}
