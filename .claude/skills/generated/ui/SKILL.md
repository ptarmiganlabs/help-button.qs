---
name: ui
description: 'Skill for the Ui area of qs-help-button. 95 symbols across 15 files.'
---

# Ui

95 symbols | 15 files | Cohesion: 69%

## When to Use

- Working with code in `src/`
- Understanding how openMarkdownEditorDialog, updateCounter, hasPendingChanges work
- Modifying ui-related functionality

## Key Files

| File                               | Symbols                                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/ui/tooltip-injector.js`       | onPointerMove, mountTooltipIcon, enableDrag, applyPosition, registerTooltips (+12)                    |
| `src/ui/feedback-dialog.js`        | getUserInfo, getSenseVersion, gatherContextData, openFeedbackDialog, resolveFieldToggle (+7)          |
| `src/ui/bug-report-dialog.js`      | openBugReportDialog, resolveFieldToggle, updateSubmitState, closeDialog, makeReadonlyField (+5)       |
| `src/ui/toolbar-injector.js`       | registerHelpConfig, unregisterHelpConfig, rebuildHelpButton, watchForRemoval, destroyHelpButton (+5)  |
| `src/ui/markdown-editor-dialog.js` | confirmDiscardChanges, cleanup, onKey, openMarkdownEditorDialog, updateCounter (+4)                   |
| `src/ui/popup-menu.js`             | closePopup, openPopup, togglePopup, onClickOutside, onEscape (+4)                                     |
| `src/ui/payload-viewer.js`         | isSensitiveHeader, formatHeaderValue, buildHeaderDisplay, syntaxHighlightJson, showPayloadViewer (+2) |
| `src/ui/variable-action.js`        | executeVariableAction, setVariables, toggleVariable, getVariableHandle, setVariableValue              |
| `src/ui/markdown-toolbar.js`       | applyAction, wrap, linePrefix, createTabbedMarkdownEditor, updatePreview                              |
| `src/ui/tooltip-hover.js`          | showHover, scheduleHide, hideHover, positionPopup, cancelHide                                         |

## Entry Points

Start here when exploring this area:

- **`openMarkdownEditorDialog`** (Function) — `src/ui/markdown-editor-dialog.js:120`
- **`updateCounter`** (Function) — `src/ui/markdown-editor-dialog.js:182`
- **`hasPendingChanges`** (Function) — `src/ui/markdown-editor-dialog.js:197`
- **`guardedClose`** (Function) — `src/ui/markdown-editor-dialog.js:203`
- **`onKeyDown`** (Function) — `src/ui/markdown-editor-dialog.js:247`

## Key Symbols

| Symbol                      | Type     | File                               | Line |
| --------------------------- | -------- | ---------------------------------- | ---- |
| `openMarkdownEditorDialog`  | Function | `src/ui/markdown-editor-dialog.js` | 120  |
| `updateCounter`             | Function | `src/ui/markdown-editor-dialog.js` | 182  |
| `hasPendingChanges`         | Function | `src/ui/markdown-editor-dialog.js` | 197  |
| `guardedClose`              | Function | `src/ui/markdown-editor-dialog.js` | 203  |
| `onKeyDown`                 | Function | `src/ui/markdown-editor-dialog.js` | 247  |
| `closeMarkdownEditorDialog` | Function | `src/ui/markdown-editor-dialog.js` | 267  |
| `openBugReportDialog`       | Function | `src/ui/bug-report-dialog.js`      | 93   |
| `resolveFieldToggle`        | Function | `src/ui/bug-report-dialog.js`      | 130  |
| `updateSubmitState`         | Function | `src/ui/bug-report-dialog.js`      | 528  |
| `closeDialog`               | Function | `src/ui/bug-report-dialog.js`      | 598  |
| `fetchSenseVersionLabel`    | Function | `src/util/product-info.js`         | 95   |
| `openFeedbackDialog`        | Function | `src/ui/feedback-dialog.js`        | 97   |
| `resolveFieldToggle`        | Function | `src/ui/feedback-dialog.js`        | 137  |
| `updateSubmitState`         | Function | `src/ui/feedback-dialog.js`        | 476  |
| `closeDialog`               | Function | `src/ui/feedback-dialog.js`        | 560  |
| `buildHeaderDisplay`        | Function | `src/ui/payload-viewer.js`         | 72   |
| `syntaxHighlightJson`       | Function | `src/ui/payload-viewer.js`         | 138  |
| `showPayloadViewer`         | Function | `src/ui/payload-viewer.js`         | 193  |
| `handleEscapeKey`           | Function | `src/ui/payload-viewer.js`         | 213  |
| `closeViewer`               | Function | `src/ui/payload-viewer.js`         | 220  |

## Execution Flows

| Flow                                        | Type            | Steps |
| ------------------------------------------- | --------------- | ----- |
| `OpenFeedbackDialog → ParseProductInfoText` | cross_community | 6     |
| `CreatePopupMenu → GetVariableHandle`       | cross_community | 6     |
| `UnregisterTooltips → SafeCssColor`         | cross_community | 6     |
| `UnregisterHelpConfig → Cleanup`            | cross_community | 6     |
| `RegisterTooltips → SafeCssColor`           | cross_community | 6     |
| `OpenFeedbackDialog → Pad2`                 | cross_community | 5     |
| `OpenMarkdownEditorDialog → YoutubeId`      | cross_community | 5     |
| `OpenMarkdownEditorDialog → IframeHtml`     | cross_community | 5     |
| `OpenMarkdownEditorDialog → VimeoId`        | cross_community | 5     |
| `OpenMarkdownEditorDialog → VideoTagHtml`   | cross_community | 5     |

## Connected Areas

| Area     | Connections |
| -------- | ----------- |
| Util     | 13 calls    |
| Platform | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "openMarkdownEditorDialog"})` — see callers and callees
2. `gitnexus_query({query: "ui"})` — find related execution flows
3. Read key files listed above for implementation details
