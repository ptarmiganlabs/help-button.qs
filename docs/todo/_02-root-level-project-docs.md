# Add Root-Level Project Docs For Maintainers

## Current delta

- Onboard.qs has a root-level documentation set under `/Users/goran/code/onboard.qs/docs/`, including `ARCHITECTURE.md`, `BUILD-AND-DEPLOYMENT.md`, `GITHUB_WORKFLOWS.md`, and `SECURITY.md`.
- HelpButton.qs currently has `docs/app-developer/`, `docs/extension-developer/`, `docs/img/`, and `docs/todo/`, but no equivalent root-level maintainer docs set.
- HelpButton.qs does contain detailed topic docs such as `docs/extension-developer/DEVELOPMENT.md`, `docs/extension-developer/RELEASE_PROCESS.md`, and `docs/extension-developer/SECURITY.md`, but the maintainership view is more fragmented.

## Why this matters

- Root-level system docs make it easier to understand the repo before drilling into audience-specific material.
- They are useful for both humans and Copilot because they expose architecture, workflow inventory, and build/release flow at a glance.
- HelpButton.qs has enough release and workflow sophistication that the lack of a top-level systems view slows onboarding.

## Onboard reference

- `/Users/goran/code/onboard.qs/docs/ARCHITECTURE.md`
- `/Users/goran/code/onboard.qs/docs/BUILD-AND-DEPLOYMENT.md`
- `/Users/goran/code/onboard.qs/docs/GITHUB_WORKFLOWS.md`
- `/Users/goran/code/onboard.qs/docs/SECURITY.md`

## Recommended target state for HelpButton.qs

- Add a small root-level maintainer doc set under `docs/` for system overviews.
- Keep the existing `docs/app-developer/` and `docs/extension-developer/` structure for audience-specific material.
- Use the new root docs to summarize the architecture, build and packaging flow, workflow inventory, and security model, then link to the deeper extension-developer docs where the detail already exists.
- Avoid copy-paste duplication where an existing HelpButton document is already authoritative.

## Likely files to touch

- `/Users/goran/code/helpbutton.qs/docs/ARCHITECTURE.md` - new top-level architecture map
- `/Users/goran/code/helpbutton.qs/docs/BUILD-AND-DEPLOYMENT.md` - new top-level build and release flow
- `/Users/goran/code/helpbutton.qs/docs/GITHUB_WORKFLOWS.md` - new workflow inventory and intent map
- `/Users/goran/code/helpbutton.qs/docs/SECURITY.md` - optional new top-level system-security overview if the existing extension-developer security doc remains detailed and audience-specific
- `/Users/goran/code/helpbutton.qs/docs/extension-developer/DEVELOPMENT.md` - cross-link target
- `/Users/goran/code/helpbutton.qs/docs/extension-developer/RELEASE_PROCESS.md` - cross-link target
- `/Users/goran/code/helpbutton.qs/docs/extension-developer/SECURITY.md` - cross-link target

## Acceptance checks

- [ ] The `docs/` folder contains top-level maintainership docs for architecture, build and deployment, and GitHub workflows.
- [ ] The new docs point to existing deeper documents instead of recreating all detail.
- [ ] A maintainer can identify the main runtime surfaces, packaging flow, and workflow purposes from the new top-level docs.
- [ ] The distinction between end-user docs and maintainer docs is clearer than it is today.
