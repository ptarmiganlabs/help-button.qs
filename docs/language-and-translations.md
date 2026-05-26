# Language & Translations — Property Panel Reference

> **Scope:** Extension variant only (the `.qext` package). HTML-injection variants are not covered here.

## Overview

The **Language & Translations** section in the property panel centralises every user-visible text string exposed by the extension. All fields default to empty, which means the extension auto-translates to match the Qlik Sense UI language. Typing a custom value in any field overrides the auto-translation for that string.

### Supported languages

| Code | Language | Native Name |
|------|----------|-------------|
| `en` | English | English |
| `sv` | Swedish | Svenska |
| `no` | Norwegian | Norsk |
| `da` | Danish | Dansk |
| `fi` | Finnish | Suomi |
| `de` | German | Deutsch |
| `fr` | French | Français |
| `pl` | Polish | Polski |
| `es` | Spanish | Español |

---

## Section layout

The **Language & Translations** accordion section contains:

1. **Language dropdown** — `Auto-detect` (default) or a specific locale.
2. **Button** (expandable) — text overrides for the toolbar button.
3. **Popup** (expandable) — text overrides for the popup menu.
4. **Bug Report Dialog** (expandable) — text overrides for the bug-report dialog.
5. **Feedback Dialog** (expandable) — text overrides for the feedback dialog.
6. **General** (expandable) — analysis-mode placeholder text.

---

## All translatable fields

### Button

| Property ref | Label | Default (EN) |
|---|---|---|
| `buttonLabel` | Button label | Help |
| `buttonTooltip` | Button tooltip | Open help menu |

### Popup

| Property ref | Label | Default (EN) |
|---|---|---|
| `popupTitle` | Popup heading | Need assistance? |

### Bug Report Dialog

| Property ref | Label | Default (EN) |
|---|---|---|
| `bugReportStrings.title` | Dialog title | Report a Bug |
| `bugReportStrings.descriptionLabel` | Description field label | Description |
| `bugReportStrings.descriptionPlaceholder` | Description placeholder | Describe the issue you encountered… |
| `bugReportStrings.submitButton` | Submit button text | Submit |
| `bugReportStrings.cancelButton` | Cancel button text | Cancel |
| `bugReportStrings.successMessage` | Success message | Bug report submitted successfully! |
| `bugReportStrings.errorMessage` | Error message | Failed to submit bug report. Please try again. |
| `bugReportStrings.loadingMessage` | Loading message | Gathering environment info… |

### Feedback Dialog

| Property ref | Label | Default (EN) |
|---|---|---|
| `feedbackStrings.title` | Dialog title | Send Feedback |
| `feedbackStrings.ratingLabel` | Rating label | How would you rate this app? |
| `feedbackStrings.commentLabel` | Comment field label | Comments |
| `feedbackStrings.commentPlaceholder` | Comment placeholder | Share your thoughts about this app… |
| `feedbackStrings.submitButton` | Submit button text | Submit Feedback |
| `feedbackStrings.cancelButton` | Cancel button text | Cancel |
| `feedbackStrings.successMessage` | Success message | Feedback submitted successfully! |
| `feedbackStrings.errorMessage` | Error message | Failed to submit feedback. Please try again. |

### General

| Property ref | Label | Default (EN) |
|---|---|---|
| `widget.analysisPlaceholderText` | Analysis-mode placeholder text | Help button active in toolbar |

---

## Text resolution priority

Every translatable string follows this priority chain:

```
1. Per-menu-item override  ← (only for dialog title — bugReport.dialogStrings.title / feedback.dialogStrings.title)
2. Global override         ← value typed in Language & Translations subsection
3. Auto-translate          ← built-in translation for the active locale
4. English fallback        ← if the locale is unsupported
```

If a field is left empty at every level, the extension automatically fills in the correct translation for the end-user's Qlik UI language.

### Per-item dialog title override

Each bug-report or feedback menu item still exposes a **Dialog title override** field inside the Menu Items section. When non-empty, it takes precedence over the global dialog title from Language & Translations. This allows different menu items of the same type to have distinct titles.

---

## Language dropdown behaviour

| Transition | Effect |
|---|---|
| Auto-detect → Specific language | All translatable fields are overwritten with the selected language's standard translations. |
| Specific language → Auto-detect | All translatable fields are cleared (set to empty) so the extension auto-detects at runtime. |
| Specific language → Another language | Fields are overwritten with the new language's translations. |

A confirmation prompt is shown before any language switch to prevent accidental data loss.

---

## Data model

Global dialog strings are stored as two root-level objects in the extension properties:

```json
{
  "bugReportStrings": {
    "title": "",
    "descriptionLabel": "",
    "descriptionPlaceholder": "",
    "submitButton": "",
    "cancelButton": "",
    "successMessage": "",
    "errorMessage": "",
    "loadingMessage": ""
  },
  "feedbackStrings": {
    "title": "",
    "ratingLabel": "",
    "commentLabel": "",
    "commentPlaceholder": "",
    "submitButton": "",
    "cancelButton": "",
    "successMessage": "",
    "errorMessage": ""
  }
}
```

Other properties like `buttonLabel`, `buttonTooltip`, `popupTitle`, and `editPlaceholderTitle` are stored at the root level of the extension properties object.

```json
{
  "bugReportStrings": {
    "title": "",
    "descriptionLabel": "",
    "descriptionPlaceholder": "",
    "submitButton": "",
    "cancelButton": "",
    "successMessage": "",
    "errorMessage": "",
    "loadingMessage": ""
  },
  "feedbackStrings": {
    "title": "",
    "ratingLabel": "",
    "commentLabel": "",
    "commentPlaceholder": "",
    "submitButton": "",
    "cancelButton": "",
    "successMessage": "",
    "errorMessage": ""
  }
}
```

At runtime, the toolbar injector merges global strings with any per-item `dialogStrings` before passing the config to the dialog renderer. Per-item values (when non-empty) win over global values.

---

## Migration / backward compatibility

All new properties default to empty strings. Existing deployments that have never set these fields will continue to auto-translate exactly as before — no migration is required.
