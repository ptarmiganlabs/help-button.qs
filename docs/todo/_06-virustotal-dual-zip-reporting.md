# Expand VirusTotal Reporting To Cover Both Release Zips

## Current delta

- Onboard.qs downloads published release assets, extracts the inner extension zip from the outer release zip, scans both, and appends a combined results table to the GitHub release body.
- The reference workflow is `/Users/goran/code/onboard.qs/.github/workflows/virus-scan.yaml`.
- HelpButton.qs currently scans release `.zip` assets directly via `/Users/goran/code/helpbutton.qs/.github/workflows/virus-scan.yaml`, but it does not separately extract and report the inner extension zip.

## Why this matters

- End users install the inner extension zip, not just the outer release package.
- Reporting both scan targets gives clearer evidence for the exact shipped installer artifact.
- The Onboard approach produces a more useful release body because it distinguishes the outer download from the deployable extension package.

## Onboard reference

- `/Users/goran/code/onboard.qs/.github/workflows/virus-scan.yaml`

## Recommended target state for HelpButton.qs

- Update HelpButton.qs virus scanning to download release assets and locate the outer release zip.
- Extract `helpbutton-qs.zip` from the outer archive before scanning.
- Keep the existing release-triggered workflow model, but append a combined results table to the release body that shows both the outer package and the inner deployable extension zip.
- Reuse the direct VirusTotal API pattern for local extracted files if the release action still cannot scan them directly.

## Likely files to touch

- `/Users/goran/code/helpbutton.qs/.github/workflows/virus-scan.yaml` - main implementation target
- `/Users/goran/code/helpbutton.qs/docs/extension-developer/SECURITY.md` or future workflow docs - optional documentation update
- `/Users/goran/code/helpbutton.qs/release-config/readme-template.txt` - probably no change needed, but release packaging assumptions should be confirmed

## Acceptance checks

- [ ] The workflow downloads release assets after a release is published.
- [ ] The workflow extracts the inner `helpbutton-qs.zip` from the outer release archive.
- [ ] VirusTotal results are produced for both the outer release zip and the inner extension zip.
- [ ] The release body shows a human-readable table distinguishing the two files.
- [ ] The workflow still succeeds when the expected outer zip is missing by failing clearly or warning intentionally.
