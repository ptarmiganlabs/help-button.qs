/**
 * Default properties for the qs-help-button extension.
 *
 * These define the initial state of the extension when first dropped
 * onto a sheet. All values can be overridden via the property panel.
 */
export default {
    showTitles: false,
    title: 'Help Button',
    subtitle: '',
    footnote: '',

    // -- Toolbar button --
    buttonLabel: '',
    buttonTooltip: '',
    buttonIcon: 'help',

    // -- Button colors --
    buttonStyle: {
        backgroundColor: '#165a9b',
        backgroundColorHover: '#12487c',
        backgroundColorActive: '#0e3b65',
        textColor: '#ffffff',
        borderColor: '#0e3b65',
        borderRadius: '4px',
        focusOutlineColor: 'rgba(255, 204, 51, 0.6)',
    },

    // -- Popup appearance --
    popupTitle: '',
    popupStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#0c3256',
        borderRadius: '8px',
        headerBackgroundColor: '#0c3256',
        headerTextColor: '#ffcc33',
        separatorColor: '#e0e0e0',
        shadowColor: 'rgba(12, 50, 86, 0.25)',
    },

    // -- Menu items --
    menuItems: [
        {
            label: 'Help documentation',
            url: 'https://help.example.com',
            icon: 'help',
            target: '_blank',
            action: '',
            iconColor: '#165a9b',
            bgColor: '#f0f6fc',
            bgColorHover: '#dbeafe',
            textColor: '#0c3256',
        },
    ],

    // -- Bug report --
    bugReport: {
        enabled: false,
        webhookUrl: '',
        authStrategy: 'none',
        authToken: '',
        authHeaderName: 'Authorization',
        authHeaderValue: '',
        customHeaders: {},
        collectFields: ['userName', 'appId', 'sheetId', 'urlPath', 'platform', 'timestamp'],
        dialogStrings: {
            title: '',
            descriptionLabel: '',
            descriptionPlaceholder: '',
            submitButton: '',
            cancelButton: '',
            successMessage: '',
            errorMessage: '',
            contextHeader: '',
        },
    },
};
