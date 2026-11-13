// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

/**
 * scripts/post-build.mjs checks the bundles and patches nothing.
 *
 * Rollup replaces the build tokens while nebula builds. post-build used to replace them again in
 * the finished bundles, and that hid for years that nebula read no replacement at all
 * (docs/extension-developer/DEVELOPMENT.md, "Build tokens"). So a token left in a bundle, or no
 * bundle to check, now fails the build, and the bundle is left as it was. So does a .qext that it
 * cannot add the bundle metadata to, which it used to report and then exit 0. Each case runs the
 * script in a folder of its own, as `npm run post-build` runs it in the repository root.
 */

const SCRIPT = fileURLToPath(new URL('./post-build.mjs', import.meta.url));

const CLEAN_BUNDLE = 'const BUILD_TYPE = "development";\n';
const QEXT = '{\n  "name": "HelpButton.qs",\n  "type": "visualization"\n}';

let folder;

/**
 * Make a folder that holds the given files.
 *
 * @param {Record<string, string>} files - Each file's content, by its path in the folder.
 * @returns {string} The folder's path.
 */
function folderWith(files) {
    folder = mkdtempSync(join(tmpdir(), 'helpbutton-qs-post-build-'));
    for (const [path, content] of Object.entries(files)) {
        mkdirSync(dirname(join(folder, path)), { recursive: true });
        writeFileSync(join(folder, path), content);
    }
    return folder;
}

/**
 * Run the post-build step in a folder.
 *
 * @param {string} cwd - The folder to run it in.
 * @returns {import('node:child_process').SpawnSyncReturns<string>} How the run ended.
 */
function postBuild(cwd) {
    return spawnSync(process.execPath, [SCRIPT], { cwd, encoding: 'utf8' });
}

afterEach(() => {
    if (folder) rmSync(folder, { recursive: true, force: true });
    folder = undefined;
});

describe('scripts/post-build.mjs', () => {
    it('fails when dist/ holds no bundle', () => {
        const run = postBuild(folderWith({ 'helpbutton-qs-ext/helpbutton-qs.qext': QEXT }));

        expect(run.status).toBe(1);
        expect(run.stderr).toContain('no bundle in dist/');
    });

    it('fails when a build token is left in a bundle, names each one, and patches nothing', () => {
        const left = 'const PACKAGE_VERSION = __PACKAGE_VERSION__;\nconst DATE = __BUILD_DATE__;\n';
        const cwd = folderWith({
            'dist/helpbutton-qs.js': CLEAN_BUNDLE,
            'dist/helpbutton-qs.esm.js': left,
            'helpbutton-qs-ext/dist/helpbutton-qs.js': left,
            'helpbutton-qs-ext/helpbutton-qs.qext': QEXT,
        });

        const run = postBuild(cwd);

        expect(run.status).toBe(1);
        const broken = [
            join('dist', 'helpbutton-qs.esm.js'),
            join('helpbutton-qs-ext', 'dist', 'helpbutton-qs.js'),
        ];
        const reported = run.stderr
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => /: __[A-Z_]+__$/.test(line));
        expect(reported.sort()).toEqual(
            broken.flatMap((file) => [`${file}: __BUILD_DATE__`, `${file}: __PACKAGE_VERSION__`])
        );
        for (const file of broken) expect(readFileSync(join(cwd, file), 'utf8')).toBe(left);
        // It stops there, and leaves the .qext as it was; its exit code stops npm run pack:* before
        // the zip.
        expect(readFileSync(join(cwd, 'helpbutton-qs-ext', 'helpbutton-qs.qext'), 'utf8')).toBe(
            QEXT
        );
    });

    it.each([
        ['there is none', {}],
        ['it is not JSON', { 'helpbutton-qs-ext/helpbutton-qs.qext': '{ "name": ' }],
    ])('fails when it cannot add the bundle metadata to the .qext, because %s', (_, files) => {
        const run = postBuild(folderWith({ 'dist/helpbutton-qs.js': CLEAN_BUNDLE, ...files }));

        expect(run.status).toBe(1);
        expect(run.stderr).toContain(
            `Post-build: FAILED, could not add the bundle metadata to ${join('helpbutton-qs-ext', 'helpbutton-qs.qext')}`
        );
    });

    it('passes bundles with no build token left, and adds the bundle metadata to the .qext', () => {
        const cwd = folderWith({
            'dist/helpbutton-qs.js': CLEAN_BUNDLE,
            'dist/helpbutton-qs.esm.js': CLEAN_BUNDLE,
            'helpbutton-qs-ext/helpbutton-qs.js': 'define(["./dist/helpbutton-qs"], (sn) => sn);\n',
            'helpbutton-qs-ext/dist/helpbutton-qs.js': CLEAN_BUNDLE,
            'helpbutton-qs-ext/helpbutton-qs.qext': QEXT,
        });

        const run = postBuild(cwd);

        expect(run.status, run.stderr).toBe(0);
        expect(run.stdout).toContain('Checked 4 js file(s), no build token left');
        const qext = JSON.parse(
            readFileSync(join(cwd, 'helpbutton-qs-ext', 'helpbutton-qs.qext'), 'utf8')
        );
        expect(qext.name).toBe('HelpButton.qs');
        expect(qext.bundle.id).toBe('dot-qs-library');
        expect(readFileSync(join(cwd, 'dist', 'helpbutton-qs.js'), 'utf8')).toBe(CLEAN_BUNDLE);
    });
});
