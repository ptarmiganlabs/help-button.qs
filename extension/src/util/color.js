/**
 * Color utility helpers for qs-help-button.
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
