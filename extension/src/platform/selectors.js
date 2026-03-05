/**
 * Versioned CSS selector registry for Qlik Sense toolbar elements.
 *
 * When the Qlik client DOM changes (new Sense version, Cloud updates),
 * update THIS FILE ONLY — all other code uses these selectors indirectly.
 *
 * Each platform has a `codePaths` map keyed by code-path name.
 * The `default` code path is the fallback.
 */

const selectors = {
    'client-managed': {
        /**
         * Default / current code-path selectors for client-managed Qlik Sense.
         */
        default: {
            /** Primary toolbar anchor — help button is injected as first child. */
            toolbarAnchor: '#top-bar-right-side',

            /** Alternative toolbar selectors for detection. */
            toolbar: '.qv-toolbar-container, .qs-toolbar',

            /** Search toggle button — used as position reference. */
            searchToggle: '#qv-toolbar-search-toggle',

            /** Sheet container — used for SPA navigation detection. */
            sheetContainer: '.qv-sheet, .qv-panel-sheet, .qv-panel-content',
        },
    },

    cloud: {
        /**
         * Default Cloud selectors.
         * Cloud toolbar uses data-testid attributes on MUI components.
         */
        default: {
            /** Primary toolbar anchor — help button is injected as first child. */
            toolbarAnchor: '[data-testid="top-bar-right-side"]',

            /** Top-level toolbar root (for general detection). */
            toolbar: '[data-testid="top-bar-root"]',

            /** Sub-toolbar (selections bar). */
            subToolbar: '[data-testid="qs-sub-toolbar"]',

            /** Sheet container. */
            sheetContainer: '.qvt-sheet.qv-panel-sheet',
        },
    },
};

/**
 * Get the selector set for a given platform and code-path name.
 *
 * @param {string} platform - 'client-managed' or 'cloud'.
 * @param {string} [codePath] - Code-path name (e.g. 'default'). Falls back to 'default'.
 * @returns {object} Selector strings for the given platform and code path.
 */
export function getSelectors(platform, codePath) {
    const platformSelectors = selectors[platform];
    if (!platformSelectors) {
        return selectors['client-managed'].default;
    }

    const base = platformSelectors.default;

    // Merge overrides if a specific code-path exists
    if (codePath && codePath !== 'default' && platformSelectors[codePath]) {
        return { ...base, ...platformSelectors[codePath] };
    }

    return base;
}

export default selectors;
