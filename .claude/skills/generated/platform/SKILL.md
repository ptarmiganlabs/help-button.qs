---
name: platform
description: "Skill for the Platform area of qs-help-button. 19 symbols across 5 files."
---

# Platform

19 symbols | 5 files | Cohesion: 97%

## When to Use

- Working with code in `src/`
- Understanding how getSenseVersion, resolveCodePath, detectPlatformType work
- Modifying platform-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/platform/client-managed.js` | getSenseVersion, compareVersions, resolveCodePath, getToolbarAnchor, getToolbarAnchorSelector (+3) |
| `src/platform/cloud.js` | getToolbarAnchor, getToolbarAnchorSelector, getObjectSelector, getCurrentSheetId, getSheetObjects |
| `src/platform/index.js` | detectPlatformType, detectPlatform, getPlatformAdapter |
| `src/util/product-info.js` | parseProductInfoText, fetchSenseVersionInfo |
| `src/platform/selectors.js` | getSelectors |

## Entry Points

Start here when exploring this area:

- **`getSenseVersion`** (Function) — `src/platform/client-managed.js:20`
- **`resolveCodePath`** (Function) — `src/platform/client-managed.js:60`
- **`detectPlatformType`** (Function) — `src/platform/index.js:17`
- **`detectPlatform`** (Function) — `src/platform/index.js:29`
- **`getPlatformAdapter`** (Function) — `src/platform/index.js:60`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getSenseVersion` | Function | `src/platform/client-managed.js` | 20 |
| `resolveCodePath` | Function | `src/platform/client-managed.js` | 60 |
| `detectPlatformType` | Function | `src/platform/index.js` | 17 |
| `detectPlatform` | Function | `src/platform/index.js` | 29 |
| `getPlatformAdapter` | Function | `src/platform/index.js` | 60 |
| `parseProductInfoText` | Function | `src/util/product-info.js` | 23 |
| `fetchSenseVersionInfo` | Function | `src/util/product-info.js` | 62 |
| `getToolbarAnchor` | Function | `src/platform/client-managed.js` | 85 |
| `getToolbarAnchorSelector` | Function | `src/platform/client-managed.js` | 96 |
| `getObjectSelector` | Function | `src/platform/client-managed.js` | 315 |
| `getToolbarAnchor` | Function | `src/platform/cloud.js` | 27 |
| `getToolbarAnchorSelector` | Function | `src/platform/cloud.js` | 38 |
| `getObjectSelector` | Function | `src/platform/cloud.js` | 229 |
| `getSelectors` | Function | `src/platform/selectors.js` | 86 |
| `getCurrentSheetId` | Function | `src/platform/client-managed.js` | 168 |
| `getSheetObjects` | Function | `src/platform/client-managed.js` | 225 |
| `getCurrentSheetId` | Function | `src/platform/cloud.js` | 116 |
| `getSheetObjects` | Function | `src/platform/cloud.js` | 141 |
| `compareVersions` | Function | `src/platform/client-managed.js` | 44 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `OpenFeedbackDialog → ParseProductInfoText` | cross_community | 6 |
| `GatherContextData → ParseProductInfoText` | cross_community | 5 |
| `DetectPlatform → ParseProductInfoText` | intra_community | 4 |
| `DetectPlatform → CompareVersions` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "getSenseVersion"})` — see callers and callees
2. `gitnexus_query({query: "platform"})` — find related execution flows
3. Read key files listed above for implementation details
