# Changelog

## [2.1.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v2.0.0...helpbutton-qs-v2.1.0) (2026-03-07)


### Features

* add Qlik Cloud user info support for bug report dialog and template fields ([cf53b0d](https://github.com/ptarmiganlabs/help-button.qs/commit/cf53b0d75c45ef227af9b90bccd9f3778d2d3450))
* **cloud:** enhance bug report dialog with additional user info fields for Qlik Cloud ([d60e55b](https://github.com/ptarmiganlabs/help-button.qs/commit/d60e55b0c133c45afd3664845b5d324e7c9847d7))
* resolve User ID and User Name on Qlik Cloud via /api/v1/users/me ([497bb92](https://github.com/ptarmiganlabs/help-button.qs/commit/497bb92195059c06aae580a5b4217d9922387a2d))


### Bug Fixes

* address code review feedback — consistent fallback values, expand CM abbreviation ([ae01962](https://github.com/ptarmiganlabs/help-button.qs/commit/ae01962ab3625757888a2851114e66f641380535))

## [2.0.0](https://github.com/ptarmiganlabs/help-button.qs/compare/helpbutton-qs-v1.3.1...helpbutton-qs-v2.0.0) (2026-03-06)


### ⚠ BREAKING CHANGES

* Rename project from qs-help-button to HelpButton.qs

### Features

* Add About dialog in edit mode ([62b44d4](https://github.com/ptarmiganlabs/help-button.qs/commit/62b44d43c28ea6614e8d781e4f88bcebe985cadf))
* Add automated build process and better issue reporting ([72ce800](https://github.com/ptarmiganlabs/help-button.qs/commit/72ce8007089c2b15160e9ca44fdd19ff0aa5c456))
* Add confirmation prompt when changing languagues ([da9e657](https://github.com/ptarmiganlabs/help-button.qs/commit/da9e657c20338b33a29b551d2b8a596262496594))
* Add demo server to "bug-report" variant of the help button ([b2a8257](https://github.com/ptarmiganlabs/help-button.qs/commit/b2a8257202968f852ab252c859d5f676c3e07b9f))
* Add proper color selection to all color properties ([8576ffb](https://github.com/ptarmiganlabs/help-button.qs/commit/8576ffb883204780d8ac4047732d17d88c0d9ce8))
* Add variant for bug-reporting to some backend system ([2f49084](https://github.com/ptarmiganlabs/help-button.qs/commit/2f4908471843c1425add74e60f6d838cdaf26278))
* **client-managed:** Add client-managed handling to Help button extension ([400e653](https://github.com/ptarmiganlabs/help-button.qs/commit/400e653362ede1df1a8295c6039fd229ae2498e9))
* **cloud:** Add full support for help button in Qlik Sense Cloud ([c17e263](https://github.com/ptarmiganlabs/help-button.qs/commit/c17e263b8517c3f18f9e8b28a3a099d3d0a6ae9a))
* **demo-server:** add demo server for HelpButton.qs bug reports ([74ec5a1](https://github.com/ptarmiganlabs/help-button.qs/commit/74ec5a168cd3a4a7d4edd784165a48bcee6a6b89))
* Enhance template fields reference with clearer labels and additional examples ([c1a5c85](https://github.com/ptarmiganlabs/help-button.qs/commit/c1a5c853a82372ca49c7482d8915940bf00ee30c))
* Implement template fields for dynamic URLs in help button configuration ([c2e0d64](https://github.com/ptarmiganlabs/help-button.qs/commit/c2e0d6403bb0f23bbed386f51137cb08fa79a75f))
* Improve bug report dialog and associated demo server for Sense extension ([8d025ad](https://github.com/ptarmiganlabs/help-button.qs/commit/8d025add79134952bf5eeb9f90d51e7efa44bb66))
* Include a version stamped `readme.txt` file in all release ZIPs ([95f18c1](https://github.com/ptarmiganlabs/help-button.qs/commit/95f18c1845ed9f9a95e9bb9fffe4954a3fc83e55))
* make all bug-report dialog texts configurable ([d09cde2](https://github.com/ptarmiganlabs/help-button.qs/commit/d09cde2786d5bdf218ef87fb9334c629ea7f56f2))
* make all bug-report dialog texts configurable ([d4c5ee3](https://github.com/ptarmiganlabs/help-button.qs/commit/d4c5ee3667c130684b618275b14c724c48a3b797))
* Make it possible to hide context and hover menus while in analysis mode ([62b44d4](https://github.com/ptarmiganlabs/help-button.qs/commit/62b44d43c28ea6614e8d781e4f88bcebe985cadf))
* Rename project from qs-help-button to HelpButton.qs ([d950ee9](https://github.com/ptarmiganlabs/help-button.qs/commit/d950ee959090326a774c5ef2fcd6391a591e87b8))
* **translation:** Added translations for Swedish, Danish, Norwegian, Finnish, German, French, Spanish and Polish ([c11af67](https://github.com/ptarmiganlabs/help-button.qs/commit/c11af67352776d6dac4ad72fa40df923499b16e4))
* **translation:** update popup title text in Swedish configuration ([3de3efc](https://github.com/ptarmiganlabs/help-button.qs/commit/3de3efc5a24c764afc661a2739cda6a6e494dc43))


### Bug Fixes

* **ci:** skip Puppeteer download during extension build ([a771923](https://github.com/ptarmiganlabs/help-button.qs/commit/a7719230c290a307bb844fc2bdd4a8b75a95139a))
* **ci:** update zip file naming and exclude node_modules from packaging ([86d35a7](https://github.com/ptarmiganlabs/help-button.qs/commit/86d35a7502dca81b18f4d1b473406e5eca23d52b))
* Remove unused background color from popup menu ([4551f6b](https://github.com/ptarmiganlabs/help-button.qs/commit/4551f6be2d8556b110fac574fe5d49e9cdcd312a))
* Set permissions in CI workdflow ([a7c190f](https://github.com/ptarmiganlabs/help-button.qs/commit/a7c190f6712520624c9857eec541339f08321aa5))
* update build process to use repo settings properly ([6099f96](https://github.com/ptarmiganlabs/help-button.qs/commit/6099f9648f91539c932d3e9270c93973e5febf27))
* update comment for FIELD_LABELS to reflect merged config ([3b98511](https://github.com/ptarmiganlabs/help-button.qs/commit/3b985113f5877622e612b1b4908a5a92e406c674))
* Update help documentation URLs in default menu items ([fb3e69c](https://github.com/ptarmiganlabs/help-button.qs/commit/fb3e69ce110816d963eba2fc70747212e6bf037f))
* update zip creation to include all language files and exclude unnecessary directories ([1fa72c5](https://github.com/ptarmiganlabs/help-button.qs/commit/1fa72c57de0a9b69ac786afc703ead9a6c001ef6))


### Miscellaneous

* **main:** release qs-help-button 1.1.0 ([bcc2adb](https://github.com/ptarmiganlabs/help-button.qs/commit/bcc2adb66bfca06178701fdf5174bc071ec5f5c4))
* **main:** release qs-help-button 1.1.0 ([12c0393](https://github.com/ptarmiganlabs/help-button.qs/commit/12c0393307f4921fd86bda4a91e9d28efb55a409))
* **main:** release qs-help-button 1.2.0 ([64d30ad](https://github.com/ptarmiganlabs/help-button.qs/commit/64d30ad0ee6a805835a54b5c63e8c0ad896302b2))
* **main:** release qs-help-button 1.2.0 ([28fb7ff](https://github.com/ptarmiganlabs/help-button.qs/commit/28fb7ff048fa787188757a7e1abb0dc14bc4192c))
* **main:** release qs-help-button 1.2.1 ([2d98233](https://github.com/ptarmiganlabs/help-button.qs/commit/2d982332f83f70f3743a6b3e4f72a149491478ab))
* **main:** release qs-help-button 1.2.1 ([9799503](https://github.com/ptarmiganlabs/help-button.qs/commit/9799503867a3c364f2d9f1a24240635948023816))
* **main:** release qs-help-button 1.3.0 ([eeedcf6](https://github.com/ptarmiganlabs/help-button.qs/commit/eeedcf6e0c723dbff63c3a189a07f62d6dd3632a))
* **main:** release qs-help-button 1.3.0 ([aa2565a](https://github.com/ptarmiganlabs/help-button.qs/commit/aa2565acb0ad5bb52cfe5e0e79f6b47fe99d65e7))
* **main:** release qs-help-button 1.3.1 ([e035e40](https://github.com/ptarmiganlabs/help-button.qs/commit/e035e40132d1faf113332eebbb35ead9347e46d2))
* **main:** release qs-help-button 1.3.1 ([b924ce9](https://github.com/ptarmiganlabs/help-button.qs/commit/b924ce986f11146c44a9a5ddef864b045d50e9e1))


### Refactoring

* simplify CodeQL workflow by removing redundant steps and obsolete file ([0d19912](https://github.com/ptarmiganlabs/help-button.qs/commit/0d19912eefef04682e8ff21c53b3e8e1cc9e5bc1))


### Documentation

* add note about logging cert paths for demo purposes ([74be60d](https://github.com/ptarmiganlabs/help-button.qs/commit/74be60d291665cf172781e73df6f6a896dd6e1de))
* Update overall project README and add development guide for helpbutton.qs extension ([712c829](https://github.com/ptarmiganlabs/help-button.qs/commit/712c829e7f46011de150cb5c17717e9476b7d250))
* Update README for basic variant title consistency ([a238a33](https://github.com/ptarmiganlabs/help-button.qs/commit/a238a339c5883250c173a3894973765fef2f49b2))

## [1.3.1](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.3.0...qs-help-button-v1.3.1) (2026-03-03)


### Bug Fixes

* update zip creation to include all language files and exclude unnecessary directories ([1fa72c5](https://github.com/ptarmiganlabs/qs-help-button/commit/1fa72c57de0a9b69ac786afc703ead9a6c001ef6))

## [1.3.0](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.2.1...qs-help-button-v1.3.0) (2026-03-03)


### Features

* make all bug-report dialog texts configurable ([d09cde2](https://github.com/ptarmiganlabs/qs-help-button/commit/d09cde2786d5bdf218ef87fb9334c629ea7f56f2))
* make all bug-report dialog texts configurable ([d4c5ee3](https://github.com/ptarmiganlabs/qs-help-button/commit/d4c5ee3667c130684b618275b14c724c48a3b797))
* **translation:** Added translations for Swedish, Danish, Norwegian, Finnish, German, French, Spanish and Polish ([c11af67](https://github.com/ptarmiganlabs/qs-help-button/commit/c11af67352776d6dac4ad72fa40df923499b16e4))
* **translation:** update popup title text in Swedish configuration ([3de3efc](https://github.com/ptarmiganlabs/qs-help-button/commit/3de3efc5a24c764afc661a2739cda6a6e494dc43))


### Bug Fixes

* update comment for FIELD_LABELS to reflect merged config ([3b98511](https://github.com/ptarmiganlabs/qs-help-button/commit/3b985113f5877622e612b1b4908a5a92e406c674))

## [1.2.1](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.2.0...qs-help-button-v1.2.1) (2026-02-23)


### Bug Fixes

* Set permissions in CI workdflow ([a7c190f](https://github.com/ptarmiganlabs/qs-help-button/commit/a7c190f6712520624c9857eec541339f08321aa5))


### Documentation

* add note about logging cert paths for demo purposes ([74be60d](https://github.com/ptarmiganlabs/qs-help-button/commit/74be60d291665cf172781e73df6f6a896dd6e1de))

## [1.2.0](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.1.0...qs-help-button-v1.2.0) (2026-02-18)


### Features

* Add automated build process and better issue reporting ([72ce800](https://github.com/ptarmiganlabs/qs-help-button/commit/72ce8007089c2b15160e9ca44fdd19ff0aa5c456))
* Add demo server to "bug-report" variant of the help button ([b2a8257](https://github.com/ptarmiganlabs/qs-help-button/commit/b2a8257202968f852ab252c859d5f676c3e07b9f))
* Add variant for bug-reporting to some backend system ([2f49084](https://github.com/ptarmiganlabs/qs-help-button/commit/2f4908471843c1425add74e60f6d838cdaf26278))
* Implement template fields for dynamic URLs in help button configuration ([c2e0d64](https://github.com/ptarmiganlabs/qs-help-button/commit/c2e0d6403bb0f23bbed386f51137cb08fa79a75f))


### Bug Fixes

* update build process to use repo settings properly ([6099f96](https://github.com/ptarmiganlabs/qs-help-button/commit/6099f9648f91539c932d3e9270c93973e5febf27))


### Miscellaneous

* **main:** release qs-help-button 1.1.0 ([bcc2adb](https://github.com/ptarmiganlabs/qs-help-button/commit/bcc2adb66bfca06178701fdf5174bc071ec5f5c4))
* **main:** release qs-help-button 1.1.0 ([12c0393](https://github.com/ptarmiganlabs/qs-help-button/commit/12c0393307f4921fd86bda4a91e9d28efb55a409))


### Refactoring

* simplify CodeQL workflow by removing redundant steps and obsolete file ([0d19912](https://github.com/ptarmiganlabs/qs-help-button/commit/0d19912eefef04682e8ff21c53b3e8e1cc9e5bc1))


### Documentation

* Update README for basic variant title consistency ([a238a33](https://github.com/ptarmiganlabs/qs-help-button/commit/a238a339c5883250c173a3894973765fef2f49b2))

## [1.1.0](https://github.com/ptarmiganlabs/qs-help-button/compare/qs-help-button-v1.0.0...qs-help-button-v1.1.0) (2026-02-18)


### Features

* Add automated build process and better issue reporting ([72ce800](https://github.com/ptarmiganlabs/qs-help-button/commit/72ce8007089c2b15160e9ca44fdd19ff0aa5c456))
* Add demo server to "bug-report" variant of the help button ([b2a8257](https://github.com/ptarmiganlabs/qs-help-button/commit/b2a8257202968f852ab252c859d5f676c3e07b9f))
* Add variant for bug-reporting to some backend system ([2f49084](https://github.com/ptarmiganlabs/qs-help-button/commit/2f4908471843c1425add74e60f6d838cdaf26278))
* Implement template fields for dynamic URLs in help button configuration ([c2e0d64](https://github.com/ptarmiganlabs/qs-help-button/commit/c2e0d6403bb0f23bbed386f51137cb08fa79a75f))


### Refactoring

* simplify CodeQL workflow by removing redundant steps and obsolete file ([0d19912](https://github.com/ptarmiganlabs/qs-help-button/commit/0d19912eefef04682e8ff21c53b3e8e1cc9e5bc1))


### Documentation

* Update README for basic variant title consistency ([a238a33](https://github.com/ptarmiganlabs/qs-help-button/commit/a238a339c5883250c173a3894973765fef2f49b2))
