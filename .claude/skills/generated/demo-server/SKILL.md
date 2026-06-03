---
name: demo-server
description: "Skill for the Demo-server area of qs-help-button. 17 symbols across 1 files."
---

# Demo-server

17 symbols | 1 files | Cohesion: 87%

## When to Use

- Working with code in `shared/`
- Understanding how renderNoData, renderBugList, renderFeedbackList work
- Modifying demo-server-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `shared/demo-server/server.js` | renderNoData, renderBugList, renderFeedbackList, createDashboardSnapshot, writeSseEvent (+12) |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `renderNoData` | Function | `shared/demo-server/server.js` | 217 |
| `renderBugList` | Function | `shared/demo-server/server.js` | 252 |
| `renderFeedbackList` | Function | `shared/demo-server/server.js` | 258 |
| `createDashboardSnapshot` | Function | `shared/demo-server/server.js` | 264 |
| `writeSseEvent` | Function | `shared/demo-server/server.js` | 273 |
| `broadcastDashboardEvent` | Function | `shared/demo-server/server.js` | 278 |
| `renderDashboardScript` | Function | `shared/demo-server/server.js` | 289 |
| `renderDashboard` | Function | `shared/demo-server/server.js` | 409 |
| `registerDashboardClient` | Function | `shared/demo-server/server.js` | 466 |
| `formatContextFields` | Function | `shared/demo-server/server.js` | 143 |
| `escapeHtml` | Function | `shared/demo-server/server.js` | 167 |
| `formatContextLabel` | Function | `shared/demo-server/server.js` | 175 |
| `renderContextTable` | Function | `shared/demo-server/server.js` | 179 |
| `renderStars` | Function | `shared/demo-server/server.js` | 196 |
| `renderAuthHtml` | Function | `shared/demo-server/server.js` | 208 |
| `renderBugCard` | Function | `shared/demo-server/server.js` | 221 |
| `renderFeedbackCard` | Function | `shared/demo-server/server.js` | 237 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `RenderDashboard → EscapeHtml` | cross_community | 6 |
| `RenderDashboard → FormatContextLabel` | cross_community | 6 |
| `RegisterDashboardClient → EscapeHtml` | cross_community | 6 |
| `RegisterDashboardClient → FormatContextLabel` | cross_community | 6 |
| `RenderDashboard → RenderStars` | cross_community | 5 |
| `RegisterDashboardClient → RenderStars` | cross_community | 5 |

## How to Explore

1. `gitnexus_context({name: "renderNoData"})` — see callers and callees
2. `gitnexus_query({query: "demo-server"})` — find related execution flows
3. Read key files listed above for implementation details
