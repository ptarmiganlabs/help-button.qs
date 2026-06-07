# Expand Dependabot To Cover Npm Dependencies

## Current delta

- Onboard.qs has a Dependabot config at `/Users/goran/code/onboard.qs/.github/dependabot.yml` that updates both `npm` and `github-actions` weekly.
- HelpButton.qs has `/Users/goran/code/helpbutton.qs/.github/dependabot.yml`, but it currently defines only `github-actions` updates.
- HelpButton.qs therefore relies on manual dependency bumps for `package.json` and `package-lock.json`.

## Why this matters

- HelpButton.qs has a non-trivial release and security pipeline with multiple build-time dependencies.
- Automated npm update PRs make dependency drift visible and keep security fixes moving.
- Using the same update principles across both repos reduces maintenance asymmetry.

## Onboard reference

- `/Users/goran/code/onboard.qs/.github/dependabot.yml`

## Recommended target state for HelpButton.qs

- Extend HelpButton.qs Dependabot configuration with an `npm` ecosystem block for the repository root.
- Preserve the current `github-actions` handling, including any ignore rules that exist for generated or compiler-managed workflow dependencies.
- Match cadence and grouping strategy with Onboard.qs unless there is a repo-specific reason not to.

## Likely files to touch

- `/Users/goran/code/helpbutton.qs/.github/dependabot.yml` - add npm update coverage
- `/Users/goran/code/helpbutton.qs/package.json` - no structural change required, but this becomes the update target
- `/Users/goran/code/helpbutton.qs/package-lock.json` - no immediate change required, but future Dependabot PRs will touch it
- `/Users/goran/code/helpbutton.qs/docs/extension-developer/DEVELOPMENT.md` or maintainer docs - optional note about automated update PRs

## Acceptance checks

- [ ] Dependabot is configured for both `github-actions` and `npm`.
- [ ] The npm block targets the repo root where `package.json` lives.
- [ ] Existing ignore rules that protect generated workflow dependencies are preserved.
- [ ] The resulting configuration would produce npm dependency update PRs without changing release behavior.
