/**
 * Zip step, the last one of `npm run pack:dev` and `npm run pack:prod`. It zips the extension folder
 * that `nebula sense` writes, and post-build completes, into helpbutton-qs.zip, the file that Qlik
 * Sense installs. RELEASE_VERSION and PRERELEASE_SUFFIX, when set, go into the zip's name too.
 *
 * It removes the zip of an earlier build first. It fails when the folder holds no .qext, so a zip
 * run before `nebula sense` leaves no zip behind it, and when a file cannot be added or the zip
 * cannot be written, and then it removes what it wrote. Either way `npm run pack:*` and the release
 * build stop there, and no zip is left that looks like a finished build.
 */
import { createWriteStream, existsSync } from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { ZipArchive } from 'archiver';

const require = createRequire(import.meta.url);
const { EXT_DIR, QEXT_PATH } = require('./extension-paths.cjs');

/**
 * Zip the extension folder.
 *
 * @returns {Promise<void>} Resolves when the zip is written. Sets a failing exit code, and stops,
 *     when the folder holds no .qext. Rejects, with the partial zip removed, when a file cannot be
 *     added or the zip written.
 */
async function main() {
    const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
    const prerelease = process.env.PRERELEASE_SUFFIX || '';
    const versionTag = (process.env.RELEASE_VERSION && `-v${process.env.RELEASE_VERSION}`) || '';
    const zipName = `${pkg.name}${versionTag}${prerelease}.zip`;

    // The zip of an earlier build must not outlive a run that fails.
    await rm(zipName, { force: true });

    if (!existsSync(QEXT_PATH)) {
        console.error(
            `Zip: FAILED, no ${QEXT_PATH} to zip. Run "npm run sense" first, or "npm run pack:dev" or "npm run pack:prod" for the whole build.`
        );
        process.exitCode = 1;
        return;
    }

    const output = createWriteStream(zipName);
    const archive = new ZipArchive({
        zlib: { level: 9 },
    });
    // Settles when the zip is closed on disk, or at the first error. A warning fails it too: archiver
    // warns when it leaves a file out, and the extension in the zip would then be incomplete.
    const written = new Promise((resolve, reject) => {
        output.on('close', resolve);
        output.on('error', reject);
        archive.on('error', reject);
        archive.on('warning', reject);
    });

    archive.pipe(output);
    archive.glob('**/*', {
        cwd: EXT_DIR,
        ignore: ['.*', '**/.*'],
    });
    try {
        await Promise.all([archive.finalize(), written]);
    } catch (err) {
        // Stop archiver, close the file, and remove the partial zip. The first error is the one
        // reported; later ones from the closing stream go to the settled promise.
        archive.unpipe(output);
        archive.abort();
        output.destroy();
        if (!output.closed) await new Promise((resolve) => output.once('close', resolve));
        await rm(zipName, { force: true }).catch(() => {});
        throw err;
    }

    console.log(`${archive.pointer()} total bytes`);
    console.log(`Successfully created ${zipName}`);
}

main().catch((err) => {
    console.error('Zip: FAILED', err);
    process.exitCode = 1;
});
