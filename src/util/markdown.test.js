// @vitest-environment jsdom

import DOMPurify from 'dompurify';
import { describe, expect, it } from 'vitest';

import { markdownToHtml } from './markdown.js';

/** The URI filter that a help button set up for YouTube only would use. */
const YOUTUBE_ONLY = { allowedUriPatterns: 'https://www.youtube.com/embed/' };

/** Run each code span test without a URI filter and with one. */
const FILTERS = [
    ['without a URI filter', undefined],
    ['with a YouTube URI filter', YOUTUBE_ONLY],
];

/**
 * Convert Markdown to HTML and parse the result, so a test can query it.
 *
 * @param {string} md - Markdown source text.
 * @param {object} [options] - Options for markdownToHtml().
 * @returns {{ html: string, root: HTMLDivElement }} The HTML, and a <div> that holds it.
 */
function render(md, options) {
    const html = markdownToHtml(md, options);
    const root = document.createElement('div');
    root.innerHTML = html;
    return { html, root };
}

/**
 * The text of each <code> element in the result.
 *
 * @param {HTMLElement} root
 * @returns {string[]}
 */
function codeTexts(root) {
    return [...root.querySelectorAll('code')].map((el) => el.textContent);
}

describe('test environment', () => {
    it('runs DOMPurify, so the tests check sanitized HTML', () => {
        expect(DOMPurify.isSupported).toBe(true);

        const { root } = render('<img src=x onerror=alert(1)>');
        const img = root.querySelector('img');
        expect(img).not.toBeNull();
        expect(img.hasAttribute('onerror')).toBe(false);
    });
});

describe.each(FILTERS)('code spans %s', (_, options) => {
    it.each([
        "Sum({<Region={'North'}>} Sales)",
        '{$<Year={2025}, Month=>}',
        'Count({<Sales={">0"}>} DISTINCT OrderID)',
        'Customer: <name>',
        "Sum({< Region={'North'} >} Sales)",
        'a & b',
        '**x**',
        '&amp;',
    ])('shows `%s` exactly as written', (code) => {
        const { root } = render('`' + code + '`', options);
        const elements = root.querySelectorAll('code');
        expect(elements).toHaveLength(1);
        expect(elements[0].textContent).toBe(code);
        expect(elements[0].children).toHaveLength(0);
        expect(root.textContent).toBe(code);
    });

    it('escapes & in a code span once', () => {
        expect(markdownToHtml('`a & b`', options)).toBe('<p><code>a &amp; b</code></p>');
    });

    it('keeps two code spans apart, with no Markdown inside them', () => {
        const { root } = render('`a_b_c` and `**x**`', options);
        expect(codeTexts(root)).toEqual(['a_b_c', '**x**']);
        expect(root.querySelector('em, strong')).toBeNull();
    });
});

