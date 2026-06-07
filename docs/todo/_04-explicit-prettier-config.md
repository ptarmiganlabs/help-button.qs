# Add An Explicit Prettier Configuration

## Current delta

- Onboard.qs has an explicit formatter configuration at `/Users/goran/code/onboard.qs/.prettierrc.yaml`.
- HelpButton.qs currently has formatting scripts in `/Users/goran/code/helpbutton.qs/package.json`, but no repo-local `.prettierrc` file was found.
- That means HelpButton.qs formatting depends on Prettier defaults instead of checked-in policy.

## Why this matters

- Formatting rules should be visible and versioned rather than implicit.
- An explicit Prettier file reduces editor-to-editor drift and makes future formatting changes deliberate.
- The repo already relies on formatting in automation, so the policy should be discoverable.

## Onboard reference

- `/Users/goran/code/onboard.qs/.prettierrc.yaml`

## Recommended target state for HelpButton.qs

- Add a checked-in `.prettierrc.yaml` at the repo root.
- Start from Onboard.qs values unless HelpButton.qs has a strong reason to diverge.
- Keep the existing format commands and `.prettierignore` behavior, but make the formatting policy explicit.
- Document any intentional deviation from Onboard.qs so the two repos do not drift silently.

## Likely files to touch

- `/Users/goran/code/helpbutton.qs/.prettierrc.yaml` - new formatter policy
- `/Users/goran/code/helpbutton.qs/package.json` - only if scripts need adjustment
- `/Users/goran/code/helpbutton.qs/README.md` or maintainer docs - optional formatting note

## Acceptance checks

- [ ] A `.prettierrc.yaml` file exists at the repo root.
- [ ] `npm run format` and `npm run format:check` use the checked-in policy without extra flags.
- [ ] Opening the repo in an editor with Prettier enabled applies the repo policy automatically.
- [ ] The chosen settings are either aligned with Onboard.qs or explicitly documented where they differ.
