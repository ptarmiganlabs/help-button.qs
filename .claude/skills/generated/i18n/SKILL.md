---
name: i18n
description: "Skill for the I18n area of qs-help-button. 5 symbols across 1 files."
---

# I18n

5 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how getEffectiveLocale, detectLocale, getTranslation work
- Modifying i18n-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/i18n/index.js` | getEffectiveLocale, detectLocale, normalizeLocale, getTranslation, resolveText |

## Entry Points

Start here when exploring this area:

- **`getEffectiveLocale`** (Function) — `src/i18n/index.js:66`
- **`detectLocale`** (Function) — `src/i18n/index.js:88`
- **`getTranslation`** (Function) — `src/i18n/index.js:141`
- **`resolveText`** (Function) — `src/i18n/index.js:166`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getEffectiveLocale` | Function | `src/i18n/index.js` | 66 |
| `detectLocale` | Function | `src/i18n/index.js` | 88 |
| `getTranslation` | Function | `src/i18n/index.js` | 141 |
| `resolveText` | Function | `src/i18n/index.js` | 166 |
| `normalizeLocale` | Function | `src/i18n/index.js` | 125 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ResolveText → NormalizeLocale` | intra_community | 5 |

## How to Explore

1. `gitnexus_context({name: "getEffectiveLocale"})` — see callers and callees
2. `gitnexus_query({query: "i18n"})` — find related execution flows
3. Read key files listed above for implementation details
