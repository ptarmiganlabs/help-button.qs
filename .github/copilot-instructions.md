---
applyTo: '**'
---

# copilot-instructions.md

This file provides guidance to Copilot when working with code in this repository.

## 📚 Onboarding

At the start of each session, read:

1. The root `README.md`
2. Each variant's `README.md` (in `variants/basic/` and `variants/bug-report/`)
3. `docs/template-fields.md`

## 🧱 Project Basics

- This is a **vanilla JavaScript** project with **zero external dependencies**.
- There is **no build step** — files are deployed as-is to Qlik Sense servers.
- Each variant is a self-contained **IIFE** (Immediately Invoked Function Expression) in `helpbutton-qs.js`.
- Configuration is loaded from a separate `helpbutton-qs.config.js` file that sets `window.helpButtonQsConfig`.
- The project uses **ES5-compatible** JavaScript for broad browser support within Qlik Sense.

## 📁 Project Structure

```
variants/
  basic/                 ← Basic help button (toolbar button + popup menu)
    helpbutton-qs.js           Main script (IIFE)
    helpbutton-qs.config.js    Configuration template
    loader-snippet.html        HTML to paste into client.html
    README.md                  Deployment docs
  bug-report/            ← Extended variant with bug-report dialog
    helpbutton-qs.js           Main script (IIFE)
    helpbutton-qs.config.js    Configuration template
    loader-snippet.html        HTML to paste into client.html
    README.md                  Deployment docs
shared/
  demo-server/               Express.js webhook demo (dev only, shared)
```

## 🚀 Deployment Model

Users deploy by:
1. Copying `helpbutton-qs.js` and `helpbutton-qs.config.js` to `C:\Program Files\Qlik\Sense\Client\custom\` on the Qlik Sense server.
2. Adding two `<script>` tags (from `loader-snippet.html`) to `C:\Program Files\Qlik\Sense\Client\client.html`.
3. Restarting Qlik Sense services.

## ✍️ Coding Guidelines

- **No build tools, transpilers, or bundlers.** Code must work as-is in the browser.
- **No external dependencies.** Everything is vanilla JS + browser APIs.
- **IIFE pattern.** All code must be wrapped in `(function () { 'use strict'; ... })();` to avoid polluting the global scope.
- **ES5 compatible** — use `var`, not `let`/`const`. Use function expressions, not arrow functions.
- Keep each variant **fully self-contained** — no shared imports between variants.
- Configuration is read from `window.helpButtonQsConfig`, merged with `DEFAULT_CONFIG` defaults.
- DOM manipulation targets Qlik Sense's toolbar structure (`.qs-toolbar`, `#qv-toolbar-search-toggle`, etc.).

## 🔄 Versioning

- Versions are managed by **release-please** via conventional commits.
- The `@version` JSDoc tag in each variant's `helpbutton-qs.js` is updated automatically by release-please.
- Both variants share the same version number.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `refactor:` for code restructuring
  - `chore:` for maintenance tasks

## 🚫 Repo Hygiene

- Do not commit `node_modules/`, build artifacts, or IDE-specific files.
- The `shared/demo-server/` directory is for development/testing only — it is not included in release packages.
- Keep diffs focused on the requested change — avoid drive-by formatting.
