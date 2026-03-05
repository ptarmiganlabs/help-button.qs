import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Post-build script that replaces build-time tokens in output files.
 *
 * @returns {Promise<void>} Resolves when all tokens are replaced.
 */
async function main() {
    const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
    const buildType = process.env.BUILD_TYPE || 'development';
    const version = pkg.version;

    console.log(`Post-build: Using BUILD_TYPE=${buildType}, VERSION=${version}`);

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
                        .replace(/__PACKAGE_VERSION__/g, JSON.stringify(version));

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
}

main().catch(console.error);
