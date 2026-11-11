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

    it.each([
        ['without a URI filter', undefined],
        [
            'with a URI filter that allows its source',
            { allowedUriPatterns: 'https://example.com/' },
        ],
    ])('keeps the source of a raw video %s', (_, options) => {
        const { root } = render(
            '<video controls><source src="https://example.com/demo.mp4"></video>',
            options
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
        [
            'an image',
            '`y` and ![Use `Sum(x)`](https://example.com/a.png)',
            'img',
            'alt',
            'Use `Sum(x)`',
        ],
        [
            'a video',
            '`y` and @[See `x`](https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
            'iframe',
            'title',
            'See `x`',
        ],
        ['a raw tag', '`y` and <span title="`a<b>`">t</span>', 'span', 'title', '`a<b>`'],
    ])('still makes <code> from a code span in text next to %s', (_, md, tag, attr, value) => {
        const { root } = render(md);
        expect(codeTexts(root)).toEqual(['y']);
        expect(root.querySelector(tag).getAttribute(attr)).toBe(value);
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
    const TITLE = 'Rock & "Roll" <x> it\'s';

    // The title must come out as the same sanitized HTML as before code spans
    // were taken out first.  The expected HTML is what jsdom writes, which
    // was the same on main before #224.  jsdom writes < and > in an attribute
    // as they are, while newer browsers write &lt; and &gt;.  So if a jsdom
    // update changes that, update these strings: the parsed title, checked
    // below, must stay the same.
    it.each([
        [
            'a YouTube',
            'https://youtu.be/dQw4w9WgXcQ',
            'iframe',
            '<div class="hbqs-video-wrapper">' +
                '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"' +
                ' title="Rock &amp; &quot;Roll&quot; <x> it\'s" frameborder="0"' +
                ' allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
                ' allowfullscreen=""></iframe></div>',
        ],
        [
            'an .mp4',
            'https://example.com/demo.mp4',
            'video',
            '<div class="hbqs-video-wrapper hbqs-video-wrapper--native">' +
                '<video controls="" preload="metadata"' +
                ' title="Rock &amp; &quot;Roll&quot; <x> it\'s">' +
                '<source src="https://example.com/demo.mp4"></video></div>',
        ],
    ])('escapes & " \' < > in %s title', (_, url, tag, expected) => {
        const { html, root } = render('@[' + TITLE + '](' + url + ')');
        expect(html).toBe(expected);
        expect(root.querySelectorAll(tag)).toHaveLength(1);
        expect(root.querySelector(tag).getAttribute('title')).toBe(TITLE);
        expect(root.querySelector('x')).toBeNull();
    });
});

describe('URI filter', () => {
    /** The prefix that the property panel's placeholder suggests. */
    const CONTENT_LIBRARY = { allowedUriPatterns: '/content/Default/' };

    /**
     * The src of each <source> in each <video> of the result.
     *
     * @param {HTMLElement} root
     * @returns {string[][]}
     */
    function videoSources(root) {
        return [...root.querySelectorAll('video')].map((video) =>
            [...video.querySelectorAll('source')].map((source) => source.getAttribute('src'))
        );
    }

    it('keeps an .mp4 shorthand whose host is allowed', () => {
        const { root } = render('@[Clip](https://media.example.com/clip.mp4)', {
            allowedUriPatterns: 'https://www.youtube.com/embed/, https://media.example.com/',
        });
        expect(root.querySelector('.hbqs-video-wrapper--native > video')).not.toBeNull();
        expect(videoSources(root)).toEqual([['https://media.example.com/clip.mp4']]);
    });

    it('removes an .mp4 shorthand whose host is not allowed, wrapper and all', () => {
        const { html, root } = render('@[Clip](https://media.example.com/clip.mp4)', YOUTUBE_ONLY);
        expect(root.querySelector('video, source, .hbqs-video-wrapper')).toBeNull();
        expect(html).toBe('');
    });

    it('keeps a raw video whose <source> is allowed', () => {
        const { root } = render(
            '<video controls><source src="/content/Default/clip.mp4"></video>',
            CONTENT_LIBRARY
        );
        expect(videoSources(root)).toEqual([['/content/Default/clip.mp4']]);
    });

    it('keeps the allowed <source> of a video and removes the other', () => {
        const { root } = render(
            '<video controls>' +
                '<source src="https://evil.example.com/a.mp4">' +
                '<source src="/content/Default/b.mp4">' +
                '</video>',
            CONTENT_LIBRARY
        );
        expect(videoSources(root)).toEqual([['/content/Default/b.mp4']]);
    });

    it('removes a video whose <source> elements are all not allowed', () => {
        const { root } = render(
            '<video controls>' +
                '<source src="https://evil.example.com/a.mp4">' +
                '<source src="https://evil.example.com/b.webm">' +
                '</video>',
            CONTENT_LIBRARY
        );
        expect(root.querySelector('video, source')).toBeNull();
    });

    it('removes a video with no src and no <source>', () => {
        const { root } = render('<video controls></video>', CONTENT_LIBRARY);
        expect(root.querySelector('video')).toBeNull();
    });

    it('keeps a video whose own src is allowed', () => {
        const { root } = render(
            '<video controls src="/content/Default/clip.mp4"></video>',
            CONTENT_LIBRARY
        );
        expect(root.querySelector('video').getAttribute('src')).toBe('/content/Default/clip.mp4');
    });

    // A browser plays a video's own src when it has one, even an empty one,
    // and then ignores its <source> children.  So an allowed <source> does
    // not save a video whose own src is not allowed.
    it.each([
        ['not allowed', '<video controls src="https://evil.example.com/x.mp4"></video>'],
        [
            'not allowed, with an allowed <source>',
            '<video controls src="https://evil.example.com/x.mp4">' +
                '<source src="/content/Default/clip.mp4"></video>',
        ],
        [
            'empty, with an allowed <source>',
            '<video controls src=""><source src="/content/Default/clip.mp4"></video>',
        ],
    ])('removes a video whose own src is %s', (_, md) => {
        const { root } = render(md, CONTENT_LIBRARY);
        expect(root.querySelector('video, source')).toBeNull();
    });

    it('removes an iframe shorthand whose src is not allowed, with no black box left', () => {
        const { html, root } = render(
            'Before\n\n@[Demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)\n\nAfter',
            { allowedUriPatterns: 'https://player.vimeo.com/video/' }
        );
        expect(root.querySelector('iframe, .hbqs-video-wrapper')).toBeNull();
        expect(root.textContent).toBe('BeforeAfter');
        expect(html).not.toContain('hbqs-video-wrapper');
    });

    it('keeps a wrapper that still holds its iframe', () => {
        const { root } = render(
            '@[Demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
            YOUTUBE_ONLY
        );
        expect(root.querySelector('.hbqs-video-wrapper > iframe')).not.toBeNull();
    });

    it('removes a video whose allowed <source> is not a direct child', () => {
        const { root } = render(
            '<video controls><span><source src="/content/Default/clip.mp4"></span></video>',
            CONTENT_LIBRARY
        );
        expect(root.querySelector('video, source')).toBeNull();
    });

    it.each([
        ['a video with its own src', '<video controls src="/content/Default/clip.mp4"'],
        ['a video with a <source>', '<video controls'],
    ])('removes a poster that is not allowed from %s, and keeps the video', (_, start) => {
        const md =
            start +
            ' poster="https://tracker.example.net/p.png">' +
            (start.includes('src=') ? '' : '<source src="/content/Default/clip.mp4">') +
            '</video>';
        const { root } = render(md, CONTENT_LIBRARY);
        const video = root.querySelector('video');
        expect(video).not.toBeNull();
        expect(video.hasAttribute('poster')).toBe(false);
    });

    it('keeps a poster that is allowed', () => {
        const { root } = render(
            '<video controls src="/content/Default/clip.mp4" poster="/content/Default/p.png"></video>',
            CONTENT_LIBRARY
        );
        expect(root.querySelector('video').getAttribute('poster')).toBe('/content/Default/p.png');
    });

    it('removes a <track> that is not allowed and keeps one that is', () => {
        const { root } = render(
            '<video controls>' +
                '<source src="/content/Default/clip.mp4">' +
                '<track src="https://tracker.example.net/t.vtt">' +
                '<track src="/content/Default/en.vtt">' +
                '</video>',
            CONTENT_LIBRARY
        );
        const tracks = [...root.querySelectorAll('video > track')].map((t) =>
            t.getAttribute('src')
        );
        expect(tracks).toEqual(['/content/Default/en.vtt']);
        expect(videoSources(root)).toEqual([['/content/Default/clip.mp4']]);
    });

    it.each([
        ['its own src is allowed', '<audio controls src="/content/Default/a.mp3"></audio>', true],
        [
            'its own src is not allowed',
            '<audio controls src="https://evil.example.com/a.mp3"></audio>',
            false,
        ],
        [
            'its <source> is allowed',
            '<audio controls><source src="/content/Default/a.mp3"></audio>',
            true,
        ],
        [
            'its <source> is not allowed',
            '<audio controls><source src="https://evil.example.com/a.mp3"></audio>',
            false,
        ],
    ])('checks an <audio> like a <video>: %s', (_, md, kept) => {
        const { root } = render(md, CONTENT_LIBRARY);
        expect(root.querySelector('audio') !== null).toBe(kept);
    });

    describe('a prefix that is only an origin', () => {
        const ORIGIN_ONLY = { allowedUriPatterns: 'https://media.example.com' };

        it.each([
            'https://media.example.com/clip.mp4',
            'https://media.example.com?v=1',
            'https://media.example.com#t=5',
            'https://media.example.com',
        ])('allows %s', (url) => {
            const { root } = render(`<video controls src="${url}"></video>`, ORIGIN_ONLY);
            expect(root.querySelector('video')).not.toBeNull();
        });

        it.each([
            'https://media.example.com.attacker.net/clip.mp4',
            'https://media.example.com@attacker.net/clip.mp4',
            'https://media.example.com:8443/clip.mp4',
        ])('does not allow %s', (url) => {
            const { root } = render(`<video controls src="${url}"></video>`, ORIGIN_ONLY);
            expect(root.querySelector('video')).toBeNull();
        });
    });

    it.each([
        ['https://', 'https://media.example.com/clip.mp4'],
        ['/content/Default', '/content/Default/clip.mp4'],
        ['https://media.example.com/cl', 'https://media.example.com/clip.mp4'],
    ])('still treats the prefix %s as a plain prefix', (prefix, url) => {
        const { root } = render(`<video controls src="${url}"></video>`, {
            allowedUriPatterns: prefix,
        });
        expect(root.querySelector('video')).not.toBeNull();
    });
});
