import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach } from 'vitest';

/**
 * Throwaway folders for the tests that run a build script, as npm runs it in the repository root.
 * Every folder made is removed after each test.
 *
 * @param {string} prefix - The start of each folder's name.
 * @returns {(files: Record<string, string>) => string} Makes a folder that holds the given files,
 *     each by its path in the folder, and returns the folder's path.
 */
export function testFolders(prefix) {
    const made = [];
    afterEach(() => {
        for (const folder of made.splice(0)) rmSync(folder, { recursive: true, force: true });
    });
    return (files) => {
        const folder = mkdtempSync(join(tmpdir(), prefix));
        made.push(folder);
        for (const [path, content] of Object.entries(files)) {
            mkdirSync(dirname(join(folder, path)), { recursive: true });
            writeFileSync(join(folder, path), content);
        }
        return folder;
    };
}
