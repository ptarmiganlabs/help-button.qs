/**
 * HelpButton.qs — Supernova entry point.
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
    useModel,
    useRef,
    useState,
    useOptions,
} from '@nebula.js/stardust';
import ext from './ext';
import definition from './object-properties';
import { detectPlatform, getPlatformAdapter } from './platform/index';
import { injectHelpButton } from './ui/toolbar-injector';
import { injectTooltips, destroyTooltips } from './ui/tooltip-injector';
import { makeSvg } from './ui/icons';
import { fetchTemplateContext } from './util/template-fields';
import { resolveText, setForceLocale } from './i18n/index';
import { escapeHtml } from './util/template-fields';
import { applyPresetToNewTooltips } from './theme/presets';
import logger, { PACKAGE_VERSION } from './util/logger';
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
            const model = useModel();
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

            // Keep layout ref current + sync forced locale
            useEffect(() => {
                layoutRef.current = layout;
                // Apply language override from property panel
                setForceLocale(layout.language || 'auto');
            }, [layout]);

            // Apply theme preset colors to newly added tooltips.
            // The array-level `change` handler in the property panel does not
            // fire on item addition, so we detect unthemed items here and
            // persist the theme colors via the engine API.
            useEffect(() => {
                if (!model || !layout.themePreset) return;
                if (!layout.tooltips || !layout.tooltips.length) return;

                // Check if any tooltip needs theming (fast bail-out)
                const needsTheming = layout.tooltips.some(
                    (t) => t._themedPreset !== layout.themePreset
                );
                if (!needsTheming) return;

                (async () => {
                    try {
                        const props = await model.getProperties();
                        const changed = applyPresetToNewTooltips(props);
                        if (changed) {
                            await model.setProperties(props);
                        }
                    } catch (err) {
                        logger.warn('Could not apply theme to new tooltips:', err);
                    }
                })();
            }, [model, layout]);

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

                    // Responsive size tiers via ResizeObserver
                    const widgetEl = element.querySelector('.hbqs-edit-placeholder');
                    let resizeObserver;
                    if (widgetEl && typeof ResizeObserver !== 'undefined') {
                        const classify = () => {
                            const h = widgetEl.clientHeight;
                            const w = widgetEl.clientWidth;
                            let size = 'md';
                            if (h < 80) size = 'xs';
                            else if (h < 160) size = 'sm';
                            widgetEl.setAttribute('data-size', size);
                            widgetEl.setAttribute('data-narrow', w < 160 ? 'true' : 'false');
                        };
                        resizeObserver = new ResizeObserver(classify);
                        resizeObserver.observe(widgetEl);
                        classify();
                    }

                    // Attach About button handler
                    const aboutBtn = element.querySelector('.hbqs-about-btn');
                    if (aboutBtn) {
                        aboutBtn.addEventListener('click', () => openAboutModal());
                    }

                    // Keep toolbar button visible while editing
                    injectHelpButton(layout, adapter, platform);

                    return () => {
                        if (resizeObserver) resizeObserver.disconnect();
                    };
                }

                // Analysis mode: inject toolbar button + show placeholder in cell
                renderAnalysisPlaceholder(element, layout);

                injectHelpButton(layout, adapter, platform);
                // No cleanup returned — the button is a page-level singleton
                // that must survive component unmount on sheet navigation.
                // injectHelpButton() handles updates via its double-injection guard.
                // watchForRemoval() handles re-injection after SPA navigation.

                // Inject tooltip icons onto chart objects / CSS targets
                injectTooltips(layout, adapter, platform);

                // --- Context menu & hover menu visibility overrides ---
                const hideContextMenu = layout.widget?.hideContextMenu === true;
                const hideHoverMenu = layout.widget?.hideHoverMenu === true;

                const qlikWrapper =
                    element.closest('.qv-gridcell') ||
                    element.closest('.qv-object') ||
                    element.parentElement ||
                    element;

                // Context menu: suppress via capture-phase listener + MutationObserver
                let contextMenuHandler;
                let contextMenuObserver;
                let rightClickTimer;
                if (hideContextMenu) {
                    let recentRightClick = false;

                    contextMenuHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        recentRightClick = true;
                        clearTimeout(rightClickTimer);
                        rightClickTimer = setTimeout(() => {
                            recentRightClick = false;
                        }, 500);
                    };
                    qlikWrapper.addEventListener('contextmenu', contextMenuHandler, true);

                    contextMenuObserver = new MutationObserver((mutations) => {
                        if (!recentRightClick) return;
                        for (const mutation of mutations) {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType !== 1) continue;
                                // Client-managed context menu
                                const qvContextMenu = node.classList?.contains('qv-contextmenu')
                                    ? node
                                    : node.querySelector?.('.qv-contextmenu');
                                if (qvContextMenu) {
                                    qvContextMenu.remove();
                                    recentRightClick = false;
                                    return;
                                }
                                // Cloud context menu (React portal)
                                const cloudMenu =
                                    node.getAttribute?.('data-testid') === 'qmfe-menu'
                                        ? node
                                        : node.querySelector?.('[data-testid="qmfe-menu"]');
                                if (cloudMenu) {
                                    cloudMenu.remove();
                                    recentRightClick = false;
                                    return;
                                }
                            }
                        }
                    });
                    contextMenuObserver.observe(document.body, { childList: true });
                }

                // Hover menu: apply hiding CSS class to grid-cell wrapper
                let hoverMenuTarget;
                if (hideHoverMenu) {
                    hoverMenuTarget = qlikWrapper;
                    hoverMenuTarget.classList.add('hbqs-no-hover-menu');
                }

                return () => {
                    if (contextMenuHandler) {
                        qlikWrapper.removeEventListener('contextmenu', contextMenuHandler, true);
                        clearTimeout(rightClickTimer);
                    }
                    if (contextMenuObserver) {
                        contextMenuObserver.disconnect();
                    }
                    if (hoverMenuTarget) {
                        hoverMenuTarget.classList.remove('hbqs-no-hover-menu');
                    }
                    destroyTooltips();
                };
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
 * Layout matches onboard.qs: icon, title, stats, About button.
 *
 * @param {HTMLElement} element - The extension's container element.
 * @param {object} layout - Extension layout.
 */
