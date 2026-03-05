/**
 * Property panel definition for qs-help-button extension.
 *
 * Section order: Language → Widget → Button → Popup → Menu Items → Template Fields → About
 *
 * @param {object} galaxy - Nebula galaxy object.
 * @returns {object} Extension property panel configuration.
 */

import { PACKAGE_VERSION } from './util/logger';
import { toPickerObj } from './util/color';

export default function ext(_galaxy) {
    return {
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
                // ---------------------------------------------------------------
                // Language override
                // ---------------------------------------------------------------
                languageSection: {
                    type: 'items',
                    label: 'Language',
                    items: {
                        languageInfo: {
                            component: 'text',
                            label: 'By default, the extension auto-detects the Qlik UI language. Override here to force a specific locale for all translated strings.',
                        },
                        language: {
                            ref: 'language',
                            label: 'Language',
                            type: 'string',
                            component: 'dropdown',
                            defaultValue: 'auto',
                            options: [
                                { value: 'auto', label: 'Auto-detect' },
                                { value: 'en', label: 'English' },
                                { value: 'sv', label: 'Svenska' },
                                { value: 'no', label: 'Norsk' },
                                { value: 'da', label: 'Dansk' },
                                { value: 'fi', label: 'Suomi' },
                                { value: 'de', label: 'Deutsch' },
                                { value: 'fr', label: 'Français' },
                                { value: 'pl', label: 'Polski' },
                                { value: 'es', label: 'Español' },
                            ],
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Widget (grid cell) appearance
                // ---------------------------------------------------------------
                widgetSection: {
                    type: 'items',
                    label: 'Widget Appearance',
                    items: {
                        hideHoverMenu: {
                            ref: 'widget.hideHoverMenu',
                            label: 'Hide hover menu',
                            type: 'boolean',
                            defaultValue: false,
                            component: 'switch',
                            options: [
                                { value: true, label: 'Hidden' },
                                { value: false, label: 'Visible' },
                            ],
                        },
                        hideContextMenu: {
                            ref: 'widget.hideContextMenu',
                            label: 'Hide context menu',
                            type: 'boolean',
                            defaultValue: false,
                            component: 'switch',
                            options: [
                                { value: true, label: 'Hidden' },
                                { value: false, label: 'Visible' },
                            ],
                        },
                        showAnalysisPlaceholder: {
                            ref: 'widget.showAnalysisPlaceholder',
                            label: 'Show placeholder text in analysis mode',
                            type: 'boolean',
                            defaultValue: true,
                            component: 'switch',
                            options: [
                                { value: true, label: 'Show' },
                                { value: false, label: 'Hide' },
                            ],
                        },
                        analysisPlaceholderText: {
                            ref: 'widget.analysisPlaceholderText',
                            label: 'Analysis placeholder text (empty = auto)',
                            type: 'string',
                            defaultValue: '',
                            show: (layout) => layout.widget?.showAnalysisPlaceholder !== false,
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Toolbar button appearance
                // ---------------------------------------------------------------
                buttonSection: {
                    type: 'items',
                    label: 'Button Appearance',
                    items: {
                        buttonLabel: {
                            ref: 'buttonLabel',
                            label: 'Button label (empty = auto-translate)',
                            type: 'string',
                            defaultValue: '',
                        },
                        buttonTooltip: {
                            ref: 'buttonTooltip',
                            label: 'Button tooltip (empty = auto-translate)',
                            type: 'string',
                            defaultValue: '',
                        },
                        buttonIcon: {
                            ref: 'buttonIcon',
                            label: 'Button icon',
                            type: 'string',
                            component: 'dropdown',
                            defaultValue: 'help',
                            options: [
                                { value: 'help', label: 'Help (question mark)' },
                                { value: 'info', label: 'Info (i)' },
                                { value: 'bug', label: 'Bug (exclamation)' },
                                { value: 'mail', label: 'Mail (envelope)' },
                                { value: 'link', label: 'Link (chain)' },
                            ],
                        },
                        buttonColorsHeader: {
                            component: 'text',
                            label: 'Button colors',
                        },
                        buttonBgColor: {
                            ref: 'buttonStyle.backgroundColor',
                            label: 'Background',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#165a9b'),
                        },
                        buttonHoverBgColor: {
                            ref: 'buttonStyle.backgroundColorHover',
                            label: 'Hover background',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#12487c'),
                        },
                        buttonTextColor: {
                            ref: 'buttonStyle.textColor',
                            label: 'Text / icon',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#ffffff'),
                        },
                        buttonBorderColor: {
                            ref: 'buttonStyle.borderColor',
                            label: 'Border',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#0e3b65'),
                        },
                        buttonBorderRadius: {
                            ref: 'buttonStyle.borderRadius',
                            label: 'Border radius',
                            type: 'string',
                            defaultValue: '4px',
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Popup appearance
                // ---------------------------------------------------------------
                popupSection: {
                    type: 'items',
                    label: 'Popup Appearance',
                    items: {
                        popupTitle: {
                            ref: 'popupTitle',
                            label: 'Popup heading (empty = auto-translate)',
                            type: 'string',
                            defaultValue: '',
                        },
                        popupColorsHeader: {
                            component: 'text',
                            label: 'Popup colors',
                        },
                        popupBgColor: {
                            ref: 'popupStyle.backgroundColor',
                            label: 'Background',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#ffffff'),
                        },
                        popupBorderColor: {
                            ref: 'popupStyle.borderColor',
                            label: 'Border',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#0c3256'),
                        },
                        popupBorderRadius: {
                            ref: 'popupStyle.borderRadius',
                            label: 'Border radius',
                            type: 'string',
                            defaultValue: '8px',
                        },
                        popupHeaderBgColor: {
                            ref: 'popupStyle.headerBackgroundColor',
                            label: 'Header background',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#0c3256'),
                        },
                        popupHeaderTextColor: {
                            ref: 'popupStyle.headerTextColor',
                            label: 'Header text',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#ffcc33'),
                        },
                        popupSeparatorColor: {
                            ref: 'popupStyle.separatorColor',
                            label: 'Separator line',
                            type: 'object',
                            component: 'color-picker',
                            defaultValue: toPickerObj('#e0e0e0'),
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Menu items (with inline bug-report fields)
                // ---------------------------------------------------------------
                menuItemsSection: {
                    type: 'items',
                    label: 'Menu Items',
                    items: {
                        menuItems: {
                            ref: 'menuItems',
                            label: 'Menu Items',
                            type: 'array',
                            allowAdd: true,
                            allowRemove: true,
                            allowMove: true,
                            addTranslation: 'Add Menu Item',
                            itemTitleRef: 'label',
                            items: {
                                label: {
                                    ref: 'label',
                                    label: 'Label',
                                    type: 'string',
                                    defaultValue: 'New item',
                                },
                                action: {
                                    ref: 'action',
                                    label: 'Action',
                                    type: 'string',
                                    component: 'dropdown',
                                    defaultValue: '',
                                    options: [
                                        { value: '', label: 'Open URL' },
                                        { value: 'bugReport', label: 'Open Bug Report dialog' },
                                    ],
                                },
                                url: {
                                    ref: 'url',
                                    label: 'URL (supports {{template}} fields)',
                                    type: 'string',
                                    defaultValue: 'https://example.com',
                                    show: (item) => item.action !== 'bugReport',
                                },
                                target: {
                                    ref: 'target',
                                    label: 'Link target',
                                    type: 'string',
                                    component: 'dropdown',
                                    defaultValue: '_blank',
                                    options: [
                                        { value: '_blank', label: 'New tab' },
                                        { value: '_self', label: 'Same tab' },
                                    ],
                                    show: (item) => item.action !== 'bugReport',
                                },
                                icon: {
                                    ref: 'icon',
                                    label: 'Icon',
                                    type: 'string',
                                    component: 'dropdown',
                                    defaultValue: 'help',
                                    options: [
                                        { value: 'help', label: 'Help' },
                                        { value: 'info', label: 'Info' },
                                        { value: 'bug', label: 'Bug' },
                                        { value: 'mail', label: 'Mail' },
                                        { value: 'link', label: 'Link' },
                                    ],
                                },

                                // -- Bug Report inline fields --
                                bugReportDivider: {
                                    component: 'text',
                                    label: '── Bug Report Settings ──',
                                    show: (item) => item.action === 'bugReport',
                                },
                                webhookUrl: {
                                    ref: 'bugReport.webhookUrl',
                                    label: 'Webhook URL (POST endpoint)',
                                    type: 'string',
                                    defaultValue: '',
                                    show: (item) => item.action === 'bugReport',
                                },
                                authStrategy: {
                                    ref: 'bugReport.authStrategy',
                                    label: 'Authentication',
                                    type: 'string',
                                    component: 'dropdown',
                                    defaultValue: 'none',
                                    options: [
                                        { value: 'none', label: 'None' },
                                        { value: 'header', label: 'Authorization header' },
                                        { value: 'sense-session', label: 'Sense session (XRF key)' },
                                        { value: 'custom', label: 'Custom headers' },
                                    ],
                                    show: (item) => item.action === 'bugReport',
                                },
                                authToken: {
                                    ref: 'bugReport.authToken',
                                    label: 'Bearer token',
                                    type: 'string',
                                    defaultValue: '',
                                    show: (item) =>
                                        item.action === 'bugReport' &&
                                        item.bugReport?.authStrategy === 'header',
                                },
                                collectFields: {
                                    ref: 'bugReport.collectFields',
                                    label: 'Context fields (comma-separated)',
                                    type: 'string',
                                    defaultValue: 'userName,appId,sheetId,urlPath,platform,timestamp',
                                    show: (item) => item.action === 'bugReport',
                                },
                                dialogTitle: {
                                    ref: 'bugReport.dialogStrings.title',
                                    label: 'Dialog title (empty = auto)',
                                    type: 'string',
                                    defaultValue: '',
                                    show: (item) => item.action === 'bugReport',
                                },

                                // -- Per-item colors --
                                itemColorsHeader: {
                                    component: 'text',
                                    label: '── Item Colors ──',
                                },
                                iconColor: {
                                    ref: 'iconColor',
                                    label: 'Icon',
                                    type: 'object',
                                    component: 'color-picker',
                                    defaultValue: toPickerObj('#165a9b'),
                                },
                                bgColor: {
                                    ref: 'bgColor',
                                    label: 'Background',
                                    type: 'object',
                                    component: 'color-picker',
                                    defaultValue: toPickerObj('#f0f6fc'),
                                },
                                bgColorHover: {
                                    ref: 'bgColorHover',
                                    label: 'Hover background',
                                    type: 'object',
                                    component: 'color-picker',
                                    defaultValue: toPickerObj('#dbeafe'),
                                },
                                textColor: {
                                    ref: 'textColor',
                                    label: 'Text',
                                    type: 'object',
                                    component: 'color-picker',
                                    defaultValue: toPickerObj('#0c3256'),
                                },
                            },
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Template fields reference
                // ---------------------------------------------------------------
                templateFieldsSection: {
                    type: 'items',
                    label: 'Template Fields Reference',
                    items: {
                        templateGeneralHeader: {
                            component: 'text',
                            label: 'URLs and webhook URLs can include these placeholders.',
                        },
                        templateGeneralFields: {
                            component: 'text',
                            label:
                                '── General ──\n' +
                                '{{appId}}  ·  Current app GUID\n' +
                                '{{sheetId}}  ·  Current sheet ID',
                        },
                        templateCmFields: {
                            component: 'text',
                            label:
                                '── Client Managed only ──\n' +
                                '{{userId}}  ·  User ID\n' +
                                '{{userDirectory}}  ·  User directory',
                        },
                    },
                },

                // ---------------------------------------------------------------
                // About (at bottom)
                // ---------------------------------------------------------------
                aboutSection: {
                    type: 'items',
                    label: 'About',
                    items: {
                        headerText: {
                            component: 'text',
                            label: `qs-help-button v${PACKAGE_VERSION}\nConfigurable help button for Qlik Sense.`,
                        },
                        linkGithub: {
                            component: 'link',
                            label: 'GitHub — docs & source',
                            url: 'https://github.com/ptarmiganlabs/qs-help-button',
                        },
                        linkIssues: {
                            component: 'link',
                            label: 'Report a bug / request a feature',
                            url: 'https://github.com/ptarmiganlabs/qs-help-button/issues/new/choose',
                        },
                        linkPtarmigan: {
                            component: 'link',
                            label: 'Ptarmigan Labs',
                            url: 'https://ptarmiganlabs.com',
                        },
                    },
                },
            },
        },
    };
}
