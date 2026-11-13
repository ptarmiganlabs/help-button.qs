/**
 * Post-build step, run after `nebula build` and `nebula sense` by `npm run pack:dev` and
 * `npm run pack:prod`.
 *
 * 1. Fails the build if a build token is left in a bundle, in dist/ or in the extension folder that
 *    `nebula sense` writes. Rollup replaces every token while nebula builds (`replacementStrings`
 *    in nebula.config.cjs, from scripts/build-tokens.cjs), so a token left here means that the
 *    replacement stopped working, and the extension would stop at the first line that reads it.
 *    It is reported, never patched: a patch here once hid that nebula read no replacement at all
 *    (docs/extension-developer/DEVELOPMENT.md, "Build tokens"). No bundle in dist/ fails the build
 *    too, so a check that found nothing to read never passes as one that found nothing wrong.
 * 2. Injects the shared `.qs Library` bundle metadata into the .qext manifest that `nebula sense`
 *    writes. It fails the build when it cannot, so no zip is made without it.
 *
 * It does not build, replace or zip anything itself.
 */
import { readFile, writeFile, readdir, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { TOKEN_NAMES } = require('./build-tokens.cjs');
const { EXT_DIR, QEXT_PATH } = require('./extension-paths.cjs');

/** Bundle metadata injected into the .qext file. */
const BUNDLE_METADATA = {
    id: 'dot-qs-library',
    name: '.qs Library',
    description:
        'Extensions from Ptarmigan Labs that enhance the user experience with help capabilities, onboarding tours and more.',
};

/**
 * Collect every .js file under a directory, at any depth.
 *
 * @param {string} dir - The directory to look in.
 * @returns {Promise<string[]>} The files' paths; none when the directory does not exist.
 */
async function jsFiles(dir) {
    let entries;
    try {
        entries = await readdir(dir, { recursive: true, withFileTypes: true });
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
    return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
        .map((entry) => join(entry.parentPath, entry.name));
}

/**
 * Find the build tokens left in files.
 *
 * @param {string[]} files - Paths of the files to read.
 * @returns {Promise<string[]>} A "file: token" line for every token left in a file.
 */
async function tokensLeft(files) {
    const found = [];
    for (const file of files) {
        const source = await readFile(file, 'utf-8');
        for (const token of TOKEN_NAMES) {
            if (source.includes(token)) found.push(`${file}: ${token}`);
        }
    }
    return found;
}

/**
 * Check the bundles for build tokens, then inject the bundle metadata into the .qext manifest.
 *
 * @returns {Promise<void>} Resolves when the step is done. Sets a failing exit code when dist/
 *     holds no bundle, when a build token is left in one, or when the bundle metadata cannot be
 *     added to the .qext.
 */
async function main() {
    const bundles = await jsFiles('dist');
    if (bundles.length === 0) {
        console.error(
            'Post-build: FAILED, no bundle in dist/ to check. Run "npm run build" or "npm run build:dist" first.'
        );
        process.exitCode = 1;
        return;
    }
    const files = [...bundles, ...(await jsFiles(EXT_DIR))];

    const left = await tokensLeft(files);
    if (left.length > 0) {
        console.error('Post-build: FAILED, build tokens are left in the bundle:');
        for (const line of left) console.error(`  ${line}`);
        console.error(
            '  Rollup replaces them through replacementStrings in nebula.config.cjs. Fix the replacement there; this step patches nothing.'
        );
        process.exitCode = 1;
        return;
    }
    console.log(`Post-build: Checked ${files.length} js file(s), no build token left`);

    // Inject bundle metadata into the .qext manifest. It is written to a dotfile beside it, which
    // the zip step leaves out, and renamed over it, so a write that fails partway leaves the .qext
    // as it was.
    const partPath = join(EXT_DIR, '.qext.part');
    try {
        const qext = JSON.parse(await readFile(QEXT_PATH, 'utf-8'));
        qext.bundle = BUNDLE_METADATA;
        await writeFile(partPath, JSON.stringify(qext, null, 2) + '\n');
        await rename(partPath, QEXT_PATH);
        console.log(`Post-build: Injected bundle metadata into ${QEXT_PATH}`);
    } catch (err) {
        await rm(partPath, { force: true }).catch(() => {});
        console.error(
            `Post-build: FAILED, could not add the bundle metadata to ${QEXT_PATH}:`,
            err
        );
        process.exitCode = 1;
    }
}

main().catch((err) => {
    console.error('Post-build: FAILED', err);
    process.exitCode = 1;
});
