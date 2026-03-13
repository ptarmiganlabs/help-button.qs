/**
 * SVG icon library for HelpButton.qs.
 *
 * All icons use a 16×16 viewBox. The `makeSvg()` factory creates an
 * SVG string from any registered icon key.
 */

/**
 * Icon path data keyed by icon name.
 *
 * @type {Record<string, string>}
 */
const ICONS = {
    help:
        '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z' +
        'm-.5-3h1v1h-1V11zm.5-7a2.5 2.5 0 0 0-2.5 2.5h1A1.5 1.5 0 0 1 8 5a1.5 1.5 0 0 1 1.5 1.5' +
        'c0 .827-.673 1.5-1.5 1.5-.276 0-.5.224-.5.5V10h1v-.645A2.5 2.5 0 0 0 8 4z"/>',
    bug:
        '<path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6' +
        's2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm-.5-9h1v5h-1V5zm0 6h1v1h-1v-1z"/>',
    info:
        '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z' +
        'M7.5 5h1v1h-1V5zm0 2h1v4h-1V7z"/>',
    mail:
        '<path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z' +
        'm-.2 1L8 8.5 2.2 4zM2 12V4.9l6 4.6 6-4.6V12z"/>',
    link:
        '<path d="M6.9 11.1a.5.5 0 0 1-.7 0l-1.3-1.3a3 3 0 0 1 0-4.2L6.2 4.3a3 3 0 0 1 4.2 0' +
        'l1.3 1.3a.5.5 0 0 1-.7.7L9.7 5a2 2 0 0 0-2.8 0L5.6 6.3a2 2 0 0 0 0 2.8l1.3 1.3' +
        'a.5.5 0 0 1 0 .7zm2.2-6.2a.5.5 0 0 1 .7 0l1.3 1.3a3 3 0 0 1 0 4.2l-1.3 1.3' +
        'a3 3 0 0 1-4.2 0L4.3 10.4a.5.5 0 0 1 .7-.7l1.3 1.3a2 2 0 0 0 2.8 0l1.3-1.3' +
        'a2 2 0 0 0 0-2.8L9.1 5.6a.5.5 0 0 1 0-.7z"/>',
    star:
        '<path d="M8 1.25l1.75 3.55 3.92.57-2.84 2.77.67 3.91L8 10.27l-3.5 1.78.67-3.91' +
        'L2.33 5.37l3.92-.57L8 1.25z"/>',
    close:
        '<path d="M12.354 4.354a.5.5 0 0 0-.708-.708L8 7.293 4.354 3.646a.5.5 0 1 0-.708.708' +
        'L7.293 8l-3.647 3.646a.5.5 0 0 0 .708.708L8 8.707l3.646 3.647a.5.5 0 0 0 .708-.708' +
        'L8.707 8l3.647-3.646z"/>',
    send:
        '<path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995' +
        'L.643 7.184a.75.75 0 0 1 .124-1.33L15.315.036a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338' +
        'L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>',
    lightbulb:
        '<path d="M8 1a4.5 4.5 0 0 0-1.5 8.74V11.5a1.5 1.5 0 0 0 3 0V9.74A4.5 4.5 0 0 0 8 1z' +
        'm0 1a3.5 3.5 0 0 1 1.07 6.835.5.5 0 0 0-.32.235.5.5 0 0 0-.25.43v2a.5.5 0 0 1-1 0v-2' +
        'a.5.5 0 0 0-.57-.665A3.5 3.5 0 0 1 8 2zM6.5 13a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/>',
    bookmark:
        '<path d="M3 1.5A1.5 1.5 0 0 1 4.5 0h7A1.5 1.5 0 0 1 13 1.5v13a.5.5 0 0 1-.74.44L8 12.47' +
        'l-4.26 2.47A.5.5 0 0 1 3 14.5zM4.5 1a.5.5 0 0 0-.5.5v12.04l3.76-2.18a.5.5 0 0 1 .48 0' +
        'L12 13.54V1.5a.5.5 0 0 0-.5-.5z"/>',
    eye:
        '<path d="M8 3.5C4.36 3.5 1.26 6.1.05 7.72a.5.5 0 0 0 0 .56C1.26 9.9 4.36 12.5 8 12.5' +
        's6.74-2.6 7.95-4.22a.5.5 0 0 0 0-.56C14.74 6.1 11.64 3.5 8 3.5zM1.11 8C2.26 6.52 5.02' +
        ' 4.5 8 4.5s5.74 2.02 6.89 3.5C13.74 9.48 10.98 11.5 8 11.5S2.26 9.48 1.11 8zM8 5.5' +
        'a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>',
    pin:
        '<path d="M9.828 2.172a2 2 0 0 1 2.828 0l1.172 1.172a2 2 0 0 1 0 2.828L11.5 8.5l.354.354' +
        'a.5.5 0 0 1-.354.853H8.707L6.854 11.56a.5.5 0 0 1-.708 0L2.44 7.854a.5.5 0 0 1 0-.708' +
        'L4.293 5.293V2.5a.5.5 0 0 1 .853-.354L5.5 2.5zM5.293 3.707v1.879a.5.5 0 0 1-.147.354' +
        'L3.56 7.5 6.5 10.44l1.56-1.586a.5.5 0 0 1 .354-.147h1.879l1.879-1.879a1 1 0 0 0 0-1.414' +
        'l-1.172-1.172a1 1 0 0 0-1.414 0z"/>',
    'chart-bar':
        '<path d="M1 14h14v1H1zM3 4h2v9H3zm4-3h2v12H7zm4 5h2v7h-2z"/>',
};

/**
 * Create an SVG element string from a registered icon key.
 *
 * @param {string} iconKey - Icon name (e.g. 'help', 'bug', 'info').
 * @param {number} [size=16] - Width and height in px.
 * @param {string} [color='currentColor'] - Fill color.
 * @returns {string} SVG markup string.
 */
export function makeSvg(iconKey, size, color) {
    const paths = ICONS[iconKey] || ICONS.help;
    const fill = color || 'currentColor';
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" ` +
        `width="${size || 16}" height="${size || 16}" ` +
        `fill="${fill}" aria-hidden="true" role="img">` +
        paths +
        '</svg>'
    );
}

/**
 * List of available icon names.
 *
 * @type {string[]}
 */
export const ICON_NAMES = Object.keys(ICONS);

export default ICONS;
