---
name: de
description: 'Skill for the De area of qs-help-button. 43 symbols across 2 files.'
---

# De

43 symbols | 2 files | Cohesion: 86%

## When to Use

- Working with code in `legacy/`
- Understanding how makeSvg, escapeHtml, resolveTemplateFields work
- Modifying de-related functionality

## Key Files

| File                                             | Symbols                                                                           |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `legacy/variants/bug-report/de/helpbutton-qs.js` | buildStyles, menuItemStyle, menuItemHoverStyle, createHelpButton, openPopup (+23) |
| `legacy/variants/basic/de/helpbutton-qs.js`      | makeSvg, escapeHtml, resolveTemplateFields, buildStyles, menuItemStyle (+10)      |

## Key Symbols

| Symbol                  | Type     | File                                             | Line |
| ----------------------- | -------- | ------------------------------------------------ | ---- |
| `makeSvg`               | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 274  |
| `escapeHtml`            | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 292  |
| `resolveTemplateFields` | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 345  |
| `buildStyles`           | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 377  |
| `menuItemStyle`         | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 476  |
| `menuItemHoverStyle`    | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 490  |
| `createHelpButton`      | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 504  |
| `openPopup`             | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 636  |
| `closePopup`            | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 642  |
| `togglePopup`           | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 648  |
| `init`                  | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 678  |
| `poll`                  | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 694  |
| `onMutation`            | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 712  |
| `cleanup`               | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 719  |
| `watchForRemoval`       | Function | `legacy/variants/basic/de/helpbutton-qs.js`      | 750  |
| `buildStyles`           | Function | `legacy/variants/bug-report/de/helpbutton-qs.js` | 604  |
| `menuItemStyle`         | Function | `legacy/variants/bug-report/de/helpbutton-qs.js` | 703  |
| `menuItemHoverStyle`    | Function | `legacy/variants/bug-report/de/helpbutton-qs.js` | 717  |
| `createHelpButton`      | Function | `legacy/variants/bug-report/de/helpbutton-qs.js` | 1386 |
| `openPopup`             | Function | `legacy/variants/bug-report/de/helpbutton-qs.js` | 1457 |

## Execution Flows

| Flow                            | Type            | Steps |
| ------------------------------- | --------------- | ----- |
| `WatchForRemoval → BuildStyles` | intra_community | 5     |
| `OnMutation → BuildStyles`      | intra_community | 4     |
| `OnMutation → BuildStyles`      | intra_community | 4     |
| `Poll → BuildStyles`            | intra_community | 4     |
| `Poll → BuildStyles`            | intra_community | 4     |
| `WatchForRemoval → MakeSvg`     | intra_community | 4     |
| `WatchForRemoval → EscapeHtml`  | intra_community | 4     |
| `OnMutation → MakeSvg`          | intra_community | 3     |
| `OnMutation → EscapeHtml`       | intra_community | 3     |
| `OnMutation → MakeSvg`          | cross_community | 3     |

## How to Explore

1. `gitnexus_context({name: "makeSvg"})` — see callers and callees
2. `gitnexus_query({query: "de"})` — find related execution flows
3. Read key files listed above for implementation details
