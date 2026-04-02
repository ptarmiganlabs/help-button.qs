/**
 * Color utility helpers for HelpButton.qs.
 *
 * The Qlik color-picker component stores values as objects:
 *   { color: '#rrggbb', index: '-1' }
 *
 * These helpers convert between that format and plain hex strings
 * used by the DOM / CSS.
 */

/**
 * Convert a hex color string to a color-picker object.
 *
 * @param {string} hex - Hex color string, e.g. '#165a9b'.
 * @returns {{ color: string, index: string }} Color-picker value.
 */
export function toPickerObj(hex) {
    const c = (hex || '').replace(/^#/, '');
    return { color: c ? `#${c}` : '', index: '-1' };
}

/**
 * Extract a plain hex color string from a color-picker object or
 * a raw string.
 *
 * Handles all formats:
 *   - { color: '#rrggbb', index: ... }   → '#rrggbb'
 *   - '#rrggbb'                          → '#rrggbb'
 *   - undefined / null / ''              → fallback
 *
 * @param {string|object|undefined|null} raw - Value from the layout.
 * @param {string} [fallback=''] - Fallback if raw is empty / undefined.
 * @returns {string} Resolved hex color string (or fallback).
 */
export function resolveColor(raw, fallback = '') {
    if (raw == null) return fallback;

    // Color-picker object
    if (typeof raw === 'object' && typeof raw.color === 'string') {
        const c = raw.color.trim();
        if (!c) return fallback;
        return c.startsWith('#') ? c : `#${c}`;
    }

    // Plain string
    if (typeof raw === 'string') {
        const s = raw.trim();
        return s || fallback;
    }

    return fallback;
}

// ---------------------------------------------------------------------------
// CSS color validation
// ---------------------------------------------------------------------------

/**
 * Named CSS colors accepted by safeCssColor().
 * Kept intentionally short — covers the most common names used in UI theming.
 *
 * @type {Set<string>}
 */
const NAMED_COLORS = new Set([
    'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
    'gray', 'grey', 'silver', 'maroon', 'navy', 'teal', 'aqua', 'fuchsia',
    'lime', 'olive', 'transparent', 'currentcolor',
]);

/**
 * Validate that a string is a safe CSS color value.
 *
 * Accepts:
 *   - Hex: #RGB, #RRGGBB, #RRGGBBAA
 *   - rgb() / rgba() with numeric arguments
 *   - hsl() / hsla() with numeric/percentage arguments
 *   - `currentColor`
 *   - A short set of named colors (see NAMED_COLORS)
 *
 * Returns the value unchanged when valid, or `fallback` otherwise.
 * This prevents attribute-injection attacks when the value is
 * interpolated into HTML/SVG markup strings.
 *
 * @param {string} value - Candidate color string.
 * @param {string} [fallback='currentColor'] - Safe fallback.
 * @returns {string} Validated color or fallback.
 */
export function safeCssColor(value, fallback = 'currentColor') {
    if (typeof value !== 'string') return fallback;
    const v = value.trim();
    if (!v) return fallback;

    // Hex: #RGB, #RRGGBB, #RRGGBBAA
    if (/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3,5})?$/.test(v)) return v;

    // rgb() / rgba()  —  e.g. rgb(255, 128, 0) or rgba(0,0,0,0.5)
    if (/^rgba?\(\s*[\d.]+%?\s*(,\s*[\d.]+%?\s*){2,3}\)$/i.test(v)) return v;

    // hsl() / hsla()
    if (/^hsla?\(\s*[\d.]+\s*(,\s*[\d.]+%?\s*){2,3}\)$/i.test(v)) return v;

    // Named color
    if (NAMED_COLORS.has(v.toLowerCase())) return v;

    return fallback;
}
