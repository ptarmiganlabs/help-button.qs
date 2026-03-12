/**
 * Default properties for the HelpButton.qs extension.
 *
 * These define the initial state of the extension when first dropped
 * onto a sheet. All values can be overridden via the property panel.
 *
 * Color properties use the Qlik color-picker object format:
 *   { color: '#rrggbb', index: '-1' }
 */

import { toPickerObj } from './util/color';

export default {
    showTitles: false,
    title: 'HelpButton.qs',
    subtitle: '',
    footnote: '',

    // -- Theme preset (default = neutral grey) --
    themePreset: 'default',

    // -- Language override ('auto' = detect from UI) --
    language: 'auto',

    // -- Widget (grid cell) appearance --
    widget: {
        hideHoverMenu: false,
        hideContextMenu: false,
        showAnalysisPlaceholder: true,
        analysisPlaceholderText: '',
    },

    // -- Toolbar button --
    buttonLabel: '',
    buttonTooltip: '',
    buttonIcon: 'help',

    // -- Button colors (color-picker objects) --
    buttonStyle: {
        backgroundColor: toPickerObj('#165a9b'),
        backgroundColorHover: toPickerObj('#12487c'),
        textColor: toPickerObj('#ffffff'),
        borderColor: toPickerObj('#0e3b65'),
        borderRadius: '4px',
    },

    // -- Global bug-report dialog strings (empty = auto-translate) --
    bugReportStrings: {
        title: '',
        descriptionLabel: '',
        descriptionPlaceholder: '',
        submitButton: '',
        cancelButton: '',
        successMessage: '',
        errorMessage: '',
        loadingMessage: '',
        severityLabel: '',
        severityLowLabel: '',
        severityMediumLabel: '',
        severityHighLabel: '',
    },

    // -- Global feedback dialog strings (empty = auto-translate) --
    feedbackStrings: {
        title: '',
        ratingLabel: '',
        commentLabel: '',
        commentPlaceholder: '',
        submitButton: '',
        cancelButton: '',
        successMessage: '',
        errorMessage: '',
    },

    // -- Popup appearance --
    popupTitle: '',
    popupStyle: {
        borderColor: toPickerObj('#0c3256'),
        borderRadius: '8px',
        headerBackgroundColor: toPickerObj('#0c3256'),
        headerTextColor: toPickerObj('#ffcc33'),
        separatorColor: toPickerObj('#e0e0e0'),
    },

    // -- Menu items (bug-report and feedback config is inline per-item) --
    menuItems: [
        {
            label: 'Help documentation',
            url: 'https://github.com/ptarmiganlabs/help-button.qs',
            icon: 'help',
            target: '_blank',
            action: '',
            iconColor: toPickerObj('#165a9b'),
            bgColor: toPickerObj('#f0f6fc'),
            bgColorHover: toPickerObj('#dbeafe'),
            textColor: toPickerObj('#0c3256'),
            bugReport: {
                webhookUrl: '',
                authStrategy: 'none',
                authToken: '',
                enableSeverity: true,
                descriptionMaxLength: 1000,
                dialogFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                payloadFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                dialogStrings: { title: '' },
            },
            feedback: {
                webhookUrl: '',
                authStrategy: 'none',
                authToken: '',
                enableRating: true,
                enableComment: true,
                commentMaxLength: 500,
                dialogFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                payloadFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                dialogStrings: { title: '' },
            },
        },
        {
            label: 'Ptarmigan Labs',
            url: 'https://ptarmiganlabs.com',
            icon: 'link',
            target: '_blank',
            action: '',
            iconColor: toPickerObj('#165a9b'),
            bgColor: toPickerObj('#f0f6fc'),
            bgColorHover: toPickerObj('#dbeafe'),
            textColor: toPickerObj('#0c3256'),
            bugReport: {
                webhookUrl: '',
                authStrategy: 'none',
                authToken: '',
                enableSeverity: true,
                descriptionMaxLength: 1000,
                dialogFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                payloadFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                dialogStrings: { title: '' },
            },
            feedback: {
                webhookUrl: '',
                authStrategy: 'none',
                authToken: '',
                enableRating: true,
                enableComment: true,
                commentMaxLength: 500,
                dialogFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                payloadFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                dialogStrings: { title: '' },
            },
        },
        {
            label: 'Report a bug',
            url: '',
            icon: 'bug',
            target: '_blank',
            action: 'bugReport',
            iconColor: toPickerObj('#dc2626'),
            bgColor: toPickerObj('#fef2f2'),
            bgColorHover: toPickerObj('#fee2e2'),
            textColor: toPickerObj('#7f1d1d'),
            bugReport: {
                webhookUrl: '',
                authStrategy: 'none',
                authToken: '',
                enableSeverity: true,
                descriptionMaxLength: 1000,
                dialogFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                payloadFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                dialogStrings: { title: '' },
            },
            feedback: {
                webhookUrl: '',
                authStrategy: 'none',
                authToken: '',
                enableRating: true,
                enableComment: true,
                commentMaxLength: 500,
                dialogFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                payloadFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                dialogStrings: { title: '' },
            },
        },
        {
            label: 'Give feedback',
            url: '',
            icon: 'star',
            target: '_blank',
            action: 'feedback',
            iconColor: toPickerObj('#7c3aed'),
            bgColor: toPickerObj('#f5f3ff'),
            bgColorHover: toPickerObj('#ede9fe'),
            textColor: toPickerObj('#4c1d95'),
            bugReport: {
                webhookUrl: '',
                authStrategy: 'none',
                authToken: '',
                enableSeverity: true,
                descriptionMaxLength: 1000,
                dialogFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                payloadFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                dialogStrings: { title: '' },
            },
            feedback: {
                webhookUrl: '',
                authStrategy: 'none',
                authToken: '',
                enableRating: true,
                enableComment: true,
                commentMaxLength: 500,
                dialogFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                payloadFields: {
                    userName: true, appId: true, sheetId: true,
                    urlPath: true, platform: true, timestamp: true,
                    userId: false, userDirectory: false, senseVersion: false,
                    browser: false, tenantId: false, status: false,
                    picture: false, preferredZoneinfo: false, roles: false,
                },
                dialogStrings: { title: '' },
            },
        },
    ],
};
