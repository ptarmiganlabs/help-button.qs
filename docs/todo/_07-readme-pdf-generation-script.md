# Move README PDF Generation Into A Repo Script

## Current delta

- Onboard.qs has a dedicated PDF generator script at `/Users/goran/code/onboard.qs/scripts/generate-readme-pdf.mjs` and exposes it through `package.json` scripts.
- HelpButton.qs currently generates `README.pdf` inside `/Users/goran/code/helpbutton.qs/.github/workflows/ci.yaml` as inline shell commands.
- There is no `/Users/goran/code/helpbutton.qs/scripts/generate-readme-pdf.mjs` file today.

## Why this matters

- A repo-local script is reusable from both CI and a maintainer workstation.
- Moving complex shell logic out of workflow YAML reduces CI duplication and makes the PDF process testable.
- It also makes PDF generation easier to document and debug without editing workflow files.

## Onboard reference

- `/Users/goran/code/onboard.qs/scripts/generate-readme-pdf.mjs`
- `/Users/goran/code/onboard.qs/package.json`

## Recommended target state for HelpButton.qs

- Add `scripts/generate-readme-pdf.mjs` to encapsulate Mermaid preprocessing, Chrome detection, and final PDF output.
- Expose the script through `package.json`, for example as `generate-pdf`.
- Update CI to call the repo script instead of carrying the full PDF logic inline.
- Preserve HelpButton.qs-specific requirements, including Mermaid handling and Chrome path resolution.

## Likely files to touch

- `/Users/goran/code/helpbutton.qs/scripts/generate-readme-pdf.mjs` - new script
- `/Users/goran/code/helpbutton.qs/package.json` - add script entry and any required dependency alignment
- `/Users/goran/code/helpbutton.qs/.github/workflows/ci.yaml` - replace inline PDF shell block with script invocation
- `/Users/goran/code/helpbutton.qs/README.md` or maintainer docs - optional local PDF-generation note

## Acceptance checks

- [ ] A repo-local script generates `README.pdf` successfully when run in the repository.
- [ ] CI calls the script instead of embedding the full PDF pipeline inline.
- [ ] The produced PDF matches the current release packaging expectations.
- [ ] Chrome or Chromium executable detection is handled by the script rather than duplicated in workflow YAML.
- [ ] Maintainers can reproduce the PDF locally with a documented command.
