# <Task title — action-oriented, e.g. "Move X Into A Repo Script">

## Current delta

- <Reference repo> has <feature/pattern> at `<path>` and <how it's exposed/used>.
- <Target repo> currently <how it handles this today — or "has no equivalent">.
- <Any other relevant gap or difference>.

<details>
<summary>Example</summary>

```markdown
- Onboard.qs has a dedicated PDF generator script at `/Users/goran/code/onboard.qs/scripts/generate-readme-pdf.mjs` and exposes it through `package.json` scripts.
- HelpButton.qs currently generates `README.pdf` inside `/Users/goran/code/helpbutton.qs/.github/workflows/ci.yaml` as inline shell commands.
- There is no `/Users/goran/code/helpbutton.qs/scripts/generate-readme-pdf.mjs` file today.
```
</details>

## Why this matters

- <Benefit 1 — e.g., reusability, testability, reduced duplication>.
- <Benefit 2 — e.g., easier debugging, consistency across repos>.
- <Benefit 3 if applicable>.

<details>
<summary>Example</summary>

```markdown
- A repo-local script is reusable from both CI and a maintainer workstation.
- Moving complex shell logic out of workflow YAML reduces CI duplication and makes the PDF process testable.
- It also makes PDF generation easier to document and debug without editing workflow files.
```
</details>

## Reference

- `<reference-repo>/<path-to-source-file>`
- `<reference-repo>/<path-to-related-config>`

<details>
<summary>Example</summary>

```markdown
- `<onboard-repo-root>/scripts/generate-readme-pdf.mjs`
- `<onboard-repo-root>/package.json`
```
</details>

## Recommended target state for <Target repo>

- <Concrete change 1 — what to add or modify>.
- <Concrete change 2 — how to expose or integrate it>.
- <Concrete change 3 — what to update or remove>.
- Preserve <target-repo>-specific requirements, including <list any>.

<details>
<summary>Example</summary>

```markdown
- Add `scripts/generate-readme-pdf.mjs` to encapsulate Mermaid preprocessing, Chrome detection, and final PDF output.
- Expose the script through `package.json`, for example as `generate-pdf`.
- Update CI to call the repo script instead of carrying the full PDF logic inline.
- Preserve HelpButton.qs-specific requirements, including Mermaid handling and Chrome path resolution.
```
</details>

## Likely files to touch

- `<target-repo>/<path>` — <purpose: new file / edit / remove>
- `<target-repo>/<path>` — <purpose>
- `<target-repo>/<path>` — <purpose>

<details>
<summary>Example</summary>

```markdown
- `<helpbutton-repo-root>/scripts/generate-readme-pdf.mjs` - new script
- `<helpbutton-repo-root>/package.json` - add script entry and any required dependency alignment
- `<helpbutton-repo-root>/.github/workflows/ci.yaml` - replace inline PDF shell block with script invocation
- `<helpbutton-repo-root>/README.md` or maintainer docs - optional local PDF-generation note
```
</details>

## Acceptance checks

- [ ] <Testable outcome 1>
- [ ] <Testable outcome 2>
- [ ] <Testable outcome 3>
- [ ] <Testable outcome 4>
- [ ] <Testable outcome 5>

<details>
<summary>Example</summary>

```markdown
- [ ] A repo-local script generates `README.pdf` successfully when run in the repository.
- [ ] CI calls the script instead of embedding the full PDF pipeline inline.
- [ ] The produced PDF matches the current release packaging expectations.
- [ ] Chrome or Chromium executable detection is handled by the script rather than duplicated in workflow YAML.
- [ ] Maintainers can reproduce the PDF locally with a documented command.
```
</details>
