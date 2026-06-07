---
name: sv
description: 'Skill for the Sv area of qs-help-button. 43 symbols across 2 files.'
---

# Sv

43 symbols | 2 files | Cohesion: 86%

## When to Use

- Working with code in `legacy/`
- Understanding how makeSvg, escapeHtml, resolveTemplateFields work
- Modifying sv-related functionality

## Key Files

| File                                             | Symbols                                                                           |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `legacy/variants/bug-report/sv/helpbutton-qs.js` | buildStyles, menuItemStyle, menuItemHoverStyle, createHelpButton, openPopup (+23) |
| `legacy/variants/basic/sv/helpbutton-qs.js`      | makeSvg, escapeHtml, resolveTemplateFields, buildStyles, menuItemStyle (+10)      |

## Key Symbols

| Symbol                  | Type     | File                                             | Line |
| ----------------------- | -------- | ------------------------------------------------ | ---- |
| `makeSvg`               | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 272  |
| `escapeHtml`            | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 290  |
| `resolveTemplateFields` | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 343  |
| `buildStyles`           | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 375  |
| `menuItemStyle`         | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 469  |
| `menuItemHoverStyle`    | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 483  |
| `createHelpButton`      | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 497  |
| `openPopup`             | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 629  |
| `closePopup`            | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 635  |
| `togglePopup`           | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 641  |
| `init`                  | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 671  |
| `poll`                  | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 687  |
| `onMutation`            | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 701  |
| `cleanup`               | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 708  |
| `watchForRemoval`       | Function | `legacy/variants/basic/sv/helpbutton-qs.js`      | 739  |
| `buildStyles`           | Function | `legacy/variants/bug-report/sv/helpbutton-qs.js` | 594  |
| `menuItemStyle`         | Function | `legacy/variants/bug-report/sv/helpbutton-qs.js` | 688  |
| `menuItemHoverStyle`    | Function | `legacy/variants/bug-report/sv/helpbutton-qs.js` | 702  |
| `createHelpButton`      | Function | `legacy/variants/bug-report/sv/helpbutton-qs.js` | 1357 |
| `openPopup`             | Function | `legacy/variants/bug-report/sv/helpbutton-qs.js` | 1428 |

## Execution Flows

| Flow                       | Type            | Steps |
| -------------------------- | --------------- | ----- |
| `OnMutation → BuildStyles` | intra_community | 4     |
| `OnMutation → BuildStyles` | intra_community | 4     |
| `Poll → BuildStyles`       | intra_community | 4     |
| `Poll → BuildStyles`       | intra_community | 4     |
| `OnMutation → MakeSvg`     | intra_community | 3     |
| `OnMutation → EscapeHtml`  | intra_community | 3     |
| `OnMutation → MakeSvg`     | cross_community | 3     |
| `OnMutation → EscapeHtml`  | cross_community | 3     |
| `Poll → MakeSvg`           | intra_community | 3     |
| `Poll → EscapeHtml`        | intra_community | 3     |

## How to Explore

1. `gitnexus_context({name: "makeSvg"})` — see callers and callees
2. `gitnexus_query({query: "sv"})` — find related execution flows
3. Read key files listed above for implementation details
