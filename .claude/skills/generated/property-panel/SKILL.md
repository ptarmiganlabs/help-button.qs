---
name: property-panel
description: 'Skill for the Property-panel area of qs-help-button. 8 symbols across 7 files.'
---

# Property-panel

8 symbols | 7 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how ext, supernova, tooltipsSection work
- Modifying property-panel-related functionality

## Key Files

| File                                     | Symbols                          |
| ---------------------------------------- | -------------------------------- |
| `src/property-panel/object-list.js`      | getObjectList, getCurrentSheetId |
| `src/ext.js`                             | ext                              |
| `src/index.js`                           | supernova                        |
| `src/property-panel/tooltips-section.js` | tooltipsSection                  |
| `src/util/color.js`                      | toPickerObj                      |
| `src/property-panel/theme-section.js`    | change                           |
| `src/theme/presets.js`                   | applyPreset                      |

## Entry Points

Start here when exploring this area:

- **`ext`** (Function) — `src/ext.js:28`
- **`supernova`** (Function) — `src/index.js:43`
- **`tooltipsSection`** (Function) — `src/property-panel/tooltips-section.js:18`
- **`toPickerObj`** (Function) — `src/util/color.js:16`
- **`applyPreset`** (Function) — `src/theme/presets.js:314`

## Key Symbols

| Symbol              | Type     | File                                     | Line |
| ------------------- | -------- | ---------------------------------------- | ---- |
| `ext`               | Function | `src/ext.js`                             | 28   |
| `supernova`         | Function | `src/index.js`                           | 43   |
| `tooltipsSection`   | Function | `src/property-panel/tooltips-section.js` | 18   |
| `toPickerObj`       | Function | `src/util/color.js`                      | 16   |
| `applyPreset`       | Function | `src/theme/presets.js`                   | 314  |
| `getObjectList`     | Function | `src/property-panel/object-list.js`      | 16   |
| `getCurrentSheetId` | Function | `src/property-panel/object-list.js`      | 32   |
| `change`            | Function | `src/property-panel/theme-section.js`    | 29   |

## Execution Flows

| Flow                      | Type            | Steps |
| ------------------------- | --------------- | ----- |
| `Supernova → ToPickerObj` | intra_community | 4     |

## How to Explore

1. `gitnexus_context({name: "ext"})` — see callers and callees
2. `gitnexus_query({query: "property-panel"})` — find related execution flows
3. Read key files listed above for implementation details
