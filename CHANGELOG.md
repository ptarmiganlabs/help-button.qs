# Changelog

## [3.1.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v3.0.0...helpbutton-qs-v3.1.0) (2026-06-07)


### Features

* Add todo template for structured handling of in-repo todo items ([f1fa0ff](https://github.com/ptarmiganlabs/help-button.qs/commit/f1fa0fff5e13d9dc16c291f6e318fbfadad810d4))
* enhance GitNexus code intelligence documentation with CLI commands and usage guidelines ([3e6cf69](https://github.com/ptarmiganlabs/help-button.qs/commit/3e6cf69f7673141acc75d1e52fc8c2411c4bb8c8))
* Enhance VirusTotal workflow to scan both inner and outer ZIP files ([c710b93](https://github.com/ptarmiganlabs/help-button.qs/commit/c710b93f0c46e9b575e82a7e8beed850c119e27c))


### Bug Fixes

* harden VirusTotal release workflow ([581506e](https://github.com/ptarmiganlabs/help-button.qs/commit/581506e0a5de2f83f986cd49cd4c93c4e3e681c1))
* harden VirusTotal release workflow ([897a373](https://github.com/ptarmiganlabs/help-button.qs/commit/897a373b9c355191b7e2b634b28af3377592da64))
* harden VirusTotal release workflow ([b0030b8](https://github.com/ptarmiganlabs/help-button.qs/commit/b0030b8c246f9841567dc580dfedc82e9b2ab1fc))
* harden VirusTotal release workflow ([4c84832](https://github.com/ptarmiganlabs/help-button.qs/commit/4c848327533504d4c8d7eb9899c6ef169dd49f97))
* harden VirusTotal release workflow ([1793686](https://github.com/ptarmiganlabs/help-button.qs/commit/1793686d8927f8a9abcee7ced02325f67a356e34))
* harden VirusTotal release workflow ([4ffd88e](https://github.com/ptarmiganlabs/help-button.qs/commit/4ffd88ec380c5bfe260d5694463564cc13b2b2e5))
* update dependabot configuration for npm and github-actions ([bd01c50](https://github.com/ptarmiganlabs/help-button.qs/commit/bd01c50539eac7831be3681f472542242909b89e))
* Update todo template with examples ([2e10f42](https://github.com/ptarmiganlabs/help-button.qs/commit/2e10f42796a522fde96ebe6656a646c01a5db2be))


### Miscellaneous

* add Gitleaks configuration to ignore placeholder API keys ([59dd0cc](https://github.com/ptarmiganlabs/help-button.qs/commit/59dd0cc34d217479cfe09a88912c3b1a15c7ef5d))
* add husky pre-commit hook with lint-staged and gitleaks ([667f1a5](https://github.com/ptarmiganlabs/help-button.qs/commit/667f1a5f9c542bf35d24ec6e6e990ba73d4e4080))
* add Prettier configuration file for code formatting ([e6396a8](https://github.com/ptarmiganlabs/help-button.qs/commit/e6396a88b3f5224733b424dec92ce5d191681e42))
* **deps:** bump github/codeql-action from 4.35.5 to 4.36.0 ([e841b60](https://github.com/ptarmiganlabs/help-button.qs/commit/e841b601a9c32531a1f480a5f33455932ff29ee3))
* **deps:** bump github/codeql-action from 4.35.5 to 4.36.0 ([28dcc25](https://github.com/ptarmiganlabs/help-button.qs/commit/28dcc25b9f1ded441497b3807c12fff98c0a2ea8))
* update all source code with new, uniform format ([bee2024](https://github.com/ptarmiganlabs/help-button.qs/commit/bee2024eeeb58524a09ffa3086ef8b22819a27c3))
* update demo server to use Node 24 ([1ba7e0f](https://github.com/ptarmiganlabs/help-button.qs/commit/1ba7e0f905d72a2f82ad1d50531dea0ef30363be))
* update dependencies to latest versions ([047ca43](https://github.com/ptarmiganlabs/help-button.qs/commit/047ca43ca1d3df001c1107dc5921e47b7baca4f2))
* update Node.js version to 24 in configuration files and documentation ([88b6e59](https://github.com/ptarmiganlabs/help-button.qs/commit/88b6e593a334f80a20cf5c0c33b9e4832fb1d711))


### Refactoring

* Improve PDF generation during CI workflow ([4f51f53](https://github.com/ptarmiganlabs/help-button.qs/commit/4f51f5333e6724d18a2af00a1b3c5a728421cc52))


### Documentation

* add security overview for app developers ([41d592d](https://github.com/ptarmiganlabs/help-button.qs/commit/41d592d2ccf970fca68a341cecd2d874d22ea203))
* enhance todo template with file naming guidelines ([0260f40](https://github.com/ptarmiganlabs/help-button.qs/commit/0260f40d3a7a520427bc2288967a5434a931e589))

## [3.0.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.7.0...helpbutton-qs-v3.0.0) (2026-05-29)

### ⚠ BREAKING CHANGES

- **auth:** Remove the "Sense session" auth strategy, as it really had nothing to do with Sense auth...

### Features

- add configurable menu item merge modes ([b42b371](https://github.com/ptarmiganlabs/help-button.qs/commit/b42b371dabc97d1443a6d01e172a5a0d3e6483ac))
- add live updates to demo server dashboard ([1299b7a](https://github.com/ptarmiganlabs/help-button.qs/commit/1299b7a7cd4f6213eb6b5f7c32849aef6625ed38))
- **auth:** Remove the "Sense session" auth strategy, as it really had nothing to do with Sense auth... ([27852d3](https://github.com/ptarmiganlabs/help-button.qs/commit/27852d3f6afbde8f4be41b03299507f46447fb02))
- **security:** Add new zizmor workflow ([7f54110](https://github.com/ptarmiganlabs/help-button.qs/commit/7f54110217fe4070a5cb1bc2fe0028e4b7e06848))

### Bug Fixes

- clamp rating to [1,5] to prevent resource exhaustion in demo-server ([4d6a13c](https://github.com/ptarmiganlabs/help-button.qs/commit/4d6a13c2649f69e2382d497c97cd6b248e4ec67b))
- disable funding via Polar, as they cannot handle Github sponsorships (according to their won support) ([b1e2886](https://github.com/ptarmiganlabs/help-button.qs/commit/b1e2886be71b21e409389c9cc197412c1541514c))
- guard renderStars against resource exhaustion via unbounded repeat() ([40787d0](https://github.com/ptarmiganlabs/help-button.qs/commit/40787d056180ee0944d9d2c0e07fabf49ed54b3c))
- log resolved merge mode in debug output, not raw undefined ([604718c](https://github.com/ptarmiganlabs/help-button.qs/commit/604718c546148be997728ade3c07df6221f28aaf))
- require integer feedback ratings in demo server ([b15a278](https://github.com/ptarmiganlabs/help-button.qs/commit/b15a27833fe981e4a6947b3683f79b3260b157aa))
- simplify release artifact upload glob ([dfdbcde](https://github.com/ptarmiganlabs/help-button.qs/commit/dfdbcde362ce9ee62d374e97caf1df2fd6591d39))
- tighten release SBOM generation ([c515d71](https://github.com/ptarmiganlabs/help-button.qs/commit/c515d712d9b377972d49f01e6a9d3898f4cada23))
- Update conditional checks for repository owner in CI workflows ([fdeca39](https://github.com/ptarmiganlabs/help-button.qs/commit/fdeca399d766ae719d2dc95b64ea45f68b652db9))
- use comma-separated release artifacts ([2ab1158](https://github.com/ptarmiganlabs/help-button.qs/commit/2ab115811235d3c24c59c0a480d84dcbecbe53bb))
- validate rating in renderStars to prevent resource exhaustion ([fb5fbd0](https://github.com/ptarmiganlabs/help-button.qs/commit/fb5fbd060995c7d0f4ca180c24a66504cef76d9f))

### Miscellaneous

- **demo server:** update deps to latest versions ([9ea0669](https://github.com/ptarmiganlabs/help-button.qs/commit/9ea0669ecda96d45b84e8c0a2defa3673b3a532a))
- **deps:** bump astral-sh/setup-uv from 8.0.0 to 8.1.0 ([2b62380](https://github.com/ptarmiganlabs/help-button.qs/commit/2b6238038b672d1cfd83dbbca84e1a6131db08ba))
- **deps:** bump webpack-dev-server ([2cfbcab](https://github.com/ptarmiganlabs/help-button.qs/commit/2cfbcab2c96892ac0c50a795313aaeb047032e2d))
- **deps:** bump webpack-dev-server from 5.2.3 to 5.2.4 in the npm_and_yarn group across 1 directory ([b7cdac2](https://github.com/ptarmiganlabs/help-button.qs/commit/b7cdac2ccca33aa3ad4d7fc678fdcbfdd2ba5e5f))
- Move legacy HTML inject help button to legacy folder ([e3b6764](https://github.com/ptarmiganlabs/help-button.qs/commit/e3b6764f9209ff8c99b4c7f6f57aa26778821e80))

### Refactoring

- align stored demo rating with integer validation ([21bc131](https://github.com/ptarmiganlabs/help-button.qs/commit/21bc1315950aeb188ace82b746cc9223133db0f6))
- clarify inline comments in mergeMenuItems two-pass logic ([b4d0c85](https://github.com/ptarmiganlabs/help-button.qs/commit/b4d0c859decaf7db0145e7ef9778f365f01b3b08))
- normalize menu merge mode internally ([04514fb](https://github.com/ptarmiganlabs/help-button.qs/commit/04514fb9e11657cb3e366e1e9b0b215cc4cb33c8))
- replace O(n²) splice dedup with O(n) two-pass approach in mergeMenuItems ([9ea62e3](https://github.com/ptarmiganlabs/help-button.qs/commit/9ea62e3d0df85f39add45096453150f0cbf967ea))

### Documentation

- add menu items property refs ([42f5ed5](https://github.com/ptarmiganlabs/help-button.qs/commit/42f5ed5b6b73468431fb2e47177de68574045821))
- add missing JSDoc to source helpers ([9be3ab8](https://github.com/ptarmiganlabs/help-button.qs/commit/9be3ab81e41f7c4b4f7e7b0f315b7b31e1944844))
- add README security stance ([ee5c447](https://github.com/ptarmiganlabs/help-button.qs/commit/ee5c44723ca7b8fdcb53876e9c6c49759c399ab1))
- add supply-chain security note ([7837e46](https://github.com/ptarmiganlabs/help-button.qs/commit/7837e46ef5c7f54fdfb45bf499fd1384d537c9a9))
- align JSDoc formatting with review feedback ([d3cfd96](https://github.com/ptarmiganlabs/help-button.qs/commit/d3cfd96eeeca5aa5c0671306af2dbd1f815fefcd))
- clarify menu merge behavior ([492a7e6](https://github.com/ptarmiganlabs/help-button.qs/commit/492a7e6f8049cc478164a1f3558195e27150c190))
- clarify menu merge comment ([640229c](https://github.com/ptarmiganlabs/help-button.qs/commit/640229c99d83035e90a27f7c016bb96ceec46987))
- clarify merge mode property and caveat ([4ead1ed](https://github.com/ptarmiganlabs/help-button.qs/commit/4ead1ed1dfa517b6f1da5897b17120f4f18c0f01))
- clarify security review follow-up note ([f74a761](https://github.com/ptarmiganlabs/help-button.qs/commit/f74a7612901300a250d0c00999586b91a499f149))
- clarify unlabeled merge behavior ([f49aada](https://github.com/ptarmiganlabs/help-button.qs/commit/f49aadaa3eada1f3f86635d10ead1e993cdece73))
- correct capitalization in project title ([477fce3](https://github.com/ptarmiganlabs/help-button.qs/commit/477fce3cfbf531ba8c145629924300dfc8ff0146))
- record 2026 security review findings ([f3b68da](https://github.com/ptarmiganlabs/help-button.qs/commit/f3b68da2a857d5efd827f7f1193e52fe8bc32b81))
- reorganize documentation by audience ([f99eeff](https://github.com/ptarmiganlabs/help-button.qs/commit/f99eeffd7f6590b7479ec28907a6b2b713885449))
- update security findings in release workflow section ([c4d3dd8](https://github.com/ptarmiganlabs/help-button.qs/commit/c4d3dd8ae129e209ed2171f94282b2dc8212a099))

## [2.7.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.6.0...helpbutton-qs-v2.7.0) (2026-05-27)

### Features

- add cooldown period for new npm libraries ([bf2c821](https://github.com/ptarmiganlabs/help-button.qs/commit/bf2c8212d2171fdc3b483efd3053d48659cb57df))
- add more icon options for help menu items and toolbar button ([ff27d4e](https://github.com/ptarmiganlabs/help-button.qs/commit/ff27d4e2d70971685486a1eca0eb25f4139ef68b))
- Add optional payload viewer to bug report/feedback dialogs ([662fc78](https://github.com/ptarmiganlabs/help-button.qs/commit/662fc78a4777c0823aa664d45dbfc5dec0d4e573))
- add video embed support in markdown content (@[title](url) syntax) ([7743046](https://github.com/ptarmiganlabs/help-button.qs/commit/774304646ac611124a7e59ee3f71df95ff6beabb))
- add video embed support in tooltip and dialog markdown content ([2968b03](https://github.com/ptarmiganlabs/help-button.qs/commit/2968b03f06591558869f1942c6127534c5b72dd7))
- **security:** do security review and take needed actions to mitigate findings ([2e8cf74](https://github.com/ptarmiganlabs/help-button.qs/commit/2e8cf74b8f985d4b120340b1ccf67c0fba8beea3))

### Bug Fixes

- remove Sense session (XRF key) auth mode from the extension variant, warn and fall back to `none` for saved obsolete values, and align the demo server with current extension auth modes
- address code review - remove autoplay, tighten placeholder regex, improve slot pattern ([18aca01](https://github.com/ptarmiganlabs/help-button.qs/commit/18aca0103f1ba1b3a2f566c302a5a3df48ccc012))
- address latest payload viewer review comments ([c72769e](https://github.com/ptarmiganlabs/help-button.qs/commit/c72769e3579f9eaee713195f28350a14bd99a15e))
- address payload viewer review feedback ([986a6b2](https://github.com/ptarmiganlabs/help-button.qs/commit/986a6b2be04ba75156474020e9c4e37208b1e064))
- Address PR review feedback for payload viewer ([e68cd4f](https://github.com/ptarmiganlabs/help-button.qs/commit/e68cd4f76a73fb268e5e20374079eb513d19f0ee))
- pin checkout action in copilot setup workflow ([a21ad2d](https://github.com/ptarmiganlabs/help-button.qs/commit/a21ad2d20b6b8ed1211e5c781d3d6a0754bb1d09))
- remove iframe sandbox attr (YouTube Error 153) and add min-width for hover popup video ([9d9a285](https://github.com/ptarmiganlabs/help-button.qs/commit/9d9a2850889eb02a962767c1fb341d5c47eead10))
- show generated xrf key in payload viewer ([f2f7d07](https://github.com/ptarmiganlabs/help-button.qs/commit/f2f7d0727e71a9c9cc5a1fa5a57b495f0bf04074))
- update video embed URL format for YouTube in markdown toolbar ([8b177fb](https://github.com/ptarmiganlabs/help-button.qs/commit/8b177fbe970e7a9b7d29886532e1d84740348e89))
- Use word-boundary matching for sensitive header detection and remove unused regex params ([d54b8dc](https://github.com/ptarmiganlabs/help-button.qs/commit/d54b8dcd81671fb172bc84771c14b21d45d572f4))

### Miscellaneous

- **deps:** bump actions/checkout from 4.2.2 to 6.0.2 ([a58a593](https://github.com/ptarmiganlabs/help-button.qs/commit/a58a5933a63dfe261e04e2d87100ab8bab1235dd))
- **deps:** bump crazy-max/ghaction-virustotal from 4.2.0 to 5.0.0 ([7d416f5](https://github.com/ptarmiganlabs/help-button.qs/commit/7d416f511c51cfbaefb965a92b7397638afac2ec))
- **deps:** bump github/codeql-action from 4.31.7 to 4.35.5 ([f99198e](https://github.com/ptarmiganlabs/help-button.qs/commit/f99198efebf5e5f340daa0b00f52442d84fceeff))
- **deps:** bump github/codeql-action from 4.31.7 to 4.35.5 ([563777e](https://github.com/ptarmiganlabs/help-button.qs/commit/563777eead46db0a35f4badaf73e40cb373fca97))
- **deps:** bump googleapis/release-please-action from 4.4.0 to 5.0.0 ([c2b3ada](https://github.com/ptarmiganlabs/help-button.qs/commit/c2b3ada59454ba02743194dcdf29eea6115bd303))
- **deps:** bump googleapis/release-please-action from 4.4.0 to 5.0.0 ([51d5442](https://github.com/ptarmiganlabs/help-button.qs/commit/51d544265a49a39a56afd52e740e1547a7e736f4))
- **deps:** bump ncipollo/release-action from 1.20.0 to 1.21.0 ([047e4e9](https://github.com/ptarmiganlabs/help-button.qs/commit/047e4e927ae0169ddf16a2838d3f5069e4976bcf))
- **deps:** bump ncipollo/release-action from 1.20.0 to 1.21.0 ([d647b50](https://github.com/ptarmiganlabs/help-button.qs/commit/d647b50b453d4b55c83adfedb40842a5ead448e5))
- merge main branch (refactor-1) into PR branch, accept deletion of extension/README.md ([1d7fb2c](https://github.com/ptarmiganlabs/help-button.qs/commit/1d7fb2c2cc481b26be3afafc27e67718b9605a94))
- update archiver to version 8.0.0 and refactor zip creation accordingly ([23498b7](https://github.com/ptarmiganlabs/help-button.qs/commit/23498b7e734003844317945e61503d835d1a209f))

### Refactoring

- major restructure of the entire repository. HTML-native helpbuttons moved to legecy folder. ([da234a8](https://github.com/ptarmiganlabs/help-button.qs/commit/da234a856977209816bab6aacf28678da66a51d2))

### Documentation

- Add app developer docs for menu items and tooltips ([fda3155](https://github.com/ptarmiganlabs/help-button.qs/commit/fda31553064a36c51780edf64755645623876790))
- add cloud vs client-managed app guide ([c3f0d2d](https://github.com/ptarmiganlabs/help-button.qs/commit/c3f0d2d2c5f2f9dbd92663db78e520afe899f447))
- Add menu item documentation for app developers ([e3314c6](https://github.com/ptarmiganlabs/help-button.qs/commit/e3314c6ff1afc47892f469fca9af979156408aee))
- add property panel reference ([63dff6b](https://github.com/ptarmiganlabs/help-button.qs/commit/63dff6b8a309a8e7fe80b8206dbe43b323a5aaec))
- add template placeholder explanation ([b44ca26](https://github.com/ptarmiganlabs/help-button.qs/commit/b44ca269cb1ff114994bbb1561dbc2c6c05b0dea))
- document video embed feature in extension README ([3bfc6c4](https://github.com/ptarmiganlabs/help-button.qs/commit/3bfc6c45a480d27c2f8a5d96f081c11a6f5c8a35))
- enhance property panel reference with additional sections and details ([d65ae98](https://github.com/ptarmiganlabs/help-button.qs/commit/d65ae98f4f273a4471b4e1d1e8b59c349232536d))
- finalize property panel reference ([c383365](https://github.com/ptarmiganlabs/help-button.qs/commit/c383365615fa5abd04d47701e3725c950d6b5c85))
- fix bug report dialog heading ([31f8ec2](https://github.com/ptarmiganlabs/help-button.qs/commit/31f8ec2986e2f05fe197f25480f9b2c6d412c9e5))
- fix bug report webhook heading ([64b7471](https://github.com/ptarmiganlabs/help-button.qs/commit/64b74717481664d9d0a232e2a0595001479465da))
- fix two remaining README inaccuracies (Qlik Sense product name, Feedback auth description) ([89c97a5](https://github.com/ptarmiganlabs/help-button.qs/commit/89c97a5fafeff7b04ecbd799ba3f4098ad39eeff))
- merge main into PR branch and resolve conflict in extension/README.md ([ab30cc1](https://github.com/ptarmiganlabs/help-button.qs/commit/ab30cc1bd4e69062d4ee7b017b44fa07eb8408ba))
- polish platform comparison guide ([c9bcd79](https://github.com/ptarmiganlabs/help-button.qs/commit/c9bcd79d80283c61adbe48587513c4f454388e43))
- rewrite README for restructured repo — fix inaccuracies, add missing features ([f8f06ef](https://github.com/ptarmiganlabs/help-button.qs/commit/f8f06eff34306a19b92866a9d657f4cec97c9242))
- update extension README to match current feature set ([a364ec5](https://github.com/ptarmiganlabs/help-button.qs/commit/a364ec5adadda57b35183d71099295e240407dc5))
- update extension README to reflect current features accurately ([76bcfc0](https://github.com/ptarmiganlabs/help-button.qs/commit/76bcfc0a16f183e1df3e1df391941eaa5b2fe344))

## [2.6.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.5.7...helpbutton-qs-v2.6.0) (2026-03-31)

### Features

- enable duplicate command for menu items and tooltips in property panel ([55fc89b](https://github.com/ptarmiganlabs/help-button.qs/commit/55fc89b98b836649d9e16b552a2d89e1bedf9f7f))
- enable duplicate command for menu items and tooltips in property panel ([5d18ba3](https://github.com/ptarmiganlabs/help-button.qs/commit/5d18ba3392261e05a57409b833ac4aa8f0f4a20c))

### Bug Fixes

- keep focus on confirmation dialog when already open, update stale comment ([a3e5c50](https://github.com/ptarmiganlabs/help-button.qs/commit/a3e5c50465d2e2b1ad1b862ca1595f42c659fd4c))
- update express dependency to version 5.2.1 in demo server ([cc3d348](https://github.com/ptarmiganlabs/help-button.qs/commit/cc3d348e867962ac134bcd3bc956c2cb29bd824d))
- update express dependency to version 5.2.1 in demo server ([394bac4](https://github.com/ptarmiganlabs/help-button.qs/commit/394bac44b2cc09a33abc0596d5280b4d4da70de7))
- use factory functions for menu item defaults and improve dirty-tracking reliability ([1236654](https://github.com/ptarmiganlabs/help-button.qs/commit/12366541ee4525495f96950f54bee190f588935b))
- warn before discarding unsaved changes in Markdown editor dialog ([9e733d3](https://github.com/ptarmiganlabs/help-button.qs/commit/9e733d3b6bbe6201c461156f9f78623135f2d90e))

### Miscellaneous

- **ci:** update Node.js version to 24 in workflows ([97654f4](https://github.com/ptarmiganlabs/help-button.qs/commit/97654f4412bc79d79c8202fe249c43d949cdda62))
- update nebula.js dependencies and eslint version in package.json ([6600fba](https://github.com/ptarmiganlabs/help-button.qs/commit/6600fbacdcb04eaf8f96e957d53cd3c3d56f4a24))

### Refactoring

- refactor menu item configurations to use shared templates for bug reports and feedback ([288b054](https://github.com/ptarmiganlabs/help-button.qs/commit/288b054f01ac393a562be6f8b83eabbc4da22fc0))

## [2.5.7](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.5.6...helpbutton-qs-v2.5.7) (2026-03-25)

### Bug Fixes

- **ci:** extract semver from tag by stripping package prefix (e.g. helpbutton-qs-v) ([c67925a](https://github.com/ptarmiganlabs/help-button.qs/commit/c67925ab8f3946563f621066deb58493f14ec3f0))
- **ci:** prevent duplicate pre-release suffix in artifact names ([e1b7ab8](https://github.com/ptarmiganlabs/help-button.qs/commit/e1b7ab87efa1e0cffb76b43fe05e87c0f7d82744))
- **ci:** prevent duplicate pre-release suffix in artifact names ([4225293](https://github.com/ptarmiganlabs/help-button.qs/commit/42252936c10a404860e96eca7d0957041b9be658))
- **ci:** strip package prefix from release tag to extract clean semver ([2e15e45](https://github.com/ptarmiganlabs/help-button.qs/commit/2e15e4567bbb4af9fb5c1a112795944a0a9060bc))

### Documentation

- add release process documentation ([9f681d0](https://github.com/ptarmiganlabs/help-button.qs/commit/9f681d0c76fc29ca5ad4b9ad966274cb8f0b684f))

## [2.5.6](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.5.5...helpbutton-qs-v2.5.6) (2026-03-24)

### Documentation

- enhance decision tree in pre-release process with color-coded classes ([7cf3698](https://github.com/ptarmiganlabs/help-button.qs/commit/7cf3698ca46f03c2a9dcb06a0d223e05d5e88140))

## [2.5.5](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.5.4...helpbutton-qs-v2.5.5) (2026-03-24)

### Miscellaneous

- reset release-please manifest baseline ([c3c99c0](https://github.com/ptarmiganlabs/help-button.qs/commit/c3c99c0e16657021d7582a44de12db807aef13e2))

### Documentation

- enhance pre-release workflow with decision tree and iteration steps ([87fdb31](https://github.com/ptarmiganlabs/help-button.qs/commit/87fdb31806a51ecf79ac956e3b241aa2eeff8cbd))

## [2.5.4](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.5.3...helpbutton-qs-v2.5.4) (2026-03-24)

### Bug Fixes

- Add pre-release suffix to release asset ZIP files. ([1554ec4](https://github.com/ptarmiganlabs/help-button.qs/commit/1554ec421d1a9bc2897cd24b924bf376f8e88a6d))
- **ci:** add checkout step to release-please job ([98918ac](https://github.com/ptarmiganlabs/help-button.qs/commit/98918ac9bca026f172d51304121900042af1b1ed))
- **ci:** pin checkout action to SHA ([7c12eb8](https://github.com/ptarmiganlabs/help-button.qs/commit/7c12eb810b2b552f1abe44ee29b241303c7dbbd9))

### Miscellaneous

- **pre-release/rc:** release helpbutton-qs 2.5.3 ([303cde5](https://github.com/ptarmiganlabs/help-button.qs/commit/303cde5b33bcb605e5f69766e26573eb6fd34ce4))

## [2.5.3](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.5.2...helpbutton-qs-v2.5.3) (2026-03-24)

### Documentation

- Include both extension specific, and repo general, PDFs in the distribution ZIP ([f73d4f0](https://github.com/ptarmiganlabs/help-button.qs/commit/f73d4f0c51a1f65b92114edb1563d92e362271b7))

## [2.5.2](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.5.1...helpbutton-qs-v2.5.2) (2026-03-22)

### Bug Fixes

- **ci:** enhance logging and pre-release name handling in CI workflow ([106971a](https://github.com/ptarmiganlabs/help-button.qs/commit/106971a463cada1aa9435543217b10fb323d580d))

## [2.5.1](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.5.0...helpbutton-qs-v2.5.1) (2026-03-22)

### Bug Fixes

- **ci:** enhance pre-release configuration for alpha, beta, and rc branches ([ccf0c02](https://github.com/ptarmiganlabs/help-button.qs/commit/ccf0c02f047bd60a71354c87fc2b09d30ffe467d))

## [2.5.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.4.0...helpbutton-qs-v2.5.0) (2026-03-22)

### Features

- Add support for multiple HelpButton.qs objects on same app sheet ([412686a](https://github.com/ptarmiganlabs/help-button.qs/commit/412686afa8fde208fbd8e1e8be287dacbc44a474))
- Enhance CI workflow for pre-release support and add pre-release documentation ([774d40e](https://github.com/ptarmiganlabs/help-button.qs/commit/774d40e917169cc9311b97c37e37f971db6daed0))

## [2.4.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.3.0...helpbutton-qs-v2.4.0) (2026-03-20)

### Features

- add build date + time to About section and About dialog ([c3cadac](https://github.com/ptarmiganlabs/help-button.qs/commit/c3cadac6632d9cdf13eb0afee75cf453b12f70e5))
- add configurable payload key names for webhook JSON fields ([672be29](https://github.com/ptarmiganlabs/help-button.qs/commit/672be2956650bc8b370109b637d44f146652439b))
- add custom payload key names for webhook JSON fields ([a3d0c28](https://github.com/ptarmiganlabs/help-button.qs/commit/a3d0c2893e4a8a6c393f2783fb1796e50713941b))
- add floating (drag-to-move) position option for tooltip icons ([dccb4dd](https://github.com/ptarmiganlabs/help-button.qs/commit/dccb4dd96f19e1e91428651f393400964dc32d9e))
- add inline code, ordered/unordered list, and blockquote shortcuts ([29c48a6](https://github.com/ptarmiganlabs/help-button.qs/commit/29c48a6e16ac37d24e8118faa6f94c042c82c64b))
- add Markdown keyboard shortcuts (Ctrl+B/I/K) to dialog textareas ([5e37a9c](https://github.com/ptarmiganlabs/help-button.qs/commit/5e37a9c15c05d49ef1edae478b01aa0d9f777ae7))
- add Markdown keyboard shortcuts and modal Markdown editor dialog ([3128bdd](https://github.com/ptarmiganlabs/help-button.qs/commit/3128bdd75f67875e984236c8745ea36256ee7a29))
- add modal Markdown editor dialog for property panel textareas ([f6d56ae](https://github.com/ptarmiganlabs/help-button.qs/commit/f6d56ae9afc0622704022fdfd8700bafd38b96e2))
- add option to completely hide extension widget on sheet in analysis mode ([958efa6](https://github.com/ptarmiganlabs/help-button.qs/commit/958efa6ca5825b1d56b84d38e7f117940d188311))
- add option to completely hide extension widget on sheet in analysis mode ([ba9e39d](https://github.com/ptarmiganlabs/help-button.qs/commit/ba9e39de4040d7c49b8622ecbcfdd7636729c303))
- add payload key name text inputs to property panel ([f8c55f8](https://github.com/ptarmiganlabs/help-button.qs/commit/f8c55f8a932a92b5f68a8709299ab04e7693dd05))
- add PDF generation for extension README and include in release ZIP ([ea9200b](https://github.com/ptarmiganlabs/help-button.qs/commit/ea9200b03aab2112146c5c9956a221298d6e2d50))
- add setVariable action type for menu items ([9cad0d2](https://github.com/ptarmiganlabs/help-button.qs/commit/9cad0d2cdf6cacd41e04f5051825342f8f6c9c4f))
- **demo-server:** log full payload when custom key names are detected ([cc0c8fd](https://github.com/ptarmiganlabs/help-button.qs/commit/cc0c8fd5e0972327bd96deb78548fd71c4b8d7cc))
- implement tabbed Markdown editor for enhanced editing experience in dialogs ([08303f6](https://github.com/ptarmiganlabs/help-button.qs/commit/08303f6fdde7235137da16cad12c7107b37baa00))

### Bug Fixes

- address code review feedback for SVG spacing and includes() pattern ([a66e1dc](https://github.com/ptarmiganlabs/help-button.qs/commit/a66e1dc704e045ffd3f34da0554ec66bb7bcbad6))
- md-to-pdf has no --output flag, rename output file instead ([b649c9d](https://github.com/ptarmiganlabs/help-button.qs/commit/b649c9de299f60fb2f5d9beee8082d52c80d7857))
- pin PDF tools, add mmdc Mermaid pre-processing, use pre-installed Chrome ([e66ffcb](https://github.com/ptarmiganlabs/help-button.qs/commit/e66ffcbb2df2a8e3bd971b21d214028b9ed0eb64))
- render Mermaid diagrams in PDF, pin tool versions, use pre-installed Chrome ([739041c](https://github.com/ptarmiganlabs/help-button.qs/commit/739041c032df4174ae2109ac832d98b9de290245))

### Miscellaneous

- add temporary PDF generation test workflow ([2ae156a](https://github.com/ptarmiganlabs/help-button.qs/commit/2ae156a0ed8e93f19f8c53486703a85ef09efcff))
- **deps-dev:** bump flatted ([801bf5e](https://github.com/ptarmiganlabs/help-button.qs/commit/801bf5e4fa1e1919a841288c31ea4627091583a9))
- **deps-dev:** bump flatted from 3.3.4 to 3.4.2 in /extension in the npm_and_yarn group across 1 directory ([d0041d5](https://github.com/ptarmiganlabs/help-button.qs/commit/d0041d51bcf0a7410d9caaac29110cf7c798de11))
- **deps:** bump serialize-javascript from 6.0.2 to 7.0.4 in /extension in the npm_and_yarn group across 1 directory ([87da7b6](https://github.com/ptarmiganlabs/help-button.qs/commit/87da7b6d77abf06c5a3cfc230733f99a44cc4e04))

### Documentation

- Add set/toggle variable action type to menu items ([c25293b](https://github.com/ptarmiganlabs/help-button.qs/commit/c25293b00ac7c03dcec625a6511cc708dca7482b))

## [2.3.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.2.0...helpbutton-qs-v2.3.0) (2026-03-15)

### Features

- add conditional showing of menu items via new property ([bd384c1](https://github.com/ptarmiganlabs/help-button.qs/commit/bd384c1a0f4dc542e787c825338b5a5ddf01df81))
- add configurable timestamp formats for dialogs and payloads ([9094864](https://github.com/ptarmiganlabs/help-button.qs/commit/9094864f3c2307e10732500b411a300cd678f28d))
- add show condition visibility property to tooltips ([fc6b35e](https://github.com/ptarmiganlabs/help-button.qs/commit/fc6b35e6a40f6436ebb920144f0069bd539a5c07))
- add support for custom headers in bug report and feedback dialogs ([71cee31](https://github.com/ptarmiganlabs/help-button.qs/commit/71cee315c5f74bbff814b274ecebdf3c5542a568))
- add tooltip count to extension placeholder text in edit mode ([84f6e16](https://github.com/ptarmiganlabs/help-button.qs/commit/84f6e165d74b73561cb7ea79d69edcdc2097bce4))
- configurable timestamp formats for dialog display and webhook payloads ([dfb5199](https://github.com/ptarmiganlabs/help-button.qs/commit/dfb519907903e64d75bf793a08dfc22e50e6c68f))
- enhance authentication logging in demo server ([74911b5](https://github.com/ptarmiganlabs/help-button.qs/commit/74911b5c16d1473a2cd68deb28ccb8df98cda08c))
- make string type properties in the property panel evaluate as expressions ([0eb3e7d](https://github.com/ptarmiganlabs/help-button.qs/commit/0eb3e7d459e4b548b7345d482f237e079e5616f0))
- mark additional string properties as optional expressions ([8133f9e](https://github.com/ptarmiganlabs/help-button.qs/commit/8133f9ef2cb40b0791f6ca4340e3a53e90119429))
- update custom headers handling of HelpButton HTML variants ([6cd34ce](https://github.com/ptarmiganlabs/help-button.qs/commit/6cd34ceb8b75b800cebe1b3f7b050eee915cb9eb))

### Bug Fixes

- add explicit parentheses around (M + 1) in MM/DD format ([1a7e2bf](https://github.com/ptarmiganlabs/help-button.qs/commit/1a7e2bfd2ba2ff03bc3ca055ea7f1ef1dccd4fbb))
- change default payload timestamp format from ISO8601Z to ISO8601 ([a6ddaa3](https://github.com/ptarmiganlabs/help-button.qs/commit/a6ddaa37f52b5206838df45a6b064aff3bd2b982))
- ensure consistent timestamp formatting in feedback dialog payload ([30a909b](https://github.com/ptarmiganlabs/help-button.qs/commit/30a909bca7cb55aa0120f0f6c0a3bbf844b89db9))
- update default payload timestamp format to ISO8601Z ([74f4af4](https://github.com/ptarmiganlabs/help-button.qs/commit/74f4af4258402e8775f96a35cbc88a24fb6cc22b))

### Refactoring

- split ext.js into property-panel modules for better maintainability ([7ed00a1](https://github.com/ptarmiganlabs/help-button.qs/commit/7ed00a1a97e2bfdb444be5d3c7567a53026ce146))

### Documentation

- fix number formatting in tooltip visibility example ([f5f81f6](https://github.com/ptarmiganlabs/help-button.qs/commit/f5f81f6be948cf6d21ac7cd83b6cb9e0483ec67c))

## [2.2.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.1.0...helpbutton-qs-v2.2.0) (2026-03-14)

### Features

- **demo-server:** Enhance HTTPS server setup to log non-sensitive certificate information ([015af0e](https://github.com/ptarmiganlabs/help-button.qs/commit/015af0e0c05a7b738cbe972ad5e7dc69de0e3cad))

### Bug Fixes

- **ci:** Add environment variable to enforce Node.js version for JavaScript actions ([1e1b9d8](https://github.com/ptarmiganlabs/help-button.qs/commit/1e1b9d8572ab72a9f6e248364c2a71d8e751b2b7))
- **client-managed:** Get rid of product-version warning in browser console ([0a427e3](https://github.com/ptarmiganlabs/help-button.qs/commit/0a427e36df70fe2b05fb851240d1cab529d428b0))
- **client-managed:** Improve retrieval of Sense version from server ([222f0c0](https://github.com/ptarmiganlabs/help-button.qs/commit/222f0c00d45bba03c0f084af894827c1005da7c6))

### Refactoring

- **client-managed:** centralize Qlik Sense version fetching and parsing logic ([43ff489](https://github.com/ptarmiganlabs/help-button.qs/commit/43ff48916a9518efb43e610fa82df8ec7666db1f))

### Documentation

- **demo-server:** Add screenshot of demo server's dashboard to README files ([1c54fd7](https://github.com/ptarmiganlabs/help-button.qs/commit/1c54fd76cfc678344cf39d77b0b6035b1a54b5d6))
- **README:** Update the demo GIF to show latest features ([5d88d13](https://github.com/ptarmiganlabs/help-button.qs/commit/5d88d139debf0ae8a5280ea871aac06d9159a19e))

## [2.1.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.0.0...helpbutton-qs-v2.1.0) (2026-03-13)

### Features

- add feedback menu item type with star rating and comment capture ([c148547](https://github.com/ptarmiganlabs/help-button.qs/commit/c148547be4fd41d986845b51a9ec1c1ca1f5d6d3))
- add new 'feedback' menu item type with star rating and comment fields ([1565c56](https://github.com/ptarmiganlabs/help-button.qs/commit/1565c5672d3f2ad9922fbfb7dec252ca74854c6c))
- add Qlik Cloud user info support for bug report dialog and template fields ([cf53b0d](https://github.com/ptarmiganlabs/help-button.qs/commit/cf53b0d75c45ef227af9b90bccd9f3778d2d3450))
- add theming support to extension with 4 predefined color presets ([8ef56d2](https://github.com/ptarmiganlabs/help-button.qs/commit/8ef56d24a9ec83066943a8e823d6d0a5a6f8da14))
- Add theming support to extension with 4 predefined color presets ([979d827](https://github.com/ptarmiganlabs/help-button.qs/commit/979d82781c9d18d22b42396fae75d1ff7149fbf0))
- add theming support with 4 predefined color presets ([3da4e48](https://github.com/ptarmiganlabs/help-button.qs/commit/3da4e482c453ff478fe9ffd519a68e64282713eb))
- Add two new default menu items (bug report + feedback dialog) that are included when adding the extension to an app sheet ([dfc6476](https://github.com/ptarmiganlabs/help-button.qs/commit/dfc64768d67943f35a39aeb9ac33ea4068a0693e))
- Apply default color/style to menu items when changing theme ([4450f2e](https://github.com/ptarmiganlabs/help-button.qs/commit/4450f2ecd30b292f81d37a48b5994697ff9c71b7))
- **bug-report:** Add severity selection and localization support in bug report dialog ([c6b9d64](https://github.com/ptarmiganlabs/help-button.qs/commit/c6b9d648f523e0b6e011a4f365a0552cd4bb8dba))
- **cloud:** enhance bug report dialog with additional user info fields for Qlik Cloud ([d60e55b](https://github.com/ptarmiganlabs/help-button.qs/commit/d60e55b0c133c45afd3664845b5d324e7c9847d7))
- **extension:** add feedback menu item type and add test for feedback action ([b9c6661](https://github.com/ptarmiganlabs/help-button.qs/commit/b9c6661e83c6cb7359cf3c6a8bdd13ec321bcd7d))
- **feedback-dialog:** Enhance feedback dialog with configurable context fields and payload options ([015705d](https://github.com/ptarmiganlabs/help-button.qs/commit/015705d5c076b21f8937b10de43ea442a2ccdec0))
- **feedback-dialog:** Set default color for new feedback menu items ([6620a5d](https://github.com/ptarmiganlabs/help-button.qs/commit/6620a5d2fd3ac6efde3e8684b82567baea4e7743))
- Move extension to its own ".qs Library" bundle in the Sense sheet editor ([511866a](https://github.com/ptarmiganlabs/help-button.qs/commit/511866af034ae9766c75a609262ca4e56d31339e))
- resolve User ID and User Name on Qlik Cloud via /api/v1/users/me ([497bb92](https://github.com/ptarmiganlabs/help-button.qs/commit/497bb92195059c06aae580a5b4217d9922387a2d))
- **tooltips:** Add configurable tooltips for any on-screen object ([4767c40](https://github.com/ptarmiganlabs/help-button.qs/commit/4767c40341a217227e907613fbeb111d2950b1a6))
- **translations:** Gather all translation related settings in a single "Language & Translations" section in the extension's property panel ([3f5946d](https://github.com/ptarmiganlabs/help-button.qs/commit/3f5946d200e874396a1230cdb261b570f522337d))
- **translations:** Make _all_ labels and texts translatable ([b94d624](https://github.com/ptarmiganlabs/help-button.qs/commit/b94d624fdd546ffd4afcdfdbf07082cb51f72d7c))

### Bug Fixes

- address code review feedback — consistent fallback values, expand CM abbreviation ([ae01962](https://github.com/ptarmiganlabs/help-button.qs/commit/ae01962ab3625757888a2851114e66f641380535))
- **feedback-dialog:** Better control of which fields are shown in feedback dialog, and which ones are included in the POST payload ([0d67518](https://github.com/ptarmiganlabs/help-button.qs/commit/0d67518bd0a26d37d17b90dd1f1c8b7321dc6e39))
- keep help button visible in sheet edit mode ([a6b3afb](https://github.com/ptarmiganlabs/help-button.qs/commit/a6b3afb83224940845219e74e08ba3f05dce0308))
- keep help button visible in sheet edit mode (rebased to main) ([cf005ce](https://github.com/ptarmiganlabs/help-button.qs/commit/cf005ce830d3a8ff08205f52de085123ac11fb4b))
- Move demo screen capture to top of page for easy access ([30c3f71](https://github.com/ptarmiganlabs/help-button.qs/commit/30c3f71bb883c5e53170ac768c64d79bfa51aadd))
- update extension name in preview SVG to match repository naming convention ([68616b0](https://github.com/ptarmiganlabs/help-button.qs/commit/68616b0f8105f54cd9e90225f218cdeb2a99bcfa))

### Miscellaneous

- **deps:** update dependencies to stay safe and secure ([c7a8c18](https://github.com/ptarmiganlabs/help-button.qs/commit/c7a8c181bfe6937d28cc60e101174e36cf404b9a))

### Refactoring

- improve readability of updateSubmitState in feedback dialog ([d8b7438](https://github.com/ptarmiganlabs/help-button.qs/commit/d8b74381804e82019f4c88d3d1d00a39ca19a05e))

### Documentation

- add discussion draft for master item workaround ([d0f73bd](https://github.com/ptarmiganlabs/help-button.qs/commit/d0f73bd2a4c016ca50ecbd6c660e58fc460a0917))
- add investigation document for help button visibility issue ([051283f](https://github.com/ptarmiganlabs/help-button.qs/commit/051283fea8a3437f04ee13d8056aa8f244215295))
- add multi-language documentation for extension variant ([b4ade49](https://github.com/ptarmiganlabs/help-button.qs/commit/b4ade49bcfb79e30f1b371cc486c71da60e7e5dd))
- add multi-language documentation for the extension variant ([7b4dc80](https://github.com/ptarmiganlabs/help-button.qs/commit/7b4dc8091880b057f48a6caa3ed9ad145d81a5d5))
- add theming documentation to both variant READMEs ([a8af14e](https://github.com/ptarmiganlabs/help-button.qs/commit/a8af14e13a729d0d9e6d828f1f62ad9e19acadcd))
- **feedback-dialog:** Include feedback dialog strings in docs for translation system ([498784c](https://github.com/ptarmiganlabs/help-button.qs/commit/498784c8022e536e6162bccd822dfda863d6971e))
- fix issue link and name in investigation document ([58b2277](https://github.com/ptarmiganlabs/help-button.qs/commit/58b227768b107c122147a31501c962ad2dd33097))
- investigation of help button visibility on non-host sheets ([f3e6c46](https://github.com/ptarmiganlabs/help-button.qs/commit/f3e6c46872c2ace3505300953c56dda43a68e7eb))
- remove discussion draft for master item workaround ([23db036](https://github.com/ptarmiganlabs/help-button.qs/commit/23db036a7c90b272484ff190bc24dcd0285ad0f8))
- restructure multi-language doc for Discussions Show & Tell format ([876dc27](https://github.com/ptarmiganlabs/help-button.qs/commit/876dc27565983f7bd3674239bc48e56a09e50a41))
- **translations:** Describe the new, centralized translations properties in the extension ([1304009](https://github.com/ptarmiganlabs/help-button.qs/commit/13040090950a5efcd87e8afe6c0443f3d74de13b))
- update multi-language documentation with notes on visibility and future enhancements ([ea06efc](https://github.com/ptarmiganlabs/help-button.qs/commit/ea06efceaaed7cdcc2328df41c96b3579ee9acdb))
- update READMEs with feedback menu item type documentation ([a3eaa5d](https://github.com/ptarmiganlabs/help-button.qs/commit/a3eaa5d6e65b5272952de1630d481c341cdcd99b))
- update workaround instructions for HelpButton.qs visibility ([686ecab](https://github.com/ptarmiganlabs/help-button.qs/commit/686ecab99ac785065d38046f746b3f2856820bcc))

## [2.0.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v1.3.1...helpbutton-qs-v2.0.0) (2026-03-06)

### ⚠ BREAKING CHANGES

- Rename project from qs-help-button to HelpButton.qs

### Features

- Add About dialog in edit mode ([62b44d4](https://github.com/ptarmiganlabs/help-button.qs/commit/62b44d43c28ea6614e8d781e4f88bcebe985cadf))
- Add automated build process and better issue reporting ([72ce800](https://github.com/ptarmiganlabs/help-button.qs/commit/72ce8007089c2b15160e9ca44fdd19ff0aa5c456))
- Add confirmation prompt when changing languagues ([da9e657](https://github.com/ptarmiganlabs/help-button.qs/commit/da9e657c20338b33a29b551d2b8a596262496594))
- Add demo server to "bug-report" variant of the help button ([b2a8257](https://github.com/ptarmiganlabs/help-button.qs/commit/b2a8257202968f852ab252c859d5f676c3e07b9f))
- Add proper color selection to all color properties ([8576ffb](https://github.com/ptarmiganlabs/help-button.qs/commit/8576ffb883204780d8ac4047732d17d88c0d9ce8))
- Add variant for bug-reporting to some backend system ([2f49084](https://github.com/ptarmiganlabs/help-button.qs/commit/2f4908471843c1425add74e60f6d838cdaf26278))
- **client-managed:** Add client-managed handling to Help button extension ([400e653](https://github.com/ptarmiganlabs/help-button.qs/commit/400e653362ede1df1a8295c6039fd229ae2498e9))
- **cloud:** Add full support for help button in Qlik Sense Cloud ([c17e263](https://github.com/ptarmiganlabs/help-button.qs/commit/c17e263b8517c3f18f9e8b28a3a099d3d0a6ae9a))
- **demo-server:** add demo server for HelpButton.qs bug reports ([74ec5a1](https://github.com/ptarmiganlabs/help-button.qs/commit/74ec5a168cd3a4a7d4edd784165a48bcee6a6b89))
- Enhance template fields reference with clearer labels and additional examples ([c1a5c85](https://github.com/ptarmiganlabs/help-button.qs/commit/c1a5c853a82372ca49c7482d8915940bf00ee30c))
- Implement template fields for dynamic URLs in help button configuration ([c2e0d64](https://github.com/ptarmiganlabs/help-button.qs/commit/c2e0d6403bb0f23bbed386f51137cb08fa79a75f))
- Improve bug report dialog and associated demo server for Sense extension ([8d025ad](https://github.com/ptarmiganlabs/help-button.qs/commit/8d025add79134952bf5eeb9f90d51e7efa44bb66))
- Include a version stamped `readme.txt` file in all release ZIPs ([95f18c1](https://github.com/ptarmiganlabs/help-button.qs/commit/95f18c1845ed9f9a95e9bb9fffe4954a3fc83e55))
- make all bug-report dialog texts configurable ([d09cde2](https://github.com/ptarmiganlabs/help-button.qs/commit/d09cde2786d5bdf218ef87fb9334c629ea7f56f2))
- make all bug-report dialog texts configurable ([d4c5ee3](https://github.com/ptarmiganlabs/help-button.qs/commit/d4c5ee3667c130684b618275b14c724c48a3b797))
- Make it possible to hide context and hover menus while in analysis mode ([62b44d4](https://github.com/ptarmiganlabs/help-button.qs/commit/62b44d43c28ea6614e8d781e4f88bcebe985cadf))
- Rename project from qs-help-button to HelpButton.qs ([d950ee9](https://github.com/ptarmiganlabs/help-button.qs/commit/d950ee959090326a774c5ef2fcd6391a591e87b8))
- **translation:** Added translations for Swedish, Danish, Norwegian, Finnish, German, French, Spanish and Polish ([c11af67](https://github.com/ptarmiganlabs/help-button.qs/commit/c11af67352776d6dac4ad72fa40df923499b16e4))
- **translation:** update popup title text in Swedish configuration ([3de3efc](https://github.com/ptarmiganlabs/help-button.qs/commit/3de3efc5a24c764afc661a2739cda6a6e494dc43))

### Bug Fixes

- **ci:** skip Puppeteer download during extension build ([a771923](https://github.com/ptarmiganlabs/help-button.qs/commit/a7719230c290a307bb844fc2bdd4a8b75a95139a))
- **ci:** update zip file naming and exclude node_modules from packaging ([86d35a7](https://github.com/ptarmiganlabs/help-button.qs/commit/86d35a7502dca81b18f4d1b473406e5eca23d52b))
- Remove unused background color from popup menu ([4551f6b](https://github.com/ptarmiganlabs/help-button.qs/commit/4551f6be2d8556b110fac574fe5d49e9cdcd312a))
- Set permissions in CI workdflow ([a7c190f](https://github.com/ptarmiganlabs/help-button.qs/commit/a7c190f6712520624c9857eec541339f08321aa5))
- update build process to use repo settings properly ([6099f96](https://github.com/ptarmiganlabs/help-button.qs/commit/6099f9648f91539c932d3e9270c93973e5febf27))
- update comment for FIELD_LABELS to reflect merged config ([3b98511](https://github.com/ptarmiganlabs/help-button.qs/commit/3b985113f5877622e612b1b4908a5a92e406c674))
- Update help documentation URLs in default menu items ([fb3e69c](https://github.com/ptarmiganlabs/help-button.qs/commit/fb3e69ce110816d963eba2fc70747212e6bf037f))
- update zip creation to include all language files and exclude unnecessary directories ([1fa72c5](https://github.com/ptarmiganlabs/help-button.qs/commit/1fa72c57de0a9b69ac786afc703ead9a6c001ef6))

### Miscellaneous

- **main:** release qs-help-button 1.1.0 ([bcc2adb](https://github.com/ptarmiganlabs/help-button.qs/commit/bcc2adb66bfca06178701fdf5174bc071ec5f5c4))
- **main:** release qs-help-button 1.1.0 ([12c0393](https://github.com/ptarmiganlabs/help-button.qs/commit/12c0393307f4921fd86bda4a91e9d28efb55a409))
- **main:** release qs-help-button 1.2.0 ([64d30ad](https://github.com/ptarmiganlabs/help-button.qs/commit/64d30ad0ee6a805835a54b5c63e8c0ad896302b2))
- **main:** release qs-help-button 1.2.0 ([28fb7ff](https://github.com/ptarmiganlabs/help-button.qs/commit/28fb7ff048fa787188757a7e1abb0dc14bc4192c))
- **main:** release qs-help-button 1.2.1 ([2d98233](https://github.com/ptarmiganlabs/help-button.qs/commit/2d982332f83f70f3743a6b3e4f72a149491478ab))
- **main:** release qs-help-button 1.2.1 ([9799503](https://github.com/ptarmiganlabs/help-button.qs/commit/9799503867a3c364f2d9f1a24240635948023816))
- **main:** release qs-help-button 1.3.0 ([eeedcf6](https://github.com/ptarmiganlabs/help-button.qs/commit/eeedcf6e0c723dbff63c3a189a07f62d6dd3632a))
- **main:** release qs-help-button 1.3.0 ([aa2565a](https://github.com/ptarmiganlabs/help-button.qs/commit/aa2565acb0ad5bb52cfe5e0e79f6b47fe99d65e7))
- **main:** release qs-help-button 1.3.1 ([e035e40](https://github.com/ptarmiganlabs/help-button.qs/commit/e035e40132d1faf113332eebbb35ead9347e46d2))
- **main:** release qs-help-button 1.3.1 ([b924ce9](https://github.com/ptarmiganlabs/help-button.qs/commit/b924ce986f11146c44a9a5ddef864b045d50e9e1))

### Refactoring

- simplify CodeQL workflow by removing redundant steps and obsolete file ([0d19912](https://github.com/ptarmiganlabs/help-button.qs/commit/0d19912eefef04682e8ff21c53b3e8e1cc9e5bc1))

### Documentation

- add note about logging cert paths for demo purposes ([74be60d](https://github.com/ptarmiganlabs/help-button.qs/commit/74be60d291665cf172781e73df6f6a896dd6e1de))
- Update overall project README and add development guide for helpbutton.qs extension ([712c829](https://github.com/ptarmiganlabs/help-button.qs/commit/712c829e7f46011de150cb5c17717e9476b7d250))
- Update README for basic variant title consistency ([a238a33](https://github.com/ptarmiganlabs/help-button.qs/commit/a238a339c5883250c173a3894973765fef2f49b2))

## [1.3.1](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.3.0...qs-help-button-v1.3.1) (2026-03-03)

### Bug Fixes

- update zip creation to include all language files and exclude unnecessary directories ([1fa72c5](https://github.com/ptarmiganlabs/qs-help-button/commit/1fa72c57de0a9b69ac786afc703ead9a6c001ef6))

## [1.3.0](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.2.1...qs-help-button-v1.3.0) (2026-03-03)

### Features

- make all bug-report dialog texts configurable ([d09cde2](https://github.com/ptarmiganlabs/qs-help-button/commit/d09cde2786d5bdf218ef87fb9334c629ea7f56f2))
- make all bug-report dialog texts configurable ([d4c5ee3](https://github.com/ptarmiganlabs/qs-help-button/commit/d4c5ee3667c130684b618275b14c724c48a3b797))
- **translation:** Added translations for Swedish, Danish, Norwegian, Finnish, German, French, Spanish and Polish ([c11af67](https://github.com/ptarmiganlabs/qs-help-button/commit/c11af67352776d6dac4ad72fa40df923499b16e4))
- **translation:** update popup title text in Swedish configuration ([3de3efc](https://github.com/ptarmiganlabs/qs-help-button/commit/3de3efc5a24c764afc661a2739cda6a6e494dc43))

### Bug Fixes

- update comment for FIELD_LABELS to reflect merged config ([3b98511](https://github.com/ptarmiganlabs/qs-help-button/commit/3b985113f5877622e612b1b4908a5a92e406c674))

## [1.2.1](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.2.0...qs-help-button-v1.2.1) (2026-02-23)

### Bug Fixes

- Set permissions in CI workdflow ([a7c190f](https://github.com/ptarmiganlabs/qs-help-button/commit/a7c190f6712520624c9857eec541339f08321aa5))

### Documentation

- add note about logging cert paths for demo purposes ([74be60d](https://github.com/ptarmiganlabs/qs-help-button/commit/74be60d291665cf172781e73df6f6a896dd6e1de))

## [1.2.0](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.1.0...qs-help-button-v1.2.0) (2026-02-18)

### Features

- Add automated build process and better issue reporting ([72ce800](https://github.com/ptarmiganlabs/qs-help-button/commit/72ce8007089c2b15160e9ca44fdd19ff0aa5c456))
- Add demo server to "bug-report" variant of the help button ([b2a8257](https://github.com/ptarmiganlabs/qs-help-button/commit/b2a8257202968f852ab252c859d5f676c3e07b9f))
- Add variant for bug-reporting to some backend system ([2f49084](https://github.com/ptarmiganlabs/qs-help-button/commit/2f4908471843c1425add74e60f6d838cdaf26278))
- Implement template fields for dynamic URLs in help button configuration ([c2e0d64](https://github.com/ptarmiganlabs/qs-help-button/commit/c2e0d6403bb0f23bbed386f51137cb08fa79a75f))

### Bug Fixes

- update build process to use repo settings properly ([6099f96](https://github.com/ptarmiganlabs/qs-help-button/commit/6099f9648f91539c932d3e9270c93973e5febf27))

### Miscellaneous

- **main:** release qs-help-button 1.1.0 ([bcc2adb](https://github.com/ptarmiganlabs/qs-help-button/commit/bcc2adb66bfca06178701fdf5174bc071ec5f5c4))
- **main:** release qs-help-button 1.1.0 ([12c0393](https://github.com/ptarmiganlabs/qs-help-button/commit/12c0393307f4921fd86bda4a91e9d28efb55a409))

### Refactoring

- simplify CodeQL workflow by removing redundant steps and obsolete file ([0d19912](https://github.com/ptarmiganlabs/qs-help-button/commit/0d19912eefef04682e8ff21c53b3e8e1cc9e5bc1))

### Documentation

- Update README for basic variant title consistency ([a238a33](https://github.com/ptarmiganlabs/qs-help-button/commit/a238a339c5883250c173a3894973765fef2f49b2))

## [1.1.0](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.0.0...qs-help-button-v1.1.0) (2026-02-18)

### Features

- Add automated build process and better issue reporting ([72ce800](https://github.com/ptarmiganlabs/qs-help-button/commit/72ce8007089c2b15160e9ca44fdd19ff0aa5c456))
- Add demo server to "bug-report" variant of the help button ([b2a8257](https://github.com/ptarmiganlabs/qs-help-button/commit/b2a8257202968f852ab252c859d5f676c3e07b9f))
- Add variant for bug-reporting to some backend system ([2f49084](https://github.com/ptarmiganlabs/qs-help-button/commit/2f4908471843c1425add74e60f6d838cdaf26278))
- Implement template fields for dynamic URLs in help button configuration ([c2e0d64](https://github.com/ptarmiganlabs/qs-help-button/commit/c2e0d6403bb0f23bbed386f51137cb08fa79a75f))

### Refactoring

- simplify CodeQL workflow by removing redundant steps and obsolete file ([0d19912](https://github.com/ptarmiganlabs/qs-help-button/commit/0d19912eefef04682e8ff21c53b3e8e1cc9e5bc1))

### Documentation

- Update README for basic variant title consistency ([a238a33](https://github.com/ptarmiganlabs/qs-help-button/commit/a238a339c5883250c173a3894973765fef2f49b2))