describe('raw HTML and video embeds outside code', () => {
    it.each(FILTERS)('keeps the src of a raw YouTube iframe %s', (_, options) => {
        const { root } = render(
            '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>',
            options
        );
        const iframe = root.querySelector('iframe');
        expect(iframe).not.toBeNull();
        expect(iframe.getAttribute('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
        expect(iframe.hasAttribute('allowfullscreen')).toBe(true);
    });

    // Only without a URI filter: filterMediaUris() has a separate, known bug
    // with <video> when an allowlist is set.
    it('keeps the source of a raw video', () => {
        const { root } = render(
            '<video controls><source src="https://example.com/demo.mp4"></video>'
        );
        const source = root.querySelector('video > source');
        expect(source).not.toBeNull();
        expect(source.getAttribute('src')).toBe('https://example.com/demo.mp4');
    });

    it.each(FILTERS)('turns a YouTube shorthand into an iframe %s', (_, options) => {
        const { root } = render('@[Demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)', options);
        expect(
            root.querySelector(
                '.hbqs-video-wrapper > iframe[src="https://www.youtube.com/embed/dQw4w9WgXcQ"]'
            )
        ).not.toBeNull();
    });

    it('turns a Vimeo shorthand into an iframe', () => {
        const { root } = render('@[Demo](https://vimeo.com/76979871)');
        expect(
            root.querySelector(
                '.hbqs-video-wrapper > iframe[src="https://player.vimeo.com/video/76979871"]'
            )
        ).not.toBeNull();
    });

    it('turns an .mp4 shorthand into a video', () => {
        const { root } = render('@[Clip](https://example.com/demo.mp4)');
        expect(
            root.querySelector(
                '.hbqs-video-wrapper--native > video > source[src="https://example.com/demo.mp4"]'
            )
        ).not.toBeNull();
    });
});

describe('edge cases', () => {
    it('keeps **x** in a code span as written, not bold', () => {
        expect(markdownToHtml('`**x**`')).toBe('<p><code>**x**</code></p>');
    });

    it('shows &amp; in a code span as written', () => {
        const { root } = render('`&amp;`');
        expect(codeTexts(root)).toEqual(['&amp;']);
    });

    it('shows a video shorthand in a code span as text, with no iframe', () => {
        const shorthand = '@[Demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)';
        const { root } = render('`' + shorthand + '`');
        expect(codeTexts(root)).toEqual([shorthand]);
        expect(root.querySelector('iframe')).toBeNull();
    });

    it('does not let a stray backtick in a list item swallow the next item', () => {
        const { root } = render('- one `two\n- three`\n- four');
        const items = [...root.querySelectorAll('ul > li')].map((li) => li.textContent);
        expect(items).toEqual(['one `two', 'three`', 'four']);
        expect(root.querySelector('code')).toBeNull();
    });

    it('does not let a code span go over a blank line', () => {
        expect(markdownToHtml('`a\n\nb`')).toBe('<p>`a</p><p>b`</p>');
    });

    it('does not end a code span at a line with only spaces', () => {
        const code = 'Sum({<A={1}>}\n   \nB)';
        const { root } = render('`' + code + '`');
        expect(codeTexts(root)).toEqual([code]);
    });
});

describe('code spans inside attributes', () => {
    it("keeps a code span in an image's alt text as written", () => {
        const { root } = render('![Use `Sum(x)`](https://example.com/a.png)');
        expect(root.querySelector('img').getAttribute('alt')).toBe('Use `Sum(x)`');
        expect(root.querySelector('code')).toBeNull();
    });

    it("keeps a code span in a video's title as written", () => {
        const { root } = render('@[See `x`](https://www.youtube.com/watch?v=dQw4w9WgXcQ)');
        expect(root.querySelector('iframe').getAttribute('title')).toBe('See `x`');
        expect(root.querySelector('code')).toBeNull();
    });

    it('keeps a code span in a raw title attribute as written', () => {
        const { root } = render('<span title="`a<b>`">t</span>');
        expect(root.querySelector('span').getAttribute('title')).toBe('`a<b>`');
        expect(root.querySelector('code')).toBeNull();
    });

    it.each([
        ['an image', '`y` and ![Use `Sum(x)`](https://example.com/a.png)', 'img', 'alt'],
        [
            'a video',
            '`y` and @[See `x`](https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
            'iframe',
            'title',
        ],
        ['a raw tag', '`y` and <span title="`a<b>`">t</span>', 'span', 'title'],
    ])('still makes <code> from a code span in text next to %s', (_, md, tag, attr) => {
        const { root } = render(md);
        expect(codeTexts(root)).toEqual(['y']);
        expect(root.querySelector(tag).getAttribute(attr)).toContain('`');
    });
});

describe('line breaks next to code spans', () => {
    it('still turns a single line break into <br>', () => {
        expect(markdownToHtml('a\nb')).toBe('<p>a<br>b</p>');
    });

    it('adds no <br> before a line that starts with a code span', () => {
        expect(markdownToHtml('Formula:\n`Sum(Sales)`')).toBe(
            '<p>Formula:\n<code>Sum(Sales)</code></p>'
        );
    });

    it('adds no <br> between an iframe and a code span on the next line', () => {
        const { html, root } = render(
            '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>\n`x`'
        );
        expect(html).toContain('</iframe>\n<code>x</code>');
        expect(root.querySelector('br')).toBeNull();
    });
});

describe('video titles with special characters', () => {
    // The title must come out as the same sanitized HTML as before code spans
    // were taken out first.  How < and > in an attribute are written back
    // depends on the HTML serializer (jsdom writes them as they are, newer
    // browsers write &lt; and &gt;), so the test checks the parsed title.
    it.each([
        ['a YouTube', 'https://youtu.be/dQw4w9WgXcQ', 'iframe'],
        ['an .mp4', 'https://example.com/demo.mp4', 'video'],
    ])('escapes & " \' < > in %s title', (_, url, tag) => {
        const title = 'Rock & "Roll" <x> it\'s';
        const { html, root } = render('@[' + title + '](' + url + ')');
        expect(root.querySelectorAll(tag)).toHaveLength(1);
        expect(root.querySelector(tag).getAttribute('title')).toBe(title);
        expect(html).toContain('title="Rock &amp; &quot;Roll&quot; ');
        expect(root.querySelector('x')).toBeNull();
    });
});