function renderEditPlaceholder(element, layout) {
    const menuCount = (layout.menuItems || []).length;
    const hasBugReport = (layout.menuItems || []).some((item) => item.action === 'bugReport');
    const hasFeedback = (layout.menuItems || []).some((item) => item.action === 'feedback');

    const statsText =
        `${menuCount} menu item${menuCount !== 1 ? 's' : ''}` +
        (hasBugReport ? ' · Bug report: On' : '') +
        (hasFeedback ? ' · Feedback: On' : '');

    const placeholderTitle = escapeHtml(resolveText('', 'editPlaceholderTitle'));

    element.innerHTML = `
        <div class="hbqs-edit-placeholder"
             title="${placeholderTitle} — ${statsText}">
            <div class="hbqs-edit-placeholder-info">
                <div class="hbqs-edit-placeholder-icon">
                    ${makeSvg('help', 32, '#165a9b')}
                </div>
                <div class="hbqs-edit-placeholder-title">${placeholderTitle}</div>
                <div class="hbqs-edit-placeholder-stats">${statsText}</div>
                <div class="hbqs-edit-placeholder-actions">
                    <button class="hbqs-btn hbqs-btn--ghost hbqs-about-btn"
                            title="About HelpButton.qs">
                        &#9432; About
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render the analysis-mode placeholder.
 * Text is customizable and optionally hidden via layout properties.
 *
 * @param {HTMLElement} element - The extension's container element.
 * @param {object} layout - Extension layout.
 */
function renderAnalysisPlaceholder(element, layout) {
    const show = layout.widget?.showAnalysisPlaceholder !== false;
    const text = layout.widget?.analysisPlaceholderText || resolveText('', 'analysisPlaceholder');

    element.innerHTML = show
        ? `<div class="hbqs-analysis-placeholder">${escapeHtml(text)}</div>`
        : `<div class="hbqs-analysis-placeholder hbqs-analysis-placeholder--hidden"></div>`;
}

/**
 * Open a modal "About" dialog with extension info, version, and links.
 */
function openAboutModal() {
    // Remove any existing about modal
    const existing = document.querySelector('.hbqs-about-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'hbqs-about-overlay';
    overlay.innerHTML = `
        <div class="hbqs-about-modal">
            <div class="hbqs-about-modal__header">
                <span class="hbqs-about-modal__icon">${makeSvg('help', 28, '#165a9b')}</span>
                <span class="hbqs-about-modal__title">HelpButton.qs</span>
                <span class="hbqs-about-modal__version">v${escapeHtml(PACKAGE_VERSION)}</span>
            </div>
            <p class="hbqs-about-modal__tagline">
                Configurable help button for Qlik Sense apps.
            </p>
            <div class="hbqs-about-modal__links">
                <a href="https://github.com/ptarmiganlabs/help-button.qs" target="_blank" rel="noopener noreferrer">
                    <strong>Documentation &amp; Source Code</strong>
                    <span>README, docs, and full source on GitHub.</span>
                </a>
                <a href="https://github.com/ptarmiganlabs/help-button.qs/issues/new/choose" target="_blank" rel="noopener noreferrer">
                    <strong>Report a Bug / Request a Feature</strong>
                    <span>Open an issue on GitHub to report problems or suggest improvements.</span>
                </a>
                <a href="https://ptarmiganlabs.com" target="_blank" rel="noopener noreferrer">
                    <strong>Ptarmigan Labs</strong>
                    <span>Qlik Sense tools, blog posts, extensions &amp; consulting.</span>
                </a>
            </div>
            <div class="hbqs-about-modal__footer">
                <button class="hbqs-btn hbqs-btn--secondary hbqs-about-close-btn">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
        document.removeEventListener('keydown', onKey);
        overlay.remove();
    };
    const onKey = (e) => {
        if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    overlay.querySelector('.hbqs-about-close-btn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
}
