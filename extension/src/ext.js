/**
 * Property panel definition for qs-help-button extension.
 *
 * @param {object} galaxy - Nebula galaxy object.
 * @returns {object} Extension property panel configuration.
 */

import { PACKAGE_VERSION } from './util/logger';

export default function ext(_galaxy) {
    return {
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
                // ---------------------------------------------------------------
                // Header / About section
                // ---------------------------------------------------------------
                headerSection: {
                    type: 'items',
                    label: 'About',
                    items: {
                        headerText: {
                            component: 'text',
                            label: `qs-help-button v${PACKAGE_VERSION}\nby Ptarmigan Labs`,
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Button appearance
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
                        buttonBgColor: {
                            ref: 'buttonStyle.backgroundColor',
                            label: 'Button background color',
                            type: 'string',
                            defaultValue: '#165a9b',
                        },
                        buttonHoverBgColor: {
                            ref: 'buttonStyle.backgroundColorHover',
                            label: 'Button hover color',
                            type: 'string',
                            defaultValue: '#12487c',
                        },
                        buttonTextColor: {
                            ref: 'buttonStyle.textColor',
                            label: 'Button text color',
                            type: 'string',
                            defaultValue: '#ffffff',
                        },
                        buttonBorderColor: {
                            ref: 'buttonStyle.borderColor',
                            label: 'Button border color',
                            type: 'string',
                            defaultValue: '#0e3b65',
                        },
                        buttonBorderRadius: {
                            ref: 'buttonStyle.borderRadius',
                            label: 'Button border radius',
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
                        popupBgColor: {
                            ref: 'popupStyle.backgroundColor',
                            label: 'Popup background color',
                            type: 'string',
                            defaultValue: '#ffffff',
                        },
                        popupBorderColor: {
                            ref: 'popupStyle.borderColor',
                            label: 'Popup border color',
                            type: 'string',
                            defaultValue: '#0c3256',
                        },
                        popupBorderRadius: {
                            ref: 'popupStyle.borderRadius',
                            label: 'Popup border radius',
                            type: 'string',
                            defaultValue: '8px',
                        },
                        popupHeaderBgColor: {
                            ref: 'popupStyle.headerBackgroundColor',
                            label: 'Header background color',
                            type: 'string',
                            defaultValue: '#0c3256',
                        },
                        popupHeaderTextColor: {
                            ref: 'popupStyle.headerTextColor',
                            label: 'Header text color',
                            type: 'string',
                            defaultValue: '#ffcc33',
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Menu items
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
                                url: {
                                    ref: 'url',
                                    label: 'URL (supports {{appId}}, {{sheetId}}, {{userId}}, {{userDirectory}})',
                                    type: 'string',
                                    defaultValue: 'https://example.com',
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
                                iconColor: {
                                    ref: 'iconColor',
                                    label: 'Icon color',
                                    type: 'string',
                                    defaultValue: '#165a9b',
                                },
                                bgColor: {
                                    ref: 'bgColor',
                                    label: 'Background color',
                                    type: 'string',
                                    defaultValue: '#f0f6fc',
                                },
                                bgColorHover: {
                                    ref: 'bgColorHover',
                                    label: 'Hover background color',
                                    type: 'string',
                                    defaultValue: '#dbeafe',
                                },
                                textColor: {
                                    ref: 'textColor',
                                    label: 'Text color',
                                    type: 'string',
                                    defaultValue: '#0c3256',
                                },
                            },
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Bug Report
                // ---------------------------------------------------------------
                bugReportSection: {
                    type: 'items',
                    label: 'Bug Report',
                    items: {
                        bugReportEnabled: {
                            ref: 'bugReport.enabled',
                            label: 'Enable bug report feature',
                            type: 'boolean',
                            defaultValue: false,
                        },
                        bugReportWebhookUrl: {
                            ref: 'bugReport.webhookUrl',
                            label: 'Webhook URL (POST endpoint)',
                            type: 'string',
                            defaultValue: '',
                            show: (layout) => layout.bugReport?.enabled,
                        },
                        bugReportAuthStrategy: {
                            ref: 'bugReport.authStrategy',
                            label: 'Authentication strategy',
                            type: 'string',
                            component: 'dropdown',
                            defaultValue: 'none',
                            options: [
                                { value: 'none', label: 'None' },
                                { value: 'header', label: 'Authorization header' },
                                { value: 'sense-session', label: 'Sense session (XRF key)' },
                                { value: 'custom', label: 'Custom headers' },
                            ],
                            show: (layout) => layout.bugReport?.enabled,
                        },
                        bugReportAuthToken: {
                            ref: 'bugReport.authToken',
                            label: 'Bearer token',
                            type: 'string',
                            defaultValue: '',
                            show: (layout) =>
                                layout.bugReport?.enabled &&
                                layout.bugReport?.authStrategy === 'header',
                        },
                        bugReportCollectFields: {
                            ref: 'bugReport.collectFields',
                            label: 'Context fields (comma separated: userName, appId, sheetId, urlPath, platform, browser, timestamp)',
                            type: 'string',
                            defaultValue: 'userName,appId,sheetId,urlPath,platform,timestamp',
                            show: (layout) => layout.bugReport?.enabled,
                        },
                        bugReportDialogTitle: {
                            ref: 'bugReport.dialogStrings.title',
                            label: 'Dialog title (empty = auto-translate)',
                            type: 'string',
                            defaultValue: '',
                            show: (layout) => layout.bugReport?.enabled,
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
                        templateInfo: {
                            component: 'text',
                            label:
                                'URLs can use these placeholders:\n' +
                                '{{appId}} — Current app GUID\n' +
                                '{{sheetId}} — Current sheet ID\n' +
                                '{{userId}} — User ID (CM only)\n' +
                                '{{userDirectory}} — User directory (CM only)',
                        },
                    },
                },
            },
        },
    };
}
