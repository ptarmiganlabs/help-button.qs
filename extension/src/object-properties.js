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

    // -- Theme preset (empty = custom / no preset) --
    themePreset: '',

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

    // -- Popup appearance --
    popupTitle: '',
    popupStyle: {
        borderColor: toPickerObj('#0c3256'),
        borderRadius: '8px',
        headerBackgroundColor: toPickerObj('#0c3256'),
        headerTextColor: toPickerObj('#ffcc33'),
        separatorColor: toPickerObj('#e0e0e0'),
    },

    // -- Menu items (bug-report config is inline per-item) --
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
                collectFields: 'userName,appId,sheetId,urlPath,platform,timestamp',
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
                collectFields: 'userName,appId,sheetId,urlPath,platform,timestamp',
                dialogStrings: { title: '' },
            },
        },
    ],
};
