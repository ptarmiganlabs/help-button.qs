/**
 * The build tokens: names in the source for what is known only when the extension is built, and
 * what each one becomes.
 *
 * `src/util/logger.js` reads them as bare names, such as `__BUILD_TYPE__`, and is the only module
 * that does. While nebula builds, Rollup's replace plugin puts each one's value in its place, before
 * terser minifies: nebula.config.cjs hands them to nebula as `replacementStrings`, the one option
 * name nebula reads for them. `scripts/post-build.mjs` then fails the build if a name is left in a
 * bundle. eslint.config.js declares the same names, and scripts/nebula-config.test.js keeps the
 * lists in step (docs/extension-developer/DEVELOPMENT.md, "Build tokens").
 *
 * CommonJS on purpose, like build-date.cjs: nebula.config.cjs requires it, and the ESM scripts and
 * the tests read it through createRequire. It replaces nothing itself.
 */

const pkg = require('../package.json');
const { buildDateString } = require('./build-date.cjs');

/**
 * Work out what each build token becomes in this build.
 *
 * @param {object} [options] - What the build knows.
 * @param {string} [options.buildType] - The build type: `BUILD_TYPE` from the environment, else
 *     'development'.
 * @param {string} [options.buildDate] - The build date the About dialog shows: now, by default.
 * @returns {Record<string, string>} Each token's replacement, by its name, as JavaScript source: a
 *     string literal.
 */
function buildTokens({
    buildType = process.env.BUILD_TYPE || 'development',
    buildDate = buildDateString(),
} = {}) {
    return {
        __BUILD_TYPE__: JSON.stringify(buildType),
        __PACKAGE_VERSION__: JSON.stringify(pkg.version),
        __BUILD_DATE__: JSON.stringify(buildDate),
    };
}

/** Every build token's name. */
const TOKEN_NAMES = Object.freeze(Object.keys(buildTokens({ buildType: '', buildDate: '' })));

module.exports = { TOKEN_NAMES, buildTokens };
