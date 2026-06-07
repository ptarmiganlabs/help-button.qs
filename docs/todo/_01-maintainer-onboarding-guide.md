# Add A Maintainer Onboarding Guide

## Current delta

- Onboard.qs has a root-level maintainer guide at `/Users/goran/code/onboard.qs/AGENTS.md`.
- HelpButton.qs does not have an equivalent `/Users/goran/code/helpbutton.qs/AGENTS.md` file.
- As a result, build commands, release expectations, repo constraints, generated-artifact rules, and maintainer guardrails are spread across `README.md`, `docs/extension-developer/DEVELOPMENT.md`, `docs/extension-developer/RELEASE_PROCESS.md`, workflow files, and repo conventions.

## Why this matters

- New maintainers and Copilot sessions need a single operational entry point.
- A root maintainer guide reduces drift between scripts, workflows, and human process.
- HelpButton.qs already has enough complexity in build, release, prerelease, and security handling that scattered guidance increases error risk.

## Onboard reference

- Primary reference: `/Users/goran/code/onboard.qs/AGENTS.md`
- Key sections worth mirroring in HelpButton form:
    - onboarding reads
    - required quality gates
    - quick commands
    - project basics and architecture summary
    - repo constraints and generated-artifact rules
    - release process notes
    - repo hygiene

## Recommended target state for HelpButton.qs

- Add a root-level `AGENTS.md` file in HelpButton.qs.
- Make it the maintainer-focused entry point for day-to-day work rather than end-user documentation.
- Keep the content short and operational. It should summarize the authoritative docs rather than duplicate them.
- Include explicit instructions for HelpButton.qs specifics such as root-first source layout, prerelease branch behavior, SBOM generation, README PDF generation, and workflow hardening expectations.

## Likely files to touch

- `/Users/goran/code/helpbutton.qs/AGENTS.md` - new maintainer guide
- `/Users/goran/code/helpbutton.qs/README.md` - optional cross-link to maintainer docs
- `/Users/goran/code/helpbutton.qs/docs/extension-developer/DEVELOPMENT.md` - trim overlap or cross-link
- `/Users/goran/code/helpbutton.qs/docs/extension-developer/RELEASE_PROCESS.md` - cross-link for detailed release flow

## Acceptance checks

- [ ] `AGENTS.md` exists at the repo root.
- [ ] The file lists the required local quality gates and the canonical build and packaging commands.
- [ ] The file calls out generated artifacts and files that should normally not be edited directly.
- [ ] The file links or points to the deeper release and security docs instead of duplicating them.
- [ ] A maintainer can find the normal edit-build-release workflow from this file without opening the workflow YAML first.
