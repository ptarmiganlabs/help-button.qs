/**
 * qs-help-button — Supernova entry point.
 *
 * A Qlik Sense extension that injects a configurable help button
 * into the application toolbar. Supports both client-managed and
 * Qlik Cloud environments.
 *
 * @param {object} galaxy - Nebula galaxy object.
 * @returns {object} Supernova definition.
 */

import {
    useElement,
    useLayout,
    useEffect,
    useRef,
    useState,
    useOptions,
} from '@nebula.js/stardust';
import ext from './ext';
import definition from './object-properties';
import { detectPlatform, getPlatformAdapter } from './platform/index';
import { injectHelpButton, destroyHelpButton } from './ui/toolbar-injector';
import { makeSvg } from './ui/icons';
import { fetchTemplateContext } from './util/template-fields';
import { resolveText } from './i18n/index';
import logger from './util/logger';
import './style.css';

export default function supernova(galaxy) {
    return {
        qae: {
            properties: definition,
            data: {
                targets: [],
            },
        },

        /**
         * Main component logic.
         */
        component() {
            const layout = useLayout();
            const element = useElement();
            const options = useOptions();
            const layoutRef = useRef(layout);
            // Platform detection: async, resolved once then cached in state.
            const [platform, setPlatform] = useState(null);
            const [adapter, setAdapter] = useState(null);

            // Detect edit vs analysis mode
            const isEditMode =
                options.readOnly !== undefined
                    ? !options.readOnly
                    : /\/edit(?:\b|$)/.test(window.location.pathname);

            // Keep layout ref current
            useEffect(() => {
                layoutRef.current = layout;
            }, [layout]);

            // One-time async platform detection + adapter loading
            useEffect(() => {
                let cancelled = false;

                (async () => {
                    if (platform && adapter) return;

                    try {
                        const detectedAdapter = getPlatformAdapter();
                        const detectedPlatform = await detectPlatform();

                        if (cancelled) return;

                        setPlatform(detectedPlatform);
                        setAdapter(detectedAdapter);

                        // Start fetching template context (fire-and-forget)
                        fetchTemplateContext(detectedPlatform.type);

                        logger.info(
                            `Platform ready: ${detectedPlatform.type} v${detectedPlatform.version ?? '?'} (${detectedPlatform.codePath})`
                        );
                    } catch (err) {
                        if (!cancelled) {
                            logger.error('Platform detection failed:', err);
                        }
                    }
                })();

                return () => {
                    cancelled = true;
                };
            }, []);

            // Main render effect — injects toolbar button or shows edit placeholder
            useEffect(() => {
                if (!platform || !adapter) return;

                if (isEditMode) {
                    // Edit mode: show a placeholder inside the extension cell
                    renderEditPlaceholder(element, layout);

                    // Remove toolbar button while editing (clear config so watcher won't re-inject)
                    destroyHelpButton({ clearConfig: true });
                    return;
                }

                // Analysis mode: inject toolbar button + show minimal placeholder in cell
                renderAnalysisPlaceholder(element);

                injectHelpButton(layout, adapter, platform);
                // No cleanup returned — the button is a page-level singleton
                // that must survive component unmount on sheet navigation.
                // injectHelpButton() handles updates via its double-injection guard.
                // watchForRemoval() handles re-injection after SPA navigation.
            }, [platform, adapter, layout, isEditMode]);

            // NOTE: We intentionally do NOT destroy the toolbar button
            // on unmount. The button is a page-level singleton that must
            // persist when navigating to sheets that don't contain the
            // extension. The watchForRemoval observer in toolbar-injector
            // handles re-injection after SPA navigation.
        },

        ext: ext(galaxy),
    };
}

/**
 * Render the edit-mode placeholder inside the extension's grid cell.
 *
 * @param {HTMLElement} element - The extension's container element.
 * @param {object} layout - Extension layout.
 */
function renderEditPlaceholder(element, layout) {
    const menuCount = (layout.menuItems || []).length;
    const hasBugReport = layout.bugReport?.enabled ? 'Yes' : 'No';
    const title = resolveText(layout.buttonLabel, 'editPlaceholderTitle');
    const description = resolveText('', 'editPlaceholderDescription');

    element.innerHTML = `
        <div class="qshb-edit-placeholder">
            <div class="qshb-edit-placeholder-icon">
                ${makeSvg('help', 32, '#165a9b')}
            </div>
            <div class="qshb-edit-placeholder-title">${title}</div>
            <div class="qshb-edit-placeholder-description">${description}</div>
            <div class="qshb-edit-placeholder-badge">
                <span class="qshb-edit-placeholder-stat">${menuCount} menu items</span>
                <span class="qshb-edit-placeholder-stat">Bug report: ${hasBugReport}</span>
            </div>
        </div>
    `;
}

/**
 * Render the analysis-mode placeholder (minimal / invisible).
 * The actual button is injected into the toolbar, not into the grid cell.
 *
 * @param {HTMLElement} element - The extension's container element.
 */
function renderAnalysisPlaceholder(element) {
    element.innerHTML = `
        <div class="qshb-analysis-placeholder">
            Help button active in toolbar
        </div>
    `;
}
