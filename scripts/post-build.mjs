import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { buildDateString } = require('./build-date.cjs');

/** Bundle metadata injected into the .qext file. */
const BUNDLE_METADATA = {
    id: 'dot-qs-library',
    name: '.qs Library',
    description:
        'Extensions from Ptarmigan Labs that enhance the user experience with help capabilities, onboarding tours and more.',
};

/**
 * Post-build script that replaces build-time tokens in output files
 * and injects bundle metadata into the .qext manifest.
 *
 * @returns {Promise<void>} Resolves when all tokens are replaced.
 */
async function main() {
    const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
    const buildType = process.env.BUILD_TYPE || 'development';
    const version = pkg.version;
    const buildDate = buildDateString();

    console.log(`Post-build: Using BUILD_TYPE=${buildType}, VERSION=${version}, BUILD_DATE=${buildDate}`);

    const targetDirs = ['dist', 'helpbutton-qs-ext'];

    for (const dir of targetDirs) {
        try {
            const files = await readdir(dir, { recursive: true });

            for (const file of files) {
                if (file.endsWith('.js')) {
                    const filePath = join(dir, file);
                    let content = await readFile(filePath, 'utf-8');

                    const newContent = content
                        .replace(/__BUILD_TYPE__/g, JSON.stringify(buildType))
                        .replace(/__PACKAGE_VERSION__/g, JSON.stringify(version))
                        .replace(/__BUILD_DATE__/g, JSON.stringify(buildDate));

                    if (content !== newContent) {
                        await writeFile(filePath, newContent);
                        console.log(`Post-build: Replaced tokens in ${filePath}`);
                    }
                }
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(`Error processing directory ${dir}:`, err);
            }
        }
    }

    // Inject bundle metadata into the .qext manifest
    const qextPath = join('helpbutton-qs-ext', 'helpbutton-qs.qext');
    try {
        const qext = JSON.parse(await readFile(qextPath, 'utf-8'));
        qext.bundle = BUNDLE_METADATA;
        await writeFile(qextPath, JSON.stringify(qext, null, 2) + '\n');
        console.log(`Post-build: Injected bundle metadata into ${qextPath}`);
    } catch (err) {
        console.error(`Error injecting bundle into ${qextPath}:`, err);
    }
}

main().catch(console.error);
