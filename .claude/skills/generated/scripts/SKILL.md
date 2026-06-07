---
name: scripts
description: 'Skill for the Scripts area of qs-help-button. 10 symbols across 4 files.'
---

# Scripts

10 symbols | 4 files | Cohesion: 100%

## When to Use

- Working with code in `scripts/`
- Understanding how run, parseSemver, semverToString work
- Modifying scripts-related functionality

## Key Files

| File                              | Symbols                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `scripts/rc-version-helper.mjs`   | run, parseSemver, semverToString, bumpVersion, highestChangeTypeFromCommits (+1) |
| `scripts/generate-readme-pdf.mjs` | detectChrome, main                                                               |
| `scripts/build-date.cjs`          | buildDateString                                                                  |
| `scripts/post-build.mjs`          | main                                                                             |

## Key Symbols

| Symbol                         | Type     | File                              | Line |
| ------------------------------ | -------- | --------------------------------- | ---- |
| `run`                          | Function | `scripts/rc-version-helper.mjs`   | 9    |
| `parseSemver`                  | Function | `scripts/rc-version-helper.mjs`   | 26   |
| `semverToString`               | Function | `scripts/rc-version-helper.mjs`   | 42   |
| `bumpVersion`                  | Function | `scripts/rc-version-helper.mjs`   | 53   |
| `highestChangeTypeFromCommits` | Function | `scripts/rc-version-helper.mjs`   | 74   |
| `main`                         | Function | `scripts/rc-version-helper.mjs`   | 98   |
| `buildDateString`              | Function | `scripts/build-date.cjs`          | 10   |
| `main`                         | Function | `scripts/post-build.mjs`          | 21   |
| `detectChrome`                 | Function | `scripts/generate-readme-pdf.mjs` | 15   |
| `main`                         | Function | `scripts/generate-readme-pdf.mjs` | 58   |

## Execution Flows

| Flow                    | Type            | Steps |
| ----------------------- | --------------- | ----- |
| `Main → ParseSemver`    | intra_community | 3     |
| `Main → SemverToString` | intra_community | 3     |

## How to Explore

1. `gitnexus_context({name: "run"})` — see callers and callees
2. `gitnexus_query({query: "scripts"})` — find related execution flows
3. Read key files listed above for implementation details
