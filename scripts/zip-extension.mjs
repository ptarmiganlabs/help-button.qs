/**
 * Zip step, the last one of `npm run pack:dev` and `npm run pack:prod`. It zips the extension folder
 * that `nebula sense` writes, and post-build completes, into helpbutton-qs.zip, the file that Qlik
 * Sense installs. RELEASE_VERSION and PRERELEASE_SUFFIX, when set, go into the zip's name too.
 *
 * It fails when the folder holds no .qext, so a zip run before `nebula sense` does not leave an
 * empty zip behind it, and when a file cannot be added or the zip cannot be written. Either way
 * `npm run pack:*` and the release build stop there.
 */
import { createWriteStream, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ZipArchive } from 'archiver';

/**
 * Zip the extension folder.
 *
 * @returns {Promise<void>} Resolves when the zip is written. Sets a failing exit code, and stops,
 *     when the folder holds no .qext. Rejects when a file cannot be added or the zip written.
 */
async function main() {
    const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
    const prerelease = process.env.PRERELEASE_SUFFIX || '';
    const versionTag = (process.env.RELEASE_VERSION && `-v${process.env.RELEASE_VERSION}`) || '';
    const zipName = `${pkg.name}${versionTag}${prerelease}.zip`;

    // nebula sense writes the extension to {package-name}-ext/.
    const extDir = `${pkg.name}-ext`;
    const qextPath = join(extDir, `${pkg.name}.qext`);
    if (!existsSync(qextPath)) {
        console.error(
            `Zip: FAILED, no ${qextPath} to zip. Run "npm run sense" first, or "npm run pack:dev" or "npm run pack:prod" for the whole build.`
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
        cwd: extDir,
        ignore: ['.*', '**/.*'],
    });
    await Promise.all([archive.finalize(), written]);

    console.log(`${archive.pointer()} total bytes`);
    console.log(`Successfully created ${zipName}`);
}

main().catch((err) => {
    console.error('Zip: FAILED', err);
    process.exitCode = 1;
});
