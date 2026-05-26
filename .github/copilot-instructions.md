---
applyTo: "**"
---

# copilot-instructions.md

This file provides guidance to Copilot when working with code in this repository.

## 📚 Onboarding

At the start of each session, read:

1. The root `README.md`
2. `docs/template-fields.md`
3. `docs/RELEASE_PROCESS.md` when working on build, versioning, or CI

## 🧱 Project Basics

- The active product in this repository is a **Nebula.js-based Qlik Sense extension**.
- The extension is the **first-class root package**: package manifest, build scripts, source code, and release automation now live at the repository root.
- The extension source lives in `src/`, build and release helpers live in `scripts/`, and primary documentation lives in `docs/`.
- The repository has a build step. The main local validation commands are `PUPPETEER_SKIP_DOWNLOAD=true npm ci`, `npm run lint`, and `npm run pack:prod` from the repository root.
- Legacy HTML injection variants still exist under `legacy/variants/`, but they are archived and no longer part of active release/version automation.

## 📁 Project Structure

```
src/                          ← Extension source code
scripts/                      ← Build and release helpers
docs/                         ← Extension and repo documentation
legacy/variants/              ← Archived HTML injection variants
shared/demo-server/           ← Express.js webhook demo (dev only, shared)
```

## 🚀 Deployment Model

Users deploy by:

1. Building or downloading the compiled `helpbutton-qs.zip` extension package.
2. Importing that zip into Qlik Sense SaaS or client-managed Qlik Sense.
3. Placing the extension object on a sheet and configuring it in the property panel.

## ✍️ Coding Guidelines

- Keep changes focused on the active extension implementation in `src/` unless the task explicitly targets archived legacy variants.
- Preserve the existing root build and packaging flow built around Nebula, `scripts/post-build.mjs`, `scripts/zip-extension.mjs`, and `scripts/rc-version-helper.mjs`.
- Follow the existing code style: modern JavaScript modules for the extension, minimal unrelated reformatting, and narrow diffs.
- When changing docs or workflows, update root-first paths rather than reintroducing `extension/` assumptions.

## 🔄 Versioning

- Versions are managed by **release-please** via conventional commits.
- The active version files are the root `package.json` and `src/meta.json`.
- Archived legacy variants are no longer included in active release-please version bumps or release packaging.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `refactor:` for code restructuring
  - `chore:` for maintenance tasks

## 🚫 Repo Hygiene

- Do not commit `node_modules/`, build artifacts, or IDE-specific files.
- The `shared/demo-server/` directory is for development/testing only — it is not included in release packages.
- The `legacy/variants/` tree is archival. Do not expand or modernize it unless the task explicitly targets legacy maintenance.
- Keep diffs focused on the requested change — avoid drive-by formatting.
