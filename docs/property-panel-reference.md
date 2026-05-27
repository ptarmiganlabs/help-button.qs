# Property Panel Reference

This reference lists **all persisted properties exposed in the HelpButton.qs property panel**, based on the source code in `src/property-panel`, which is the authoritative implementation.

Use this document when you need a complete inventory of what can be configured from the property panel, including fields that are only shown when another setting enables them.

---

## Table of Contents

- [Property Panel Reference](#property-panel-reference)
  - [How to read this document](#how-to-read-this-document)
  - [Section order in the property panel](#section-order-in-the-property-panel)
  - [Widget Appearance](#widget-appearance)
  - [Theme & Styling](#theme--styling)
  - [Language & Translations](#language--translations)
  - [Button Appearance](#button-appearance)
  - [Popup Appearance](#popup-appearance)
  - [Menu Items](#menu-items)
    - [When action-specific menu item fields appear](#when-action-specific-menu-item-fields-appear)
    - [Bug Report dialog field toggles](#bug-report-dialog-field-toggles)
    - [Bug Report payload field toggles and key names](#bug-report-payload-field-toggles-and-key-names)
    - [Feedback dialog field toggles](#feedback-dialog-field-toggles)
    - [Feedback payload field toggles and key names](#feedback-payload-field-toggles-and-key-names)
  - [Tooltips](#tooltips)
    - [When tooltip-specific fields appear](#when-tooltip-specific-fields-appear)
  - [Security](#security)
  - [Documentation and About sections](#documentation-and-about-sections)

---

## How to read this document

- **Ref** is the actual property path used by the extension.
- **Default** is the source-code default from the property panel definition.
- **Shown when** describes any conditional visibility in the property panel.
- If a setting is inside `menuItems[]` or `tooltips[]`, it applies to **each item in that array**.
- `Documentation` and `About` contain helpful text and links in the property panel, but they do **not** add persisted properties.

---

## Section order in the property panel

The accordion sections are defined in this order:

1. Widget Appearance
2. Theme & Styling
3. Language & Translations
4. Button Appearance
5. Popup Appearance
6. Menu Items
7. Tooltips
8. Documentation
9. Security
10. About

---

## Widget Appearance

| Property panel label                   | Ref                              | Type           | Default | Shown when | Notes                                                                                                                               |
| -------------------------------------- | -------------------------------- | -------------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Hide hover menu                        | `widget.hideHoverMenu`           | Boolean switch | `false` | Always     | `Hidden` / `Visible`. Controls the Qlik hover menu on the extension cell.                                                           |
| Hide context menu                      | `widget.hideContextMenu`         | Boolean switch | `false` | Always     | `Hidden` / `Visible`. Controls the right-click/context menu on the extension cell.                                                  |
| Hide widget on sheet in analysis mode  | `widget.hideWidget`              | Boolean switch | `false` | Always     | Hides the sheet object itself in analysis mode.                                                                                     |
| Show placeholder text in analysis mode | `widget.showAnalysisPlaceholder` | Boolean switch | `true`  | Always     | `Show` / `Hide`. Also controls whether the placeholder text override field is shown later in **Language & Translations → General**. |

---

## Theme & Styling

| Property panel label | Ref           | Type     | Default   | Shown when | Notes                                                                                                         |
| -------------------- | ------------- | -------- | --------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| Theme preset         | `themePreset` | Dropdown | `default` | Always     | Applies a predefined palette. The preset can also stamp colors into menu items and other appearance settings. |

---

## Language & Translations

Most string fields in this section are designed as overrides. Leaving them empty lets the extension use built-in translations for the selected language.

### Language Selection

| Property panel label | Ref        | Type     | Default | Shown when | Notes                                                                                                                                 |
| -------------------- | ---------- | -------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Language             | `language` | Dropdown | `auto`  | Always     | Options: `auto`, `en`, `sv`, `no`, `da`, `fi`, `de`, `fr`, `pl`, `es`. Changing this can clear or repopulate the translatable fields. |

### Button

| Property panel label | Ref             | Type   | Default | Shown when | Notes                                |
| -------------------- | --------------- | ------ | ------- | ---------- | ------------------------------------ |
| Button label         | `buttonLabel`   | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Button tooltip       | `buttonTooltip` | String | `""`    | Always     | Supports expressions. Max 512 chars. |

### Popup

| Property panel label | Ref          | Type   | Default | Shown when | Notes                                |
| -------------------- | ------------ | ------ | ------- | ---------- | ------------------------------------ |
| Popup heading        | `popupTitle` | String | `""`    | Always     | Supports expressions. Max 512 chars. |

### Bug Report Dialog

| Property panel label    | Ref                                       | Type   | Default | Shown when | Notes                                |
| ----------------------- | ----------------------------------------- | ------ | ------- | ---------- | ------------------------------------ |
| Dialog title            | `bugReportStrings.title`                  | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Description field label | `bugReportStrings.descriptionLabel`       | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Description placeholder | `bugReportStrings.descriptionPlaceholder` | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Submit button text      | `bugReportStrings.submitButton`           | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Cancel button text      | `bugReportStrings.cancelButton`           | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Success message         | `bugReportStrings.successMessage`         | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Error message           | `bugReportStrings.errorMessage`           | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Loading message         | `bugReportStrings.loadingMessage`         | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Severity field label    | `bugReportStrings.severityLabel`          | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Severity option: Low    | `bugReportStrings.severityLowLabel`       | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Severity option: Medium | `bugReportStrings.severityMediumLabel`    | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Severity option: High   | `bugReportStrings.severityHighLabel`      | String | `""`    | Always     | Supports expressions. Max 512 chars. |

### Feedback Dialog

| Property panel label | Ref                                  | Type   | Default | Shown when | Notes                                |
| -------------------- | ------------------------------------ | ------ | ------- | ---------- | ------------------------------------ |
| Dialog title         | `feedbackStrings.title`              | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Rating label         | `feedbackStrings.ratingLabel`        | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Comment field label  | `feedbackStrings.commentLabel`       | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Comment placeholder  | `feedbackStrings.commentPlaceholder` | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Submit button text   | `feedbackStrings.submitButton`       | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Cancel button text   | `feedbackStrings.cancelButton`       | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Success message      | `feedbackStrings.successMessage`     | String | `""`    | Always     | Supports expressions. Max 512 chars. |
| Error message        | `feedbackStrings.errorMessage`       | String | `""`    | Always     | Supports expressions. Max 512 chars. |

### General

| Property panel label           | Ref                              | Type   | Default | Shown when                                 | Notes                                                                                                                               |
| ------------------------------ | -------------------------------- | ------ | ------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Analysis-mode placeholder text | `widget.analysisPlaceholderText` | String | `""`    | `widget.showAnalysisPlaceholder !== false` | Supports expressions. Max 512 chars. Hidden when **Show placeholder text in analysis mode** is turned off in **Widget Appearance**. |

---

## Button Appearance

| Property panel label | Ref                                | Type         | Default   | Shown when | Notes                                                                                                                                                                                                                                                      |
| -------------------- | ---------------------------------- | ------------ | --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button icon          | `buttonIcon`                       | Dropdown     | `help`    | Always     | Built-in icon set: `bell`, `bookmark`, `bug`, `calendar`, `chart-bar`, `check`, `download`, `eye`, `flash`, `globe`, `heart`, `help`, `home`, `info`, `lightbulb`, `link`, `lock`, `mail`, `phone`, `pin`, `search`, `settings`, `star`, `toggle`, `user`. |
| Background           | `buttonStyle.backgroundColor`      | Color picker | `#165a9b` | Always     | Toolbar button background.                                                                                                                                                                                                                                 |
| Hover background     | `buttonStyle.backgroundColorHover` | Color picker | `#12487c` | Always     | Toolbar button hover background.                                                                                                                                                                                                                           |
| Text / icon          | `buttonStyle.textColor`            | Color picker | `#ffffff` | Always     | Toolbar button text and icon color.                                                                                                                                                                                                                        |
| Border               | `buttonStyle.borderColor`          | Color picker | `#0e3b65` | Always     | Toolbar button border color.                                                                                                                                                                                                                               |
| Border radius        | `buttonStyle.borderRadius`         | String       | `4px`     | Always     | Supports expressions. CSS length value.                                                                                                                                                                                                                    |

---

## Popup Appearance

| Property panel label | Ref                                | Type         | Default   | Shown when | Notes                                   |
| -------------------- | ---------------------------------- | ------------ | --------- | ---------- | --------------------------------------- |
| Border               | `popupStyle.borderColor`           | Color picker | `#0c3256` | Always     | Popup outer border color.               |
| Border radius        | `popupStyle.borderRadius`          | String       | `8px`     | Always     | Supports expressions. CSS length value. |
| Header background    | `popupStyle.headerBackgroundColor` | Color picker | `#0c3256` | Always     | Popup title bar background.             |
| Header text          | `popupStyle.headerTextColor`       | Color picker | `#ffcc33` | Always     | Popup title bar text color.             |
| Separator line       | `popupStyle.separatorColor`        | Color picker | `#e0e0e0` | Always     | Divider between visible menu items.     |

---

## Menu Items

`menuItems` is an array. Each entry represents one popup menu command.

| Property panel label | Ref         | Type  | Default     | Shown when | Notes                                                                                    |
| -------------------- | ----------- | ----- | ----------- | ---------- | ---------------------------------------------------------------------------------------- |
| Menu Items           | `menuItems` | Array | Empty array | Always     | Supports add, remove, move, and duplicate. Item title is taken from each item's `label`. |

### Common properties for each `menuItems[]` item

| Property panel label                 | Ref             | Type     | Default               | Shown when                                                | Notes                                                                                         |
| ------------------------------------ | --------------- | -------- | --------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Label                                | `label`         | String   | `New item`            | Always                                                    | Supports expressions. Max 128 chars. Also used as the array item title in the property panel. |
| Action                               | `action`        | Dropdown | `link`                | Always                                                    | Options: `link`, `bugReport`, `feedback`, `setVariable`.                                      |
| URL (supports `{{template}}` fields) | `url`           | String   | `https://example.com` | `action` is not `bugReport`, `feedback`, or `setVariable` | Supports expressions. Max 2048 chars. Used for the **Open URL** action.                       |
| Link target                          | `target`        | Dropdown | `_blank`              | `action` is not `bugReport`, `feedback`, or `setVariable` | Options: `_blank` (new tab), `_self` (same tab).                                              |
| Show condition                       | `showCondition` | String   | `""`                  | Always                                                    | Supports expressions. Empty means visible.                                                    |
| Icon                                 | `icon`          | Dropdown | `help`                | Always                                                    | Same built-in icon set as the button icon picker.                                             |

### When action-specific menu item fields appear

```mermaid
flowchart TD
    A[menuItems[].action] --> B[link]
    A --> C[bugReport]
    A --> D[feedback]
    A --> E[setVariable]
    B --> B1[url]
    B --> B2[target]
    C --> C1[bugReport settings]
    C1 --> C2[authToken if authStrategy = header]
    C1 --> C3[customHeaders if authStrategy = custom]
    D --> D1[feedback settings]
    D1 --> D2[authToken if authStrategy = header]
    D1 --> D3[customHeaders if authStrategy = custom]
    D1 --> D4[commentMaxLength if enableComment is not false]
    E --> E1[variableAssignments if mode = set]
    E --> E2[variableName + toggle values if mode = toggle]
```

### Bug Report Settings (`action = bugReport`)

| Property panel label                       | Ref                                | Type           | Default                    | Shown when                                                 | Notes                                                           |
| ------------------------------------------ | ---------------------------------- | -------------- | -------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| Webhook URL (POST endpoint)                | `bugReport.webhookUrl`             | String         | `""`                       | `action = bugReport`                                       | Supports expressions and `{{template}}` fields. Max 2048 chars. |
| Authentication                             | `bugReport.authStrategy`           | Dropdown       | `none`                     | `action = bugReport`                                       | Options: `none`, `header`, `sense-session`, `custom`.           |
| ******                               | `bugReport.authToken`              | String         | `""`                       | `action = bugReport` and `bugReport.authStrategy = header` | Supports expressions. Max 8192 chars.                           |
| Custom headers                             | `bugReport.customHeaders`          | Array          | Empty array                | `action = bugReport` and `bugReport.authStrategy = custom` | Each item uses the nested properties below.                     |
| Header name                                | `bugReport.customHeaders[].name`   | String         | `""`                       | Inside `bugReport.customHeaders[]`                         | Supports expressions. Max 256 chars.                            |
| Header value                               | `bugReport.customHeaders[].value`  | String         | `""`                       | Inside `bugReport.customHeaders[]`                         | Supports expressions. Max 8192 chars.                           |
| Show severity picker (Low / Medium / High) | `bugReport.enableSeverity`         | Boolean switch | `true`                     | `action = bugReport`                                       | `On` / `Off`.                                                   |
| Max description length (characters)        | `bugReport.descriptionMaxLength`   | Number         | `1000`                     | `action = bugReport`                                       | Supports expressions. Min `1`, max `16384`.                     |
| Dialog title override (overrides global)   | `bugReport.dialogStrings.title`    | String         | `""`                       | `action = bugReport`                                       | Supports expressions. Max 128 chars.                            |
| Dialog timestamp format                    | `bugReport.dialogTimestampFormat`  | Dropdown       | `YYYY-MM-DD HH:mm:ss`      | `action = bugReport`                                       | Uses the shared timestamp format option list.                   |
| Payload timestamp format                   | `bugReport.payloadTimestampFormat` | Dropdown       | `ISO8601Z`                 | `action = bugReport`                                       | Uses the shared timestamp format option list.                    |
| Show 'Show payload' button                 | `bugReport.showPayloadButton`      | Boolean switch | `false`                    | `action = bugReport`                                       | Exposes payload preview in the dialog.                          |

### Bug Report dialog field toggles

| Field shown in dialog | Ref                                        | Default |
| --------------------- | ------------------------------------------ | ------- |
| User Name             | `bugReport.dialogFields.userName`          | `true`  |
| Platform              | `bugReport.dialogFields.platform`          | `true`  |
| App ID                | `bugReport.dialogFields.appId`             | `true`  |
| Sheet ID              | `bugReport.dialogFields.sheetId`           | `true`  |
| URL Path              | `bugReport.dialogFields.urlPath`           | `true`  |
| Timestamp             | `bugReport.dialogFields.timestamp`         | `true`  |
| User ID               | `bugReport.dialogFields.userId`            | `false` |
| User Directory        | `bugReport.dialogFields.userDirectory`     | `false` |
| Qlik Sense Version    | `bugReport.dialogFields.senseVersion`      | `false` |
| Browser               | `bugReport.dialogFields.browser`           | `false` |
| Tenant ID             | `bugReport.dialogFields.tenantId`          | `false` |
| Status                | `bugReport.dialogFields.status`            | `false` |
| Picture               | `bugReport.dialogFields.picture`           | `false` |
| Preferred Zone Info   | `bugReport.dialogFields.preferredZoneinfo` | `false` |
| Roles                 | `bugReport.dialogFields.roles`             | `false` |

All rows above are Boolean switches and are shown whenever `action = bugReport`.

### Bug Report payload field toggles and key names

| Payload field       | Include toggle ref                          | Include default | Key name ref                                  | Key default         | Key name shown when                              |
| ------------------- | ------------------------------------------- | --------------- | --------------------------------------------- | ------------------- | ------------------------------------------------ |
| User Name           | `bugReport.payloadFields.userName`          | `true`          | `bugReport.payloadKeyNames.userName`          | `userName`          | When `payloadFields.userName` is not `false`     |
| Platform            | `bugReport.payloadFields.platform`          | `true`          | `bugReport.payloadKeyNames.platform`          | `platform`          | When `payloadFields.platform` is not `false`     |
| App ID              | `bugReport.payloadFields.appId`             | `true`          | `bugReport.payloadKeyNames.appId`             | `appId`             | When `payloadFields.appId` is not `false`        |
| Sheet ID            | `bugReport.payloadFields.sheetId`           | `true`          | `bugReport.payloadKeyNames.sheetId`           | `sheetId`           | When `payloadFields.sheetId` is not `false`      |
| URL Path            | `bugReport.payloadFields.urlPath`           | `true`          | `bugReport.payloadKeyNames.urlPath`           | `urlPath`           | When `payloadFields.urlPath` is not `false`      |
| Timestamp           | `bugReport.payloadFields.timestamp`         | `true`          | `bugReport.payloadKeyNames.timestamp`         | `timestamp`         | When `payloadFields.timestamp` is not `false`    |
| User ID             | `bugReport.payloadFields.userId`            | `false`         | `bugReport.payloadKeyNames.userId`            | `userId`            | When `payloadFields.userId` is `true`            |
| User Directory      | `bugReport.payloadFields.userDirectory`     | `false`         | `bugReport.payloadKeyNames.userDirectory`     | `userDirectory`     | When `payloadFields.userDirectory` is `true`     |
| Qlik Sense Version  | `bugReport.payloadFields.senseVersion`      | `false`         | `bugReport.payloadKeyNames.senseVersion`      | `senseVersion`      | When `payloadFields.senseVersion` is `true`      |
| Browser             | `bugReport.payloadFields.browser`           | `false`         | `bugReport.payloadKeyNames.browser`           | `browser`           | When `payloadFields.browser` is `true`           |
| Tenant ID           | `bugReport.payloadFields.tenantId`          | `false`         | `bugReport.payloadKeyNames.tenantId`          | `tenantId`          | When `payloadFields.tenantId` is `true`          |
| Status              | `bugReport.payloadFields.status`            | `false`         | `bugReport.payloadKeyNames.status`            | `status`            | When `payloadFields.status` is `true`            |
| Picture             | `bugReport.payloadFields.picture`           | `false`         | `bugReport.payloadKeyNames.picture`           | `picture`           | When `payloadFields.picture` is `true`           |
| Preferred Zone Info | `bugReport.payloadFields.preferredZoneinfo` | `false`         | `bugReport.payloadKeyNames.preferredZoneinfo` | `preferredZoneinfo` | When `payloadFields.preferredZoneinfo` is `true` |
| Roles               | `bugReport.payloadFields.roles`             | `false`         | `bugReport.payloadKeyNames.roles`             | `roles`             | When `payloadFields.roles` is `true`             |

All include toggles above are Boolean switches and are shown whenever `action = bugReport`.

### Feedback Settings (`action = feedback`)

| Property panel label                     | Ref                               | Type           | Default                    | Shown when                                                 | Notes                                                           |
| ---------------------------------------- | --------------------------------- | -------------- | -------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| Webhook URL (POST endpoint)              | `feedback.webhookUrl`             | String         | `""`                       | `action = feedback`                                        | Supports expressions and `{{template}}` fields. Max 2048 chars. |
| Authentication                           | `feedback.authStrategy`           | Dropdown       | `none`                     | `action = feedback`                                        | Options: `none`, `header`, `sense-session`, `custom`.           |
| ******                               | `feedback.authToken`              | String         | `""`                       | `action = feedback` and `feedback.authStrategy = header` | Supports expressions. Max 8192 chars.            |
| Custom headers                           | `feedback.customHeaders`          | Array          | Empty array                | `action = feedback` and `feedback.authStrategy = custom`   | Each item uses the nested properties below.                     |
| Header name                              | `feedback.customHeaders[].name`   | String         | `""`                       | Inside `feedback.customHeaders[]`                          | Supports expressions.                                           |
| Header value                             | `feedback.customHeaders[].value`  | String         | `""`                       | Inside `feedback.customHeaders[]`                          | Supports expressions.                                           |
| Show star rating (1-5)                   | `feedback.enableRating`           | Boolean switch | `true`                     | `action = feedback`                                        | `On` / `Off`.                                                   |
| Show free-text comment field             | `feedback.enableComment`          | Boolean switch | `true`                     | `action = feedback`                                        | `On` / `Off`.                                                   |
| Max comment length (characters)          | `feedback.commentMaxLength`       | Number         | `500`                      | `action = feedback` and `feedback.enableComment !== false` | Min `1`, max `16384`.                                           |
| Dialog title override (overrides global) | `feedback.dialogStrings.title`    | String         | `""`                       | `action = feedback`                                        | Supports expressions. Max 128 chars.                            |
| Dialog timestamp format                  | `feedback.dialogTimestampFormat`  | Dropdown       | `YYYY-MM-DD HH:mm:ss`      | `action = feedback`                                        | Uses the shared timestamp format option list.                   |
| Payload timestamp format                   | `feedback.payloadTimestampFormat` | Dropdown       | `ISO8601Z`                 | `action = feedback`                                       | Uses the shared timestamp format option list.     |
| Show 'Show payload' button               | `feedback.showPayloadButton`      | Boolean switch | `false`                    | `action = feedback`                                        | Exposes payload preview in the dialog.                          |

### Feedback dialog field toggles

| Field shown in dialog | Ref                                       | Default |
| --------------------- | ----------------------------------------- | ------- |
| User Name             | `feedback.dialogFields.userName`          | `true`  |
| Platform              | `feedback.dialogFields.platform`          | `true`  |
| App ID                | `feedback.dialogFields.appId`             | `true`  |
| Sheet ID              | `feedback.dialogFields.sheetId`           | `true`  |
| URL Path              | `feedback.dialogFields.urlPath`           | `true`  |
| Timestamp             | `feedback.dialogFields.timestamp`         | `true`  |
| User ID               | `feedback.dialogFields.userId`            | `false` |
| User Directory        | `feedback.dialogFields.userDirectory`     | `false` |
| Qlik Sense Version    | `feedback.dialogFields.senseVersion`      | `false` |
| Browser               | `feedback.dialogFields.browser`           | `false` |
| Tenant ID             | `feedback.dialogFields.tenantId`          | `false` |
| Status                | `feedback.dialogFields.status`            | `false` |
| Picture               | `feedback.dialogFields.picture`           | `false` |
| Preferred Zone Info   | `feedback.dialogFields.preferredZoneinfo` | `false` |
| Roles                 | `feedback.dialogFields.roles`             | `false` |

All rows above are Boolean switches and are shown whenever `action = feedback`.

### Feedback payload field toggles and key names

| Payload field       | Include toggle ref                         | Include default | Key name ref                                 | Key default         | Key name shown when                              |
| ------------------- | ------------------------------------------ | --------------- | -------------------------------------------- | ------------------- | ------------------------------------------------ |
| User Name           | `feedback.payloadFields.userName`          | `true`          | `feedback.payloadKeyNames.userName`          | `userName`          | When `payloadFields.userName` is not `false`     |
| Platform            | `feedback.payloadFields.platform`          | `true`          | `feedback.payloadKeyNames.platform`          | `platform`          | When `payloadFields.platform` is not `false`     |
| App ID              | `feedback.payloadFields.appId`             | `true`          | `feedback.payloadKeyNames.appId`             | `appId`             | When `payloadFields.appId` is not `false`        |
| Sheet ID            | `feedback.payloadFields.sheetId`           | `true`          | `feedback.payloadKeyNames.sheetId`           | `sheetId`           | When `payloadFields.sheetId` is not `false`      |
| URL Path            | `feedback.payloadFields.urlPath`           | `true`          | `feedback.payloadKeyNames.urlPath`           | `urlPath`           | When `payloadFields.urlPath` is not `false`      |
| Timestamp           | `feedback.payloadFields.timestamp`         | `true`          | `feedback.payloadKeyNames.timestamp`         | `timestamp`         | When `payloadFields.timestamp` is not `false`    |
| User ID             | `feedback.payloadFields.userId`            | `false`         | `feedback.payloadKeyNames.userId`            | `userId`            | When `payloadFields.userId` is `true`            |
| User Directory      | `feedback.payloadFields.userDirectory`     | `false`         | `feedback.payloadKeyNames.userDirectory`     | `userDirectory`     | When `payloadFields.userDirectory` is `true`     |
| Qlik Sense Version  | `feedback.payloadFields.senseVersion`      | `false`         | `feedback.payloadKeyNames.senseVersion`      | `senseVersion`      | When `payloadFields.senseVersion` is `true`      |
| Browser             | `feedback.payloadFields.browser`           | `false`         | `feedback.payloadKeyNames.browser`           | `browser`           | When `payloadFields.browser` is `true`           |
| Tenant ID           | `feedback.payloadFields.tenantId`          | `false`         | `feedback.payloadKeyNames.tenantId`          | `tenantId`          | When `payloadFields.tenantId` is `true`          |
| Status              | `feedback.payloadFields.status`            | `false`         | `feedback.payloadKeyNames.status`            | `status`            | When `payloadFields.status` is `true`            |
| Picture             | `feedback.payloadFields.picture`           | `false`         | `feedback.payloadKeyNames.picture`           | `picture`           | When `payloadFields.picture` is `true`           |
| Preferred Zone Info | `feedback.payloadFields.preferredZoneinfo` | `false`         | `feedback.payloadKeyNames.preferredZoneinfo` | `preferredZoneinfo` | When `payloadFields.preferredZoneinfo` is `true` |
| Roles               | `feedback.payloadFields.roles`             | `false`         | `feedback.payloadKeyNames.roles`             | `roles`             | When `payloadFields.roles` is `true`             |

All include toggles above are Boolean switches and are shown whenever `action = feedback`.

### Variable Settings (`action = setVariable`)

| Property panel label       | Ref                                                  | Type     | Default     | Shown when                                                           | Notes                                       |
| -------------------------- | ---------------------------------------------------- | -------- | ----------- | -------------------------------------------------------------------- | ------------------------------------------- |
| Mode                       | `variableAction.mode`                                | Dropdown | `set`       | `action = setVariable`                                               | Options: `set`, `toggle`.                   |
| Variable Assignments       | `variableAction.variableAssignments`                 | Array    | Empty array | `action = setVariable` and `variableAction.mode` is missing or `set` | Each item uses the nested properties below. |
| Variable name              | `variableAction.variableAssignments[].variableName`  | String   | `""`        | Inside `variableAction.variableAssignments[]`                        | Max 256 chars.                              |
| Value                      | `variableAction.variableAssignments[].variableValue` | String   | `""`        | Inside `variableAction.variableAssignments[]`                        | Supports expressions. Max 4096 chars.       |
| Variable name              | `variableAction.variableName`                        | String   | `""`        | `action = setVariable` and `variableAction.mode = toggle`            | Used for toggle mode. Max 256 chars.        |
| Value A                    | `variableAction.toggleValue1`                        | String   | `""`        | `action = setVariable` and `variableAction.mode = toggle`            | Supports expressions. Max 4096 chars.       |
| Value B                    | `variableAction.toggleValue2`                        | String   | `""`        | `action = setVariable` and `variableAction.mode = toggle`            | Supports expressions. Max 4096 chars.       |
| Default value (safety net) | `variableAction.toggleDefault`                       | String   | `""`        | `action = setVariable` and `variableAction.mode = toggle`            | Supports expressions. Max 4096 chars.       |

### Item Colors (all menu item actions)

| Property panel label | Ref            | Type         | Default   | Shown when | Notes                        |
| -------------------- | -------------- | ------------ | --------- | ---------- | ---------------------------- |
| Icon                 | `iconColor`    | Color picker | `#165a9b` | Always     | Per-item icon color.         |
| Background           | `bgColor`      | Color picker | `#f0f6fc` | Always     | Per-item default background. |
| Hover background     | `bgColorHover` | Color picker | `#dbeafe` | Always     | Per-item hover background.   |
| Text                 | `textColor`    | Color picker | `#0c3256` | Always     | Per-item label color.        |

For more detail on runtime behaviour, see [Menu Items — Sense App Developer Guide](./menu-items-app-developer.md).

---

## Tooltips

`tooltips` is an array. Each entry represents one tooltip icon, hover popup, and optional click dialog.

| Property panel label | Ref        | Type  | Default     | Shown when | Notes                                                                                              |
| -------------------- | ---------- | ----- | ----------- | ---------- | -------------------------------------------------------------------------------------------------- |
| Tooltip Items        | `tooltips` | Array | Empty array | Always     | Supports add, remove, move, and duplicate. Item title is taken from each tooltip's `tooltipLabel`. |

### Common properties for each `tooltips[]` item

| Property panel label | Ref                 | Type     | Default       | Shown when           | Notes                                                          |
| -------------------- | ------------------- | -------- | ------------- | -------------------- | -------------------------------------------------------------- |
| Label (display name) | `tooltipLabel`      | String   | `New tooltip` | Always               | Supports expressions. Max 128 chars.                           |
| Target type          | `targetType`        | Dropdown | `object`      | Always               | Options: `object` (Qlik Sense object) or `css` (CSS selector). |
| Target object        | `targetObjectId`    | Dropdown | `""`          | `targetType !== css` | Populated dynamically from objects on the current sheet.       |
| CSS selector         | `targetCssSelector` | String   | `""`          | `targetType = css`   | Supports expressions. Max 512 chars.                           |
| Show condition       | `showCondition`     | String   | `""`          | Always               | Supports expressions. Empty means visible.                     |

### When tooltip-specific fields appear

```mermaid
flowchart TD
    A[tooltips[].targetType] --> B[object]
    A --> C[css]
    B --> B1[targetObjectId]
    C --> C1[targetCssSelector]
    D[tooltips[].iconPosition] --> E[percentage]
    E --> E1[iconPositionX]
    E --> E2[iconPositionY]
    F[tooltips[].dialogEnabled] --> G[true or unset]
    G --> G1[dialogTitle]
    G --> G2[dialogContent]
    G --> G3[dialogSize]
```

### Icon Appearance

| Property panel label    | Ref                   | Type           | Default     | Shown when                  | Notes                                                                                                                                        |
| ----------------------- | --------------------- | -------------- | ----------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Icon                    | `iconName`            | Dropdown       | `info`      | Always                      | Uses the extension's built-in icon set, excluding `close` and `send`.                                                                        |
| Icon size (px)          | `iconSize`            | Number         | `20`        | Always                      | Supports expressions. Min `1`, max `80`.                                                                                                     |
| Position on target      | `iconPosition`        | Dropdown       | `top-right` | Always                      | Options: `top-left`, `top-center`, `top-right`, `center-left`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right`, `percentage`. |
| Horizontal position (%) | `iconPositionX`       | Number         | `80`        | `iconPosition = percentage` | Supports expressions. Min `0`, max `100`.                                                                                                    |
| Vertical position (%)   | `iconPositionY`       | Number         | `10`        | `iconPosition = percentage` | Supports expressions. Min `0`, max `100`.                                                                                                    |
| Floating (drag to move) | `iconFloating`        | Boolean switch | `false`     | Always                      | `On` / `Off`.                                                                                                                                |
| Icon color              | `iconColor`           | Color picker   | `#ffffff`   | Always                      | Tooltip icon foreground color.                                                                                                               |
| Background color        | `iconBackgroundColor` | Color picker   | `#165a9b`   | Always                      | Tooltip icon background color.                                                                                                               |

### Tooltip Colors

| Property panel label     | Ref                           | Type         | Default   | Shown when | Notes                           |
| ------------------------ | ----------------------------- | ------------ | --------- | ---------- | ------------------------------- |
| Hover background         | `hoverBackgroundColor`        | Color picker | `#ffffff` | Always     | Hover popup background.         |
| Hover text               | `hoverTextColor`              | Color picker | `#1f2937` | Always     | Hover popup text color.         |
| Hover border             | `hoverBorderColor`            | Color picker | `#d1d5db` | Always     | Hover popup border color.       |
| Dialog header background | `dialogHeaderBackgroundColor` | Color picker | `#f9fafb` | Always     | Click-dialog header background. |
| Dialog header text       | `dialogHeaderTextColor`       | Color picker | `#111827` | Always     | Click-dialog header text color. |
| Dialog body background   | `dialogBodyBackgroundColor`   | Color picker | `#ffffff` | Always     | Click-dialog body background.   |
| Dialog body text         | `dialogBodyTextColor`         | Color picker | `#374151` | Always     | Click-dialog body text color.   |

### Hover Content

| Property panel label              | Ref            | Type     | Default | Shown when | Notes                                                                                                           |
| --------------------------------- | -------------- | -------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| Tooltip text (Markdown supported) | `hoverContent` | Textarea | `""`    | Always     | Plain text / Markdown. Max 256 chars. The adjacent **Edit in Markdown editor** button edits this same property. |

### Click Dialog

| Property panel label                | Ref             | Type           | Default  | Shown when                | Notes                                                                                                             |
| ----------------------------------- | --------------- | -------------- | -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Open dialog on click                | `dialogEnabled` | Boolean switch | `true`   | Always                    | `On` / `Off`.                                                                                                     |
| Dialog title                        | `dialogTitle`   | String         | `""`     | `dialogEnabled !== false` | Supports expressions. Max 128 chars.                                                                              |
| Dialog content (Markdown supported) | `dialogContent` | Textarea       | `""`     | `dialogEnabled !== false` | Plain text / Markdown. Max 16384 chars. The adjacent **Edit in Markdown editor** button edits this same property. |
| Dialog size                         | `dialogSize`    | Dropdown       | `medium` | `dialogEnabled !== false` | Options: `small`, `medium`, `large`, `x-large`.                                                                   |

For more detail on authoring and runtime behaviour, see [Tooltips — Sense App Developer Guide](./tooltips-app-developer.md).

---

## Security

| Property panel label | Ref                           | Type     | Default | Shown when | Notes                                                                                                                 |
| -------------------- | ----------------------------- | -------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Allowed URI prefixes | `security.allowedUriPatterns` | Textarea | `""`    | Always     | Comma-separated whitelist for embedded video and iframe URLs in tooltip content. Empty means all sources are allowed. |

---

## Documentation and About sections

The property panel also includes **Documentation** and **About** sections.

These sections expose helpful text and links such as template-field reminders, GitHub links, issue links, version text, and build date text. They do **not** define persisted properties, because their items use property-panel components like `text`, `link`, or `button` without a `ref`.

If you need the related end-user guidance, see:

- [Template Fields](./template-fields.md)
- [Menu Items — Sense App Developer Guide](./menu-items-app-developer.md)
- [Tooltips — Sense App Developer Guide](./tooltips-app-developer.md)
