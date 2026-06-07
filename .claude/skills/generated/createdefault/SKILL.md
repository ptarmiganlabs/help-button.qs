---
name: createdefault
description: 'Skill for the CreateDefault area of qs-help-button. 4 symbols across 1 files.'
---

# CreateDefault

4 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how createDefaultFields, createDefaultPayloadKeyNames, createDefaultBugReport work
- Modifying createdefault-related functionality

## Key Files

| File                       | Symbols                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/object-properties.js` | createDefaultFields, createDefaultPayloadKeyNames, createDefaultBugReport, createDefaultFeedback |

## Key Symbols

| Symbol                         | Type     | File                       | Line |
| ------------------------------ | -------- | -------------------------- | ---- |
| `createDefaultFields`          | Function | `src/object-properties.js` | 28   |
| `createDefaultPayloadKeyNames` | Function | `src/object-properties.js` | 53   |
| `createDefaultBugReport`       | Function | `src/object-properties.js` | 78   |
| `createDefaultFeedback`        | Function | `src/object-properties.js` | 100  |

## How to Explore

1. `gitnexus_context({name: "createDefaultFields"})` — see callers and callees
2. `gitnexus_query({query: "createdefault"})` — find related execution flows
3. Read key files listed above for implementation details
