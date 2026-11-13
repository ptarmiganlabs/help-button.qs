/**
 * Where `nebula sense` writes the extension: the folder `{package name}-ext`, with the manifest
 * `{package name}.qext` in it. scripts/post-build.mjs and scripts/zip-extension.mjs both read these,
 * so the two steps always look in the same place.
 */
const { join } = require('node:path');
const { name } = require('../package.json');

const EXT_DIR = `${name}-ext`;
const QEXT_PATH = join(EXT_DIR, `${name}.qext`);

module.exports = { EXT_DIR, QEXT_PATH };
