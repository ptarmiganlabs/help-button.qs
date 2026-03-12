/**
 * Property panel definition for HelpButton.qs extension.
 *
 * Section order: Widget → Theme & Styling → Language & Translations → Button → Popup → Menu Items → Template Fields → About
 *
 * @param {object} galaxy - Nebula galaxy object.
 * @returns {object} Extension property panel configuration.
 */

import { PACKAGE_VERSION } from './util/logger';
import { toPickerObj } from './util/color';
import translations from './i18n/translations';
import { PRESET_LABELS, applyPreset } from './theme/presets';

export default function ext(_galaxy) {
    return {
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
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
                    },
                },

                // ---------------------------------------------------------------
                // Theme preset
                // ---------------------------------------------------------------
                themeSection: {
                    type: 'items',
                    label: 'Theme & Styling',
                    items: {
                        themeInfo: {
                            component: 'text',
                            label: 'Select a theme preset to apply a complete color palette. You can still tweak individual colors in the sections below.',
                        },
                        themePreset: {
                            ref: 'themePreset',
                            label: 'Theme preset',
                            type: 'string',
                            component: 'dropdown',
                            defaultValue: 'default',
                            options: [
                                ...Object.entries(PRESET_LABELS).map(([key, label]) => ({
                                    value: key,
                                    label,
                                })),
                            ],
                            change: (data) => {
                                applyPreset(data, data.themePreset);
                            },
                        },
                    },
                },

                // ---------------------------------------------------------------
                // Language & Translations
                // ---------------------------------------------------------------
                languageSection: {
                    component: 'expandable-items',
                    label: 'Language & Translations',
                    items: {
                        // -- Language selection --
                        languageSelection: {
                            type: 'items',
                            label: 'Language Selection',
                            items: {
                                languageInfo: {
                                    component: 'text',
                                    label: 'Auto-detects the Qlik UI language by default. Override here to force a specific locale. Leave text fields empty to use built-in translations.',
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
                            change: function (data) {
                                if (!data._lastLanguage) {
                                    data._lastLanguage = 'auto';
                                }

                                const isAuto = data.language === 'auto';
                                const msg = isAuto
                                    ? 'Setting language to Auto-detect will clear all translated fields to allow automatic translation. Continue?'
                                    : `Setting language to a specific locale will overwrite all translated fields with the standard ${data.language.toUpperCase()} texts. Continue?`;

                                if (window.confirm(msg)) {
                                    data._lastLanguage = data.language;

                                    if (isAuto) {
                                        // Clear all translatable fields
                                        data.buttonLabel = '';
                                        data.buttonTooltip = '';
                                        data.popupTitle = '';
                                        if (data.widget) {
                                            data.widget.analysisPlaceholderText = '';
                                        }
                                        // Global bug-report strings
                                        if (!data.bugReportStrings) data.bugReportStrings = {};
                                        data.bugReportStrings.title = '';
                                        data.bugReportStrings.descriptionLabel = '';
                                        data.bugReportStrings.descriptionPlaceholder = '';
                                        data.bugReportStrings.submitButton = '';
                                        data.bugReportStrings.cancelButton = '';
                                        data.bugReportStrings.successMessage = '';
                                        data.bugReportStrings.errorMessage = '';
                                        data.bugReportStrings.loadingMessage = '';
                                        data.bugReportStrings.severityLabel = '';
                                        data.bugReportStrings.severityLowLabel = '';
                                        data.bugReportStrings.severityMediumLabel = '';
                                        data.bugReportStrings.severityHighLabel = '';
                                        // Global feedback strings
                                        if (!data.feedbackStrings) data.feedbackStrings = {};
                                        data.feedbackStrings.title = '';
                                        data.feedbackStrings.ratingLabel = '';
                                        data.feedbackStrings.commentLabel = '';
                                        data.feedbackStrings.commentPlaceholder = '';
                                        data.feedbackStrings.submitButton = '';
                                        data.feedbackStrings.cancelButton = '';
                                        data.feedbackStrings.successMessage = '';
                                        data.feedbackStrings.errorMessage = '';
                                        // Per-item dialog titles
                                        if (data.menuItems && Array.isArray(data.menuItems)) {
                                            data.menuItems.forEach((item) => {
                                                if (item.action === 'bugReport' && item.bugReport && item.bugReport.dialogStrings) {
                                                    item.bugReport.dialogStrings.title = '';
                                                }
                                                if (item.action === 'feedback' && item.feedback && item.feedback.dialogStrings) {
                                                    item.feedback.dialogStrings.title = '';
                                                }
                                            });
                                        }
                                    } else {
                                        const lang = data.language;
                                        data.buttonLabel = translations.buttonLabel[lang] || '';
                                        data.buttonTooltip = translations.buttonTooltip[lang] || '';
                                        data.popupTitle = translations.popupTitle[lang] || '';

                                        if (!data.widget) data.widget = {};
                                        data.widget.analysisPlaceholderText = translations.analysisPlaceholder[lang] || '';

                                        // Global bug-report strings
                                        if (!data.bugReportStrings) data.bugReportStrings = {};
                                        data.bugReportStrings.title = translations.bugReportTitle[lang] || '';
                                        data.bugReportStrings.descriptionLabel = translations.bugReportDescriptionLabel[lang] || '';
                                        data.bugReportStrings.descriptionPlaceholder = translations.bugReportDescriptionPlaceholder[lang] || '';
                                        data.bugReportStrings.submitButton = translations.bugReportSubmit[lang] || '';
                                        data.bugReportStrings.cancelButton = translations.bugReportCancel[lang] || '';
                                        data.bugReportStrings.successMessage = translations.bugReportSuccessMessage[lang] || '';
                                        data.bugReportStrings.errorMessage = translations.bugReportErrorMessage[lang] || '';
                                        data.bugReportStrings.loadingMessage = translations.bugReportLoadingMessage[lang] || '';
                                        data.bugReportStrings.severityLabel = translations.bugReportSeverityLabel[lang] || '';
                                        data.bugReportStrings.severityLowLabel = translations.bugReportSeverityLowLabel[lang] || '';
                                        data.bugReportStrings.severityMediumLabel = translations.bugReportSeverityMediumLabel[lang] || '';
                                        data.bugReportStrings.severityHighLabel = translations.bugReportSeverityHighLabel[lang] || '';
                                        // Global feedback strings
                                        if (!data.feedbackStrings) data.feedbackStrings = {};
                                        data.feedbackStrings.title = translations.feedbackTitle[lang] || '';
                                        data.feedbackStrings.ratingLabel = translations.feedbackRatingLabel[lang] || '';
                                        data.feedbackStrings.commentLabel = translations.feedbackCommentLabel[lang] || '';
                                        data.feedbackStrings.commentPlaceholder = translations.feedbackCommentPlaceholder[lang] || '';
                                        data.feedbackStrings.submitButton = translations.feedbackSubmit[lang] || '';
                                        data.feedbackStrings.cancelButton = translations.feedbackCancel[lang] || '';
                                        data.feedbackStrings.successMessage = translations.feedbackSuccessMessage[lang] || '';
                                        data.feedbackStrings.errorMessage = translations.feedbackErrorMessage[lang] || '';
                                        // Per-item dialog titles
                                        if (data.menuItems && Array.isArray(data.menuItems)) {
                                            data.menuItems.forEach((item) => {
                                                if (item.action === 'bugReport') {
                                                    if (!item.bugReport) item.bugReport = {};
                                                    if (!item.bugReport.dialogStrings) item.bugReport.dialogStrings = {};
                                                    item.bugReport.dialogStrings.title = translations.bugReportTitle[lang] || '';
                                                }
                                                if (item.action === 'feedback') {
                                                    if (!item.feedback) item.feedback = {};
                                                    if (!item.feedback.dialogStrings) item.feedback.dialogStrings = {};
                                                    item.feedback.dialogStrings.title = translations.feedbackTitle[lang] || '';
                                                }
                                            });
                                        }
                                    }
                                } else {
                                    // Revert the dropdown
                                    data.language = data._lastLanguage;
                                }
                            }
                        },
                            },
                        },

                        // -- Button text --
                        buttonTexts: {
                            type: 'items',
                            label: 'Button',
                            items: {
                                buttonTextsInfo: {
                                    component: 'text',
                                    label: 'Toolbar button text overrides. Leave empty to auto-translate.',
                                },
                                buttonLabel: {
                                    ref: 'buttonLabel',
                                    label: 'Button label',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                buttonTooltip: {
                                    ref: 'buttonTooltip',
                                    label: 'Button tooltip',
                                    type: 'string',
                                    defaultValue: '',
                                },
                            },
                        },

                        // -- Popup text --
                        popupTexts: {
                            type: 'items',
                            label: 'Popup',
                            items: {
                                popupTitle: {
                                    ref: 'popupTitle',
                                    label: 'Popup heading',
                                    type: 'string',
                                    defaultValue: '',
                                },
                            },
                        },

                        // -- Bug Report Dialog strings --
                        bugReportTexts: {
                            type: 'items',
                            label: 'Bug Report Dialog',
                            items: {
                                bugReportTextsInfo: {
                                    component: 'text',
                                    label: 'Overrides for the bug-report dialog. Leave empty to auto-translate.',
                                },
                                brTitle: {
                                    ref: 'bugReportStrings.title',
                                    label: 'Dialog title',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brDescriptionLabel: {
                                    ref: 'bugReportStrings.descriptionLabel',
                                    label: 'Description field label',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brDescriptionPlaceholder: {
                                    ref: 'bugReportStrings.descriptionPlaceholder',
                                    label: 'Description placeholder',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brSubmitButton: {
                                    ref: 'bugReportStrings.submitButton',
                                    label: 'Submit button text',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brCancelButton: {
                                    ref: 'bugReportStrings.cancelButton',
                                    label: 'Cancel button text',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brSuccessMessage: {
                                    ref: 'bugReportStrings.successMessage',
                                    label: 'Success message',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brErrorMessage: {
                                    ref: 'bugReportStrings.errorMessage',
                                    label: 'Error message',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brLoadingMessage: {
                                    ref: 'bugReportStrings.loadingMessage',
                                    label: 'Loading message',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brSeverityLabel: {
                                    ref: 'bugReportStrings.severityLabel',
                                    label: 'Severity field label',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brSeverityLowLabel: {
                                    ref: 'bugReportStrings.severityLowLabel',
                                    label: 'Severity option: Low',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brSeverityMediumLabel: {
                                    ref: 'bugReportStrings.severityMediumLabel',
                                    label: 'Severity option: Medium',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                brSeverityHighLabel: {
                                    ref: 'bugReportStrings.severityHighLabel',
                                    label: 'Severity option: High',
                                    type: 'string',
                                    defaultValue: '',
                                },
                            },
                        },

                        // -- Feedback Dialog strings --
                        feedbackTexts: {
                            type: 'items',
                            label: 'Feedback Dialog',
                            items: {
                                feedbackTextsInfo: {
                                    component: 'text',
                                    label: 'Overrides for the feedback dialog. Leave empty to auto-translate.',
                                },
                                fbTitle: {
                                    ref: 'feedbackStrings.title',
                                    label: 'Dialog title',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                fbRatingLabel: {
                                    ref: 'feedbackStrings.ratingLabel',
                                    label: 'Rating label',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                fbCommentLabel: {
                                    ref: 'feedbackStrings.commentLabel',
                                    label: 'Comment field label',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                fbCommentPlaceholder: {
                                    ref: 'feedbackStrings.commentPlaceholder',
                                    label: 'Comment placeholder',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                fbSubmitButton: {
                                    ref: 'feedbackStrings.submitButton',
                                    label: 'Submit button text',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                fbCancelButton: {
                                    ref: 'feedbackStrings.cancelButton',
                                    label: 'Cancel button text',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                fbSuccessMessage: {
                                    ref: 'feedbackStrings.successMessage',
                                    label: 'Success message',
                                    type: 'string',
                                    defaultValue: '',
                                },
                                fbErrorMessage: {
                                    ref: 'feedbackStrings.errorMessage',
                                    label: 'Error message',
                                    type: 'string',
                                    defaultValue: '',
                                },
                            },
                        },

                        // -- General texts --
                        generalTexts: {
                            type: 'items',
                            label: 'General',
                            items: {
                                analysisPlaceholderText: {
                                    ref: 'widget.analysisPlaceholderText',
                                    label: 'Analysis-mode placeholder text',
                                    type: 'string',
                                    defaultValue: '',
                                    show: (layout) => layout.widget?.showAnalysisPlaceholder !== false,
                                },
                            },
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
                        popupColorsHeader: {
                            component: 'text',
                            label: 'Popup colors',
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
                                        { value: 'feedback', label: 'Open Feedback dialog' },
                                    ],
                                },
                                url: {
                                    ref: 'url',
                                    label: 'URL (supports {{template}} fields)',
                                    type: 'string',
                                    defaultValue: 'https://example.com',
                                    show: (item) => !['bugReport', 'feedback'].includes(item.action),
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
                                    show: (item) => !['bugReport', 'feedback'].includes(item.action),
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
                                        { value: 'star', label: 'Star' },
                                    ],
                                },

                                // -- Bug Report Settings (expandable) --
                                bugReportSettings: {
                                    component: 'expandable-items',
                                    label: 'Bug Report Settings',
                                    show: (item) => item.action === 'bugReport',
                                    items: {
                                        bugReportMain: {
                                            type: 'items',
                                            label: 'Webhook & Auth',
                                            items: {
                                                webhookUrl: {
                                                    ref: 'bugReport.webhookUrl',
                                                    label: 'Webhook URL (POST endpoint)',
                                                    type: 'string',
                                                    defaultValue: '',
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
                                                },
                                                authToken: {
                                                    ref: 'bugReport.authToken',
                                                    label: 'Bearer token',
                                                    type: 'string',
                                                    defaultValue: '',
                                                    show: (item) => item.bugReport?.authStrategy === 'header',
                                                },
                                            },
                                        },
                                        bugReportDialog: {
                                            type: 'items',
                                            label: 'Dialog Options',
                                            items: {
                                                brEnableSeverity: {
                                                    ref: 'bugReport.enableSeverity',
                                                    label: 'Show severity picker (Low / Medium / High)',
                                                    type: 'boolean',
                                                    component: 'switch',
                                                    defaultValue: true,
                                                    options: [
                                                        { value: true, label: 'On' },
                                                        { value: false, label: 'Off' },
                                                    ],
                                                },
                                                brDescriptionMaxLength: {
                                                    ref: 'bugReport.descriptionMaxLength',
                                                    label: 'Max description length (characters)',
                                                    type: 'number',
                                                    defaultValue: 1000,
                                                },
                                                brDialogTitle: {
                                                    ref: 'bugReport.dialogStrings.title',
                                                    label: 'Dialog title override (overrides global)',
                                                    type: 'string',
                                                    defaultValue: '',
                                                },
                                            },
                                        },
                                        brDialogFieldsSection: {
                                            type: 'items',
                                            label: 'Show in Dialog',
                                            items: {
                                                brDfInfo: { component: 'text', label: 'Fields visible to the user in the bug report dialog.' },
                                                brDfUserName:   { ref: 'bugReport.dialogFields.userName',   label: 'User Name',   type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfPlatform:   { ref: 'bugReport.dialogFields.platform',   label: 'Platform',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfAppId:      { ref: 'bugReport.dialogFields.appId',      label: 'App ID',      type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfSheetId:    { ref: 'bugReport.dialogFields.sheetId',    label: 'Sheet ID',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfUrlPath:    { ref: 'bugReport.dialogFields.urlPath',    label: 'URL Path',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfTimestamp:  { ref: 'bugReport.dialogFields.timestamp',  label: 'Timestamp',   type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfUserId:     { ref: 'bugReport.dialogFields.userId',     label: 'User ID',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfUserDir:    { ref: 'bugReport.dialogFields.userDirectory', label: 'User Directory', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfSenseVer:   { ref: 'bugReport.dialogFields.senseVersion', label: 'Qlik Sense Version', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfBrowser:    { ref: 'bugReport.dialogFields.browser',    label: 'Browser',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfTenantId:   { ref: 'bugReport.dialogFields.tenantId',   label: 'Tenant ID',   type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfStatus:     { ref: 'bugReport.dialogFields.status',     label: 'Status',      type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfPicture:    { ref: 'bugReport.dialogFields.picture',    label: 'Picture',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfZoneinfo:   { ref: 'bugReport.dialogFields.preferredZoneinfo', label: 'Preferred Zone Info', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brDfRoles:      { ref: 'bugReport.dialogFields.roles',      label: 'Roles',       type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                            },
                                        },
                                        brPayloadFieldsSection: {
                                            type: 'items',
                                            label: 'Include in Payload',
                                            items: {
                                                brPfInfo: { component: 'text', label: 'Fields included in the webhook POST payload (may differ from dialog).' },
                                                brPfUserName:   { ref: 'bugReport.payloadFields.userName',   label: 'User Name',   type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfPlatform:   { ref: 'bugReport.payloadFields.platform',   label: 'Platform',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfAppId:      { ref: 'bugReport.payloadFields.appId',      label: 'App ID',      type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfSheetId:    { ref: 'bugReport.payloadFields.sheetId',    label: 'Sheet ID',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfUrlPath:    { ref: 'bugReport.payloadFields.urlPath',    label: 'URL Path',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfTimestamp:  { ref: 'bugReport.payloadFields.timestamp',  label: 'Timestamp',   type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfUserId:     { ref: 'bugReport.payloadFields.userId',     label: 'User ID',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfUserDir:    { ref: 'bugReport.payloadFields.userDirectory', label: 'User Directory', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfSenseVer:   { ref: 'bugReport.payloadFields.senseVersion', label: 'Qlik Sense Version', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfBrowser:    { ref: 'bugReport.payloadFields.browser',    label: 'Browser',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfTenantId:   { ref: 'bugReport.payloadFields.tenantId',   label: 'Tenant ID',   type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfStatus:     { ref: 'bugReport.payloadFields.status',     label: 'Status',      type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfPicture:    { ref: 'bugReport.payloadFields.picture',    label: 'Picture',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfZoneinfo:   { ref: 'bugReport.payloadFields.preferredZoneinfo', label: 'Preferred Zone Info', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                brPfRoles:      { ref: 'bugReport.payloadFields.roles',      label: 'Roles',       type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                            },
                                        },
                                    },
                                },

                                // -- Feedback Settings (expandable) --
                                feedbackSettings: {
                                    component: 'expandable-items',
                                    label: 'Feedback Settings',
                                    show: (item) => item.action === 'feedback',
                                    items: {
                                        feedbackMain: {
                                            type: 'items',
                                            label: 'Webhook & Auth',
                                            items: {
                                                feedbackWebhookUrl: {
                                                    ref: 'feedback.webhookUrl',
                                                    label: 'Webhook URL (POST endpoint)',
                                                    type: 'string',
                                                    defaultValue: '',
                                                },
                                                feedbackAuthStrategy: {
                                                    ref: 'feedback.authStrategy',
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
                                                },
                                                feedbackAuthToken: {
                                                    ref: 'feedback.authToken',
                                                    label: 'Bearer token',
                                                    type: 'string',
                                                    defaultValue: '',
                                                    show: (item) => item.feedback?.authStrategy === 'header',
                                                },
                                            },
                                        },
                                        feedbackDialog: {
                                            type: 'items',
                                            label: 'Dialog Options',
                                            items: {
                                                feedbackEnableRating: {
                                                    ref: 'feedback.enableRating',
                                                    label: 'Show star rating (1-5)',
                                                    type: 'boolean',
                                                    component: 'switch',
                                                    defaultValue: true,
                                                    options: [
                                                        { value: true, label: 'On' },
                                                        { value: false, label: 'Off' },
                                                    ],
                                                },
                                                feedbackEnableComment: {
                                                    ref: 'feedback.enableComment',
                                                    label: 'Show free-text comment field',
                                                    type: 'boolean',
                                                    component: 'switch',
                                                    defaultValue: true,
                                                    options: [
                                                        { value: true, label: 'On' },
                                                        { value: false, label: 'Off' },
                                                    ],
                                                },
                                                feedbackCommentMaxLength: {
                                                    ref: 'feedback.commentMaxLength',
                                                    label: 'Max comment length (characters)',
                                                    type: 'number',
                                                    defaultValue: 500,
                                                    show: (item) => item.feedback?.enableComment !== false,
                                                },
                                                feedbackDialogTitle: {
                                                    ref: 'feedback.dialogStrings.title',
                                                    label: 'Dialog title override (overrides global)',
                                                    type: 'string',
                                                    defaultValue: '',
                                                },
                                            },
                                        },
                                        dialogFieldsSection: {
                                            type: 'items',
                                            label: 'Show in Dialog',
                                            items: {
                                                dfInfo: { component: 'text', label: 'Fields visible to the user in the feedback dialog.' },
                                                dfUserName:   { ref: 'feedback.dialogFields.userName',   label: 'User Name',   type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfPlatform:   { ref: 'feedback.dialogFields.platform',   label: 'Platform',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfAppId:      { ref: 'feedback.dialogFields.appId',      label: 'App ID',      type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfSheetId:    { ref: 'feedback.dialogFields.sheetId',    label: 'Sheet ID',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfUrlPath:    { ref: 'feedback.dialogFields.urlPath',    label: 'URL Path',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfTimestamp:  { ref: 'feedback.dialogFields.timestamp',  label: 'Timestamp',   type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfUserId:     { ref: 'feedback.dialogFields.userId',     label: 'User ID',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfUserDir:    { ref: 'feedback.dialogFields.userDirectory', label: 'User Directory', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfSenseVer:   { ref: 'feedback.dialogFields.senseVersion', label: 'Qlik Sense Version', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfBrowser:    { ref: 'feedback.dialogFields.browser',    label: 'Browser',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfTenantId:   { ref: 'feedback.dialogFields.tenantId',   label: 'Tenant ID',   type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfStatus:     { ref: 'feedback.dialogFields.status',     label: 'Status',      type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfPicture:    { ref: 'feedback.dialogFields.picture',    label: 'Picture',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfZoneinfo:   { ref: 'feedback.dialogFields.preferredZoneinfo', label: 'Preferred Zone Info', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                dfRoles:      { ref: 'feedback.dialogFields.roles',      label: 'Roles',       type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                            },
                                        },
                                        payloadFieldsSection: {
                                            type: 'items',
                                            label: 'Include in Payload',
                                            items: {
                                                pfInfo: { component: 'text', label: 'Fields included in the webhook POST payload (may differ from dialog).' },
                                                pfUserName:   { ref: 'feedback.payloadFields.userName',   label: 'User Name',   type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfPlatform:   { ref: 'feedback.payloadFields.platform',   label: 'Platform',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfAppId:      { ref: 'feedback.payloadFields.appId',      label: 'App ID',      type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfSheetId:    { ref: 'feedback.payloadFields.sheetId',    label: 'Sheet ID',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfUrlPath:    { ref: 'feedback.payloadFields.urlPath',    label: 'URL Path',    type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfTimestamp:  { ref: 'feedback.payloadFields.timestamp',  label: 'Timestamp',   type: 'boolean', component: 'switch', defaultValue: true,  options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfUserId:     { ref: 'feedback.payloadFields.userId',     label: 'User ID',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfUserDir:    { ref: 'feedback.payloadFields.userDirectory', label: 'User Directory', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfSenseVer:   { ref: 'feedback.payloadFields.senseVersion', label: 'Qlik Sense Version', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfBrowser:    { ref: 'feedback.payloadFields.browser',    label: 'Browser',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfTenantId:   { ref: 'feedback.payloadFields.tenantId',   label: 'Tenant ID',   type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfStatus:     { ref: 'feedback.payloadFields.status',     label: 'Status',      type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfPicture:    { ref: 'feedback.payloadFields.picture',    label: 'Picture',     type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfZoneinfo:   { ref: 'feedback.payloadFields.preferredZoneinfo', label: 'Preferred Zone Info', type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                                pfRoles:      { ref: 'feedback.payloadFields.roles',      label: 'Roles',       type: 'boolean', component: 'switch', defaultValue: false, options: [{ value: true, label: 'On' }, { value: false, label: 'Off' }] },
                                            },
                                        },
                                    },
                                },

                                // -- Per-item colors (expandable) --
                                itemColors: {
                                    component: 'expandable-items',
                                    label: 'Item Colors',
                                    items: {
                                        itemColorsMain: {
                                            type: 'items',
                                            label: 'Colors',
                                            items: {
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
                        templateIntro: {
                            component: 'text',
                            label: 'Use these placeholders in URLs and webhook URLs. They are replaced at runtime with actual values.',
                        },
                        templateHeaderGeneral: {
                            component: 'text',
                            label: '── General ──',
                        },
                        templateAppId: {
                            component: 'text',
                            label: '{{appId}} — Current app GUID',
                        },
                        templateSheetId: {
                            component: 'text',
                            label: '{{sheetId}} — Current sheet ID',
                        },
                        templateHeaderCm: {
                            component: 'text',
                            label: '── Client Managed only ──',
                        },
                        templateUserId: {
                            component: 'text',
                            label: '{{userId}} — User ID',
                        },
                        templateUserDir: {
                            component: 'text',
                            label: '{{userDirectory}} — User directory',
                        },
                        templateHeaderExample: {
                            component: 'text',
                            label: '── Example ──',
                        },
                        templateExample: {
                            component: 'text',
                            label: 'https://jira.example.com/create?app={{appId}}&user={{userId}}',
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
                            label: `HelpButton.qs v${PACKAGE_VERSION}\nConfigurable help button for Qlik Sense.`,
                        },
                        linkGithub: {
                            component: 'link',
                            label: 'GitHub — docs & source',
                            url: 'https://github.com/ptarmiganlabs/help-button.qs',
                        },
                        linkIssues: {
                            component: 'link',
                            label: 'Report a bug / request a feature',
                            url: 'https://github.com/ptarmiganlabs/help-button.qs/issues/new/choose',
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
