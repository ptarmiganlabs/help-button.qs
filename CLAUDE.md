<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **qs-help-button** (3454 symbols, 5418 relationships, 198 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> In this multi-repo workspace, always include `-r qs-help-button` on GitNexus CLI commands.
>
> Start by checking index freshness with `npx gitnexus status -r qs-help-button`. If any GitNexus tool warns the index is stale, run `npx gitnexus analyze -r qs-help-button` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/qs-help-button/context` | Codebase overview, check index freshness |
| `gitnexus://repo/qs-help-button/clusters` | All functional areas |
| `gitnexus://repo/qs-help-button/processes` | All execution flows |
| `gitnexus://repo/qs-help-button/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
| Work in the Ui area (95 symbols) | `.claude/skills/generated/ui/SKILL.md` |
| Work in the Da area (43 symbols) | `.claude/skills/generated/da/SKILL.md` |
| Work in the De area (43 symbols) | `.claude/skills/generated/de/SKILL.md` |
| Work in the En area (43 symbols) | `.claude/skills/generated/en/SKILL.md` |
| Work in the Es area (43 symbols) | `.claude/skills/generated/es/SKILL.md` |
| Work in the Fi area (43 symbols) | `.claude/skills/generated/fi/SKILL.md` |
| Work in the Fr area (43 symbols) | `.claude/skills/generated/fr/SKILL.md` |
| Work in the No area (43 symbols) | `.claude/skills/generated/no/SKILL.md` |
| Work in the Pl area (43 symbols) | `.claude/skills/generated/pl/SKILL.md` |
| Work in the Sv area (43 symbols) | `.claude/skills/generated/sv/SKILL.md` |
| Work in the Util area (38 symbols) | `.claude/skills/generated/util/SKILL.md` |
| Work in the Platform area (19 symbols) | `.claude/skills/generated/platform/SKILL.md` |
| Work in the Demo-server area (17 symbols) | `.claude/skills/generated/demo-server/SKILL.md` |
| Work in the Scripts area (8 symbols) | `.claude/skills/generated/scripts/SKILL.md` |
| Work in the Property-panel area (8 symbols) | `.claude/skills/generated/property-panel/SKILL.md` |
| Work in the I18n area (5 symbols) | `.claude/skills/generated/i18n/SKILL.md` |
| Work in the CreateDefault area (4 symbols) | `.claude/skills/generated/createdefault/SKILL.md` |

<!-- gitnexus:end -->
