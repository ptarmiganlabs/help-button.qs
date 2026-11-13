// @vitest-environment node
// In Node, not jsdom: nebula's Rollup configuration loads @rollup/plugin-babel, which needs Node's
// own URL class.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import initConfig from '@nebula.js/cli-build/lib/init-config.js';
import nebulaRollupConfig from '@nebula.js/cli-build/lib/config.js';
import eslintConfig from '../eslint.config.js';

/**
 * nebula.config.cjs says only what nebula reads, and nebula's own pipeline replaces every build
 * token.
 *
 * nebula reads the config file's `build` section as its command-line options, and never reads a key
 * it does not know, without a word (docs/extension-developer/DEVELOPMENT.md, "Build tokens"):
 * `replacement` and a `rollup()` hook sat in the file unread until 2026-11-13, and Rollup replaced
 * no token. So this reads the options as nebula does, the declared ones from nebula's own
 * lib/init-config.js and the few lib/config.js reads besides, and it builds nebula's Rollup
 * configuration from the file, to see the replace plugin in it replace each token that
 * src/util/logger.js reads. Every list of the tokens' names agrees with scripts/build-tokens.cjs.
 */

const require = createRequire(import.meta.url);
const nebulaConfig = require('../nebula.config.cjs');
const pkg = require('../package.json');
const { TOKEN_NAMES, buildTokens } = require('./build-tokens.cjs');

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LOGGER = fileURLToPath(new URL('../src/util/logger.js', import.meta.url));

/** What @nebula.js/cli-build's lib/config.js reads from the parsed options without declaring it. */
const READ_UNDECLARED = ['replacementStrings', 'reactNative', 'reactNativePath', 'cwd'];

/**
 * The options nebula's init-config declares, read by handing it a stand-in for yargs.
 *
 * @returns {string[]} The declared option names.
 */
function declaredOptions() {
    const declared = {};
    const yargs = {
        parserConfiguration: () => yargs,
        options: (options) => {
            Object.assign(declared, options);
            return yargs;
        },
        config: () => yargs,
        middleware: () => yargs,
    };
    initConfig(yargs);
    return Object.keys(declared);
}

/**
 * The keys of an object that are build tokens by their shape, sorted.
 *
 * @param {object} [object] - The object to look in.
 * @returns {string[]} The token-shaped keys.
 */
function tokensIn(object) {
    return Object.keys(object ?? {})
        .filter((key) => /^__[A-Z][A-Z0-9_]*__$/.test(key))
        .sort();
}

const SORTED_NAMES = [...TOKEN_NAMES].sort();

describe('nebula.config.cjs', () => {
    it('holds only the section nebula build reads', () => {
        expect(Object.keys(nebulaConfig)).toEqual(['build']);
    });

    it('sets only options that nebula reads', () => {
        const declared = declaredOptions();
        // A stand-in that read nothing would let every key through.
        expect(declared).toEqual(expect.arrayContaining(['config', 'mode', 'sourcemap']));
        const read = new Set([...declared, ...READ_UNDECLARED]);
        expect(Object.keys(nebulaConfig.build).filter((key) => !read.has(key))).toEqual([]);
    });

    it("gets every build token in src/util/logger.js replaced by the replace plugin of nebula's own Rollup configuration", () => {
        const { input } = nebulaRollupConfig({
            mode: 'production',
            format: 'umd',
            cwd: ROOT,
            argv: { ...nebulaConfig.build, sourcemap: false },
        });
        const replace = input.plugins.find((plugin) => plugin?.name === 'replace');
        expect(replace, 'nebula runs no replace plugin').toBeDefined();

        const source = readFileSync(LOGGER, 'utf8');
        // transform returns null when it replaces nothing: then every token is still there, and
        // the first one fails the test by its name.
        const code = replace.transform(source, LOGGER)?.code ?? source;
        for (const name of TOKEN_NAMES) {
            expect(code, `${name} is left in src/util/logger.js`).not.toContain(name);
            expect(code).toContain(`= ${nebulaConfig.build.replacementStrings[name]};`);
        }
    });

    it('is named by every script that runs nebula build or nebula serve', () => {
        // Without --config, nebula looks for nebula.config.js and, finding none, uses no options.
        const scripts = Object.entries(pkg.scripts).filter(([, command]) =>
            /\bnebula (build|serve)\b/.test(command)
        );
        expect(scripts.map(([name]) => name)).toEqual(
            expect.arrayContaining(['build', 'build:dist', 'start'])
        );
        for (const [name, command] of scripts) {
            expect(command, `npm run ${name}`).toContain('--config nebula.config.cjs');
        }
    });
});

describe('the build tokens', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('have the same names in every list of them', () => {
        expect(SORTED_NAMES).toEqual(['__BUILD_DATE__', '__BUILD_TYPE__', '__PACKAGE_VERSION__']);
        expect(Object.keys(nebulaConfig.build.replacementStrings ?? {}).sort()).toEqual(
            SORTED_NAMES
        );
        const eslintGlobals = eslintConfig.flatMap((entry) =>
            tokensIn(entry.languageOptions?.globals)
        );
        expect(eslintGlobals.sort()).toEqual(SORTED_NAMES);
    });

    it('become string literals of what the build knows', () => {
        const tokens = buildTokens({
            buildType: 'production',
            buildDate: '13 November 2026, 07:00',
        });
        const values = Object.fromEntries(
            Object.entries(tokens).map(([name, literal]) => [name, JSON.parse(literal)])
        );
        expect(values).toEqual({
            __BUILD_TYPE__: 'production',
            __PACKAGE_VERSION__: pkg.version,
            __BUILD_DATE__: '13 November 2026, 07:00',
        });
    });

    it('take the build type from BUILD_TYPE, and development without it', () => {
        vi.stubEnv('BUILD_TYPE', 'production');
        expect(buildTokens().__BUILD_TYPE__).toBe('"production"');
        vi.stubEnv('BUILD_TYPE', '');
        expect(buildTokens().__BUILD_TYPE__).toBe('"development"');
    });

    it('are all read by src/util/logger.js', () => {
        const logger = readFileSync(LOGGER, 'utf8');
        for (const name of TOKEN_NAMES) expect(logger).toContain(`= ${name};`);
    });
});
