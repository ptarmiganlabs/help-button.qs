/**
 * Language & Translations — property panel section.
 *
 * @module property-panel/language-section
 */

import translations from "../i18n/translations";

const languageSection = {
  // not necessary to define the type, component "expandable-items" will automatically
  // default to "items"
  // type: 'items'
  component: "expandable-items",
  label: "Language & Translations",
  items: {
    // -- Language selection --
    languageSelection: {
      type: "items",
      label: "Language Selection",
      items: {
        languageInfo: {
          component: "text",
          label:
            "Auto-detects the Qlik UI language by default. Override here to force a specific locale. Leave text fields empty to use built-in translations.",
        },
        language: {
          ref: "language",
          label: "Language",
          type: "string",
          component: "dropdown",
          defaultValue: "auto",
          options: [
            { value: "auto", label: "Auto-detect" },
            { value: "en", label: "English" },
            { value: "sv", label: "Svenska" },
            { value: "no", label: "Norsk" },
            { value: "da", label: "Dansk" },
            { value: "fi", label: "Suomi" },
            { value: "de", label: "Deutsch" },
            { value: "fr", label: "Français" },
            { value: "pl", label: "Polski" },
            { value: "es", label: "Español" },
          ],
          change: function (data) {
            if (!data._lastLanguage) {
              data._lastLanguage = "auto";
            }

            const isAuto = data.language === "auto";
            const msg = isAuto
              ? "Setting language to Auto-detect will clear all translated fields to allow automatic translation. Continue?"
              : `Setting language to a specific locale will overwrite all translated fields with the standard ${data.language.toUpperCase()} texts. Continue?`;

            if (window.confirm(msg)) {
              data._lastLanguage = data.language;

              if (isAuto) {
                // Clear all translatable fields
                data.buttonLabel = "";
                data.buttonTooltip = "";
                data.popupTitle = "";
                if (data.widget) {
                  data.widget.analysisPlaceholderText = "";
                }
                // Global bug-report strings
                if (!data.bugReportStrings) data.bugReportStrings = {};
                data.bugReportStrings.title = "";
                data.bugReportStrings.descriptionLabel = "";
                data.bugReportStrings.descriptionPlaceholder = "";
                data.bugReportStrings.submitButton = "";
                data.bugReportStrings.cancelButton = "";
                data.bugReportStrings.successMessage = "";
                data.bugReportStrings.errorMessage = "";
                data.bugReportStrings.loadingMessage = "";
                data.bugReportStrings.severityLabel = "";
                data.bugReportStrings.severityLowLabel = "";
                data.bugReportStrings.severityMediumLabel = "";
                data.bugReportStrings.severityHighLabel = "";
                // Global feedback strings
                if (!data.feedbackStrings) data.feedbackStrings = {};
                data.feedbackStrings.title = "";
                data.feedbackStrings.ratingLabel = "";
                data.feedbackStrings.commentLabel = "";
                data.feedbackStrings.commentPlaceholder = "";
                data.feedbackStrings.submitButton = "";
                data.feedbackStrings.cancelButton = "";
                data.feedbackStrings.successMessage = "";
                data.feedbackStrings.errorMessage = "";
                // Per-item dialog titles
                if (data.menuItems && Array.isArray(data.menuItems)) {
                  data.menuItems.forEach((item) => {
                    if (
                      item.action === "bugReport" &&
                      item.bugReport &&
                      item.bugReport.dialogStrings
                    ) {
                      item.bugReport.dialogStrings.title = "";
                    }
                    if (
                      item.action === "feedback" &&
                      item.feedback &&
                      item.feedback.dialogStrings
                    ) {
                      item.feedback.dialogStrings.title = "";
                    }
                  });
                }
              } else {
                const lang = data.language;
                data.buttonLabel = translations.buttonLabel[lang] || "";
                data.buttonTooltip = translations.buttonTooltip[lang] || "";
                data.popupTitle = translations.popupTitle[lang] || "";

                if (!data.widget) data.widget = {};
                data.widget.analysisPlaceholderText =
                  translations.analysisPlaceholder[lang] || "";

                // Global bug-report strings
                if (!data.bugReportStrings) data.bugReportStrings = {};
                data.bugReportStrings.title =
                  translations.bugReportTitle[lang] || "";
                data.bugReportStrings.descriptionLabel =
                  translations.bugReportDescriptionLabel[lang] || "";
                data.bugReportStrings.descriptionPlaceholder =
                  translations.bugReportDescriptionPlaceholder[lang] || "";
                data.bugReportStrings.submitButton =
                  translations.bugReportSubmit[lang] || "";
                data.bugReportStrings.cancelButton =
                  translations.bugReportCancel[lang] || "";
                data.bugReportStrings.successMessage =
                  translations.bugReportSuccessMessage[lang] || "";
                data.bugReportStrings.errorMessage =
                  translations.bugReportErrorMessage[lang] || "";
                data.bugReportStrings.loadingMessage =
                  translations.bugReportLoadingMessage[lang] || "";
                data.bugReportStrings.severityLabel =
                  translations.bugReportSeverityLabel[lang] || "";
                data.bugReportStrings.severityLowLabel =
                  translations.bugReportSeverityLowLabel[lang] || "";
                data.bugReportStrings.severityMediumLabel =
                  translations.bugReportSeverityMediumLabel[lang] || "";
                data.bugReportStrings.severityHighLabel =
                  translations.bugReportSeverityHighLabel[lang] || "";
                // Global feedback strings
                if (!data.feedbackStrings) data.feedbackStrings = {};
                data.feedbackStrings.title =
                  translations.feedbackTitle[lang] || "";
                data.feedbackStrings.ratingLabel =
                  translations.feedbackRatingLabel[lang] || "";
                data.feedbackStrings.commentLabel =
                  translations.feedbackCommentLabel[lang] || "";
                data.feedbackStrings.commentPlaceholder =
                  translations.feedbackCommentPlaceholder[lang] || "";
                data.feedbackStrings.submitButton =
                  translations.feedbackSubmit[lang] || "";
                data.feedbackStrings.cancelButton =
                  translations.feedbackCancel[lang] || "";
                data.feedbackStrings.successMessage =
                  translations.feedbackSuccessMessage[lang] || "";
                data.feedbackStrings.errorMessage =
                  translations.feedbackErrorMessage[lang] || "";
                // Per-item dialog titles
                if (data.menuItems && Array.isArray(data.menuItems)) {
                  data.menuItems.forEach((item) => {
                    if (item.action === "bugReport") {
                      if (!item.bugReport) item.bugReport = {};
                      if (!item.bugReport.dialogStrings)
                        item.bugReport.dialogStrings = {};
                      item.bugReport.dialogStrings.title =
                        translations.bugReportTitle[lang] || "";
                    }
                    if (item.action === "feedback") {
                      if (!item.feedback) item.feedback = {};
                      if (!item.feedback.dialogStrings)
                        item.feedback.dialogStrings = {};
                      item.feedback.dialogStrings.title =
                        translations.feedbackTitle[lang] || "";
                    }
                  });
                }
              }
            } else {
              // Revert the dropdown
              data.language = data._lastLanguage;
            }
          },
        },
      },
    },

    // -- Button text --
    buttonTexts: {
      type: "items",
      label: "Button",
      items: {
        buttonTextsInfo: {
          component: "text",
          label:
            "Toolbar button text overrides. Leave empty to auto-translate.",
        },
        buttonLabel: {
          ref: "buttonLabel",
          label: "Button label",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        buttonTooltip: {
          ref: "buttonTooltip",
          label: "Button tooltip",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
      },
    },

    // -- Popup text --
    popupTexts: {
      type: "items",
      label: "Popup",
      items: {
        popupTitle: {
          ref: "popupTitle",
          label: "Popup heading",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
      },
    },

    // -- Bug Report Dialog strings --
    bugReportTexts: {
      type: "items",
      label: "Bug Report Dialog",
      items: {
        bugReportTextsInfo: {
          component: "text",
          label:
            "Overrides for the bug-report dialog. Leave empty to auto-translate.",
        },
        brTitle: {
          ref: "bugReportStrings.title",
          label: "Dialog title",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brDescriptionLabel: {
          ref: "bugReportStrings.descriptionLabel",
          label: "Description field label",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brDescriptionPlaceholder: {
          ref: "bugReportStrings.descriptionPlaceholder",
          label: "Description placeholder",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brSubmitButton: {
          ref: "bugReportStrings.submitButton",
          label: "Submit button text",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brCancelButton: {
          ref: "bugReportStrings.cancelButton",
          label: "Cancel button text",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brSuccessMessage: {
          ref: "bugReportStrings.successMessage",
          label: "Success message",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brErrorMessage: {
          ref: "bugReportStrings.errorMessage",
          label: "Error message",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brLoadingMessage: {
          ref: "bugReportStrings.loadingMessage",
          label: "Loading message",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brSeverityLabel: {
          ref: "bugReportStrings.severityLabel",
          label: "Severity field label",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brSeverityLowLabel: {
          ref: "bugReportStrings.severityLowLabel",
          label: "Severity option: Low",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brSeverityMediumLabel: {
          ref: "bugReportStrings.severityMediumLabel",
          label: "Severity option: Medium",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        brSeverityHighLabel: {
          ref: "bugReportStrings.severityHighLabel",
          label: "Severity option: High",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
      },
    },

    // -- Feedback Dialog strings --
    feedbackTexts: {
      type: "items",
      label: "Feedback Dialog",
      items: {
        feedbackTextsInfo: {
          component: "text",
          label:
            "Overrides for the feedback dialog. Leave empty to auto-translate.",
        },
        fbTitle: {
          ref: "feedbackStrings.title",
          label: "Dialog title",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        fbRatingLabel: {
          ref: "feedbackStrings.ratingLabel",
          label: "Rating label",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        fbCommentLabel: {
          ref: "feedbackStrings.commentLabel",
          label: "Comment field label",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        fbCommentPlaceholder: {
          ref: "feedbackStrings.commentPlaceholder",
          label: "Comment placeholder",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        fbSubmitButton: {
          ref: "feedbackStrings.submitButton",
          label: "Submit button text",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        fbCancelButton: {
          ref: "feedbackStrings.cancelButton",
          label: "Cancel button text",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        fbSuccessMessage: {
          ref: "feedbackStrings.successMessage",
          label: "Success message",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
        fbErrorMessage: {
          ref: "feedbackStrings.errorMessage",
          label: "Error message",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
        },
      },
    },

    // -- General texts --
    generalTexts: {
      type: "items",
      label: "General",
      items: {
        analysisPlaceholderText: {
          ref: "widget.analysisPlaceholderText",
          label: "Analysis-mode placeholder text",
          type: "string",
          expression: "optional",
          defaultValue: "",
          maxlength: 512,
          show: (layout) => layout.widget?.showAnalysisPlaceholder !== false,
        },
      },
    },
  },
};

export default languageSection;
