---
name: demo-server
description: 'Skill for the Demo-server area of qs-help-button. 17 symbols across 1 files.'
---

# Demo-server

17 symbols | 1 files | Cohesion: 87%

## When to Use

- Working with code in `shared/`
- Understanding how renderNoData, renderBugList, renderFeedbackList work
- Modifying demo-server-related functionality

## Key Files

| File                           | Symbols                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `shared/demo-server/server.js` | renderNoData, renderBugList, renderFeedbackList, createDashboardSnapshot, writeSseEvent (+12) |

## Key Symbols

| Symbol                    | Type     | File                           | Line |
| ------------------------- | -------- | ------------------------------ | ---- |
| `renderNoData`            | Function | `shared/demo-server/server.js` | 209  |
| `renderBugList`           | Function | `shared/demo-server/server.js` | 242  |
| `renderFeedbackList`      | Function | `shared/demo-server/server.js` | 248  |
| `createDashboardSnapshot` | Function | `shared/demo-server/server.js` | 254  |
| `writeSseEvent`           | Function | `shared/demo-server/server.js` | 263  |
| `broadcastDashboardEvent` | Function | `shared/demo-server/server.js` | 268  |
| `renderDashboardScript`   | Function | `shared/demo-server/server.js` | 279  |
| `renderDashboard`         | Function | `shared/demo-server/server.js` | 399  |
| `registerDashboardClient` | Function | `shared/demo-server/server.js` | 456  |
| `formatContextFields`     | Function | `shared/demo-server/server.js` | 139  |
| `escapeHtml`              | Function | `shared/demo-server/server.js` | 163  |
| `formatContextLabel`      | Function | `shared/demo-server/server.js` | 171  |
| `renderContextTable`      | Function | `shared/demo-server/server.js` | 175  |
| `renderStars`             | Function | `shared/demo-server/server.js` | 188  |
| `renderAuthHtml`          | Function | `shared/demo-server/server.js` | 200  |
| `renderBugCard`           | Function | `shared/demo-server/server.js` | 213  |
| `renderFeedbackCard`      | Function | `shared/demo-server/server.js` | 229  |

## Execution Flows

| Flow                                           | Type            | Steps |
| ---------------------------------------------- | --------------- | ----- |
| `RenderDashboard → EscapeHtml`                 | cross_community | 6     |
| `RenderDashboard → FormatContextLabel`         | cross_community | 6     |
| `RegisterDashboardClient → EscapeHtml`         | cross_community | 6     |
| `RegisterDashboardClient → FormatContextLabel` | cross_community | 6     |
| `RenderDashboard → RenderStars`                | cross_community | 5     |
| `RegisterDashboardClient → RenderStars`        | cross_community | 5     |

## How to Explore

1. `gitnexus_context({name: "renderNoData"})` — see callers and callees
2. `gitnexus_query({query: "demo-server"})` — find related execution flows
3. Read key files listed above for implementation details
