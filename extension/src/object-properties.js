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
import { DEFAULT_DIALOG_FORMAT, DEFAULT_PAYLOAD_FORMAT } from './util/timestamp-formats';

// ---------------------------------------------------------------------------
// Factory functions for menu-item sub-object defaults.
// Each call returns a fresh object tree so that no nested arrays/objects
// (customHeaders, dialogStrings, variableAssignments, etc.) are shared
// between menu items.
// ---------------------------------------------------------------------------
function createDefaultFields() {
    return {
        userName: true, appId: true, sheetId: true,
        urlPath: true, platform: true, timestamp: true,
        userId: false, userDirectory: false, senseVersion: false,
        browser: false, tenantId: false, status: false,
        picture: false, preferredZoneinfo: false, roles: false,
    };
}

function createDefaultPayloadKeyNames() {
    return {
        userName: 'userName', platform: 'platform',
        appId: 'appId', sheetId: 'sheetId',
        urlPath: 'urlPath', timestamp: 'timestamp',
        userId: 'userId', userDirectory: 'userDirectory',
        senseVersion: 'senseVersion', browser: 'browser',
        tenantId: 'tenantId', status: 'status',
        picture: 'picture', preferredZoneinfo: 'preferredZoneinfo',
        roles: 'roles',
    };
}

function createDefaultBugReport() {
    return {
        webhookUrl: '',
        authStrategy: 'none',
        authToken: '',
        customHeaders: [],
        enableSeverity: true,
        descriptionMaxLength: 1000,
        dialogTimestampFormat: DEFAULT_DIALOG_FORMAT,
        payloadTimestampFormat: DEFAULT_PAYLOAD_FORMAT,
        dialogFields: createDefaultFields(),
        payloadFields: createDefaultFields(),
        payloadKeyNames: createDefaultPayloadKeyNames(),
        dialogStrings: { title: '' },
    };
}

function createDefaultFeedback() {
    return {
        webhookUrl: '',
        authStrategy: 'none',
        authToken: '',
        customHeaders: [],
        enableRating: true,
        enableComment: true,
        commentMaxLength: 500,
        dialogTimestampFormat: DEFAULT_DIALOG_FORMAT,
        payloadTimestampFormat: DEFAULT_PAYLOAD_FORMAT,
        dialogFields: createDefaultFields(),
        payloadFields: createDefaultFields(),
        payloadKeyNames: createDefaultPayloadKeyNames(),
        dialogStrings: { title: '' },
    };
}

function createDefaultVariableAction() {
    return {
        mode: 'set',
        variableAssignments: [],
        variableName: '',
        toggleValue1: '',
        toggleValue2: '',
        toggleDefault: '',
    };
}

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
        hideWidget: false,
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

    // -- Tooltips (icon-on-object with hover + click dialog) --
    tooltips: [
        {
            tooltipLabel: 'Sheet title',
            targetType: 'css',
            targetCssSelector: '#sheet-title > header',
            targetObjectId: '',
            showCondition: '',
            iconName: 'info',
            iconSize: 20,
            iconPosition: 'center-right',
            iconColor: toPickerObj('#ffffff'),
            iconBackgroundColor: toPickerObj('#165a9b'),
            hoverContent: 'This is the **sheet name**. Rename it in the sheet properties panel. Click on this icon for more info about navigating between sheets.',
            dialogEnabled: true,
            dialogTitle: 'Sheet Navigation',
            dialogContent:
                'Use the **left** and **right arrows** next to the sheet title to move between sheets.\n\n' +
                'You can also click the **sheet navigator** icon (grid) in the toolbar to jump directly to any sheet in the app.',
            dialogSize: 'medium',
            hoverBackgroundColor: toPickerObj('#ffffff'),
            hoverTextColor: toPickerObj('#1f2937'),
            hoverBorderColor: toPickerObj('#d1d5db'),
            dialogHeaderBackgroundColor: toPickerObj('#f9fafb'),
            dialogHeaderTextColor: toPickerObj('#111827'),
            dialogBodyBackgroundColor: toPickerObj('#ffffff'),
            dialogBodyTextColor: toPickerObj('#374151'),
        },
    ],

    // -- Menu items (nested config created via createDefault*() factories; no shared object trees) --
    menuItems: [
        {
            label: 'Help documentation',
            url: 'https://github.com/ptarmiganlabs/help-button.qs',
            icon: 'help',
            target: '_blank',
            action: 'link',
            iconColor: toPickerObj('#165a9b'),
            bgColor: toPickerObj('#f0f6fc'),
            bgColorHover: toPickerObj('#dbeafe'),
            textColor: toPickerObj('#0c3256'),
            variableAction: createDefaultVariableAction(),
            bugReport: createDefaultBugReport(),
            feedback: createDefaultFeedback(),
        },
        {
            label: 'Ptarmigan Labs',
            url: 'https://ptarmiganlabs.com',
            icon: 'link',
            target: '_blank',
            action: 'link',
            iconColor: toPickerObj('#165a9b'),
            bgColor: toPickerObj('#f0f6fc'),
            bgColorHover: toPickerObj('#dbeafe'),
            textColor: toPickerObj('#0c3256'),
            variableAction: createDefaultVariableAction(),
            bugReport: createDefaultBugReport(),
            feedback: createDefaultFeedback(),
        },
        {
            label: 'Sponsor us on GitHub',
            url: 'https://github.com/sponsors/ptarmiganlabs',
            icon: 'heart',
            target: '_blank',
            action: 'link',
            iconColor: toPickerObj('#db61a2'),
            bgColor: toPickerObj('#fff0f6'),
            bgColorHover: toPickerObj('#ffe0ec'),
            textColor: toPickerObj('#6e3050'),
            variableAction: createDefaultVariableAction(),
            bugReport: createDefaultBugReport(),
            feedback: createDefaultFeedback(),
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
            variableAction: createDefaultVariableAction(),
            bugReport: createDefaultBugReport(),
            feedback: createDefaultFeedback(),
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
            variableAction: createDefaultVariableAction(),
            bugReport: createDefaultBugReport(),
            feedback: createDefaultFeedback(),
        },
    ],
};
