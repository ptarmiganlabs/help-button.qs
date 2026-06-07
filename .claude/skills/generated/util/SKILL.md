---
name: util
description: 'Skill for the Util area of qs-help-button. 38 symbols across 9 files.'
---

# Util

38 symbols | 9 files | Cohesion: 79%

## When to Use

- Working with code in `src/`
- Understanding how openTooltipDialog, onKeyDown, closeTooltipDialog work
- Modifying util-related functionality

## Key Files

| File                             | Symbols                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `src/util/markdown-shortcuts.js` | notify, insertLink, toggleLinePrefix, applyLink, applyOrderedList (+7)             |
| `src/util/markdown.js`           | youtubeId, vimeoId, iframeHtml, videoTagHtml, filterMediaUris (+1)                 |
| `src/util/timestamp-formats.js`  | pad2, ampm, hours12, tzOffsetString, formatTimestamp                               |
| `src/index.js`                   | renderEditPlaceholder, renderAnalysisPlaceholder, openAboutModal, close, onKey     |
| `src/util/menu-item-merge.js`    | normalizeMenuItemMergeMode, isMenuItemVisible, getMenuItemMergeKey, mergeMenuItems |
| `src/ui/tooltip-dialog.js`       | openTooltipDialog, onKeyDown, closeTooltipDialog                                   |
| `src/ui/bug-report-dialog.js`    | buildPayload                                                                       |
| `src/ui/feedback-dialog.js`      | buildPayload                                                                       |
| `src/util/template-fields.js`    | escapeHtml                                                                         |

## Entry Points

Start here when exploring this area:

- **`openTooltipDialog`** (Function) — `src/ui/tooltip-dialog.js:39`
- **`onKeyDown`** (Function) — `src/ui/tooltip-dialog.js:99`
- **`closeTooltipDialog`** (Function) — `src/ui/tooltip-dialog.js:122`
- **`markdownToHtml`** (Function) — `src/util/markdown.js:177`
- **`applyLink`** (Function) — `src/util/markdown-shortcuts.js:182`

## Key Symbols

| Symbol                       | Type     | File                             | Line |
| ---------------------------- | -------- | -------------------------------- | ---- |
| `openTooltipDialog`          | Function | `src/ui/tooltip-dialog.js`       | 39   |
| `onKeyDown`                  | Function | `src/ui/tooltip-dialog.js`       | 99   |
| `closeTooltipDialog`         | Function | `src/ui/tooltip-dialog.js`       | 122  |
| `markdownToHtml`             | Function | `src/util/markdown.js`           | 177  |
| `applyLink`                  | Function | `src/util/markdown-shortcuts.js` | 182  |
| `applyOrderedList`           | Function | `src/util/markdown-shortcuts.js` | 186  |
| `applyUnorderedList`         | Function | `src/util/markdown-shortcuts.js` | 190  |
| `applyBlockquote`            | Function | `src/util/markdown-shortcuts.js` | 194  |
| `attachMarkdownShortcuts`    | Function | `src/util/markdown-shortcuts.js` | 207  |
| `formatTimestamp`            | Function | `src/util/timestamp-formats.js`  | 131  |
| `escapeHtml`                 | Function | `src/util/template-fields.js`    | 119  |
| `applyBold`                  | Function | `src/util/markdown-shortcuts.js` | 170  |
| `applyItalic`                | Function | `src/util/markdown-shortcuts.js` | 174  |
| `applyCode`                  | Function | `src/util/markdown-shortcuts.js` | 178  |
| `normalizeMenuItemMergeMode` | Function | `src/util/menu-item-merge.js`    | 22   |
| `isMenuItemVisible`          | Function | `src/util/menu-item-merge.js`    | 34   |
| `mergeMenuItems`             | Function | `src/util/menu-item-merge.js`    | 113  |
| `youtubeId`                  | Function | `src/util/markdown.js`           | 38   |
| `vimeoId`                    | Function | `src/util/markdown.js`           | 53   |
| `iframeHtml`                 | Function | `src/util/markdown.js`           | 68   |

## Execution Flows

| Flow                                              | Type            | Steps |
| ------------------------------------------------- | --------------- | ----- |
| `OpenFeedbackDialog → Pad2`                       | cross_community | 5     |
| `OpenMarkdownEditorDialog → YoutubeId`            | cross_community | 5     |
| `OpenMarkdownEditorDialog → IframeHtml`           | cross_community | 5     |
| `OpenMarkdownEditorDialog → VimeoId`              | cross_community | 5     |
| `OpenMarkdownEditorDialog → VideoTagHtml`         | cross_community | 5     |
| `OpenMarkdownEditorDialog → Notify`               | cross_community | 5     |
| `RegisterHelpConfig → NormalizeMenuItemMergeMode` | cross_community | 5     |
| `RegisterHelpConfig → GetMenuItemMergeKey`        | cross_community | 5     |
| `RegisterHelpConfig → IsMenuItemVisible`          | cross_community | 5     |
| `OpenFeedbackDialog → Hours12`                    | cross_community | 4     |

## Connected Areas

| Area | Connections |
| ---- | ----------- |
| Ui   | 2 calls     |

## How to Explore

1. `gitnexus_context({name: "openTooltipDialog"})` — see callers and callees
2. `gitnexus_query({query: "util"})` — find related execution flows
3. Read key files listed above for implementation details
