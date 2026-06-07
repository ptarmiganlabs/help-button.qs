# Add Husky And Gitleaks Pre-Commit Enforcement

## Current delta

- Onboard.qs has a committed pre-commit hook at `/Users/goran/code/onboard.qs/.husky/pre-commit`.
- That hook runs `npx lint-staged` and then runs `gitleaks protect -v --staged` when `gitleaks` is installed locally.
- HelpButton.qs has `lint-staged` configuration in `/Users/goran/code/helpbutton.qs/package.json`, but no `.husky/` directory and no `prepare` script to install Git hooks.

## Why this matters

- HelpButton.qs already declares staged-file formatting and linting rules, but they are not automatically enforced before commit.
- A repo-local pre-commit hook catches formatting mistakes and obvious secret leaks before CI.
- Local enforcement reduces noisy CI churn and prevents accidental commits of credentials or tokens.

## Onboard reference

- `/Users/goran/code/onboard.qs/.husky/pre-commit`
- `/Users/goran/code/onboard.qs/package.json`

## Recommended target state for HelpButton.qs

- Add Husky as a dev dependency if it is not already present.
- Add a `prepare` script so local installs register the hook automatically.
- Add `.husky/pre-commit` that runs `npx lint-staged` and then optional `gitleaks protect -v --staged` with a friendly warning if `gitleaks` is absent.
- Keep the hook lightweight and aligned with the existing `lint-staged` patterns in HelpButton.qs.

## Likely files to touch

- `/Users/goran/code/helpbutton.qs/package.json` - add `husky` dependency and `prepare` script
- `/Users/goran/code/helpbutton.qs/package-lock.json` - dependency lock update
- `/Users/goran/code/helpbutton.qs/.husky/pre-commit` - new hook script
- `/Users/goran/code/helpbutton.qs/README.md` or maintainer docs - optional developer setup note

## Acceptance checks

- [ ] Running `npm install` or `npm ci` followed by `npm run prepare` installs the pre-commit hook.
- [ ] A sample staged JavaScript change triggers `lint-staged` through the hook.
- [ ] If `gitleaks` is installed, the hook runs `gitleaks protect -v --staged`.
- [ ] If `gitleaks` is not installed, the hook warns and continues instead of failing with an opaque shell error.
- [ ] The hook behavior is documented in maintainer-facing docs.
