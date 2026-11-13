// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { testFolders } from './test-folders.js';

/**
 * scripts/zip-extension.mjs zips the extension folder, or fails.
 *
 * It used to end with `main().catch(console.error)`, so it exited 0 whatever went wrong, and with no
 * extension folder it wrote an empty zip and reported it created. Now it fails, and npm run pack:*
 * and the release build stop there. Each case runs the script in a folder of its own, as
 * `npm run zip` runs it in the repository root.
 */

const SCRIPT = fileURLToPath(new URL('./zip-extension.mjs', import.meta.url));

const PACKAGE = { 'package.json': JSON.stringify({ name: 'helpbutton-qs', version: '1.2.3' }) };
const EXTENSION = {
    'helpbutton-qs-ext/helpbutton-qs.qext': '{\n  "name": "HelpButton.qs"\n}\n',
    'helpbutton-qs-ext/helpbutton-qs.js': 'define(["./dist/helpbutton-qs"], (sn) => sn);\n',
    'helpbutton-qs-ext/dist/helpbutton-qs.js': 'const BUILD_TYPE = "production";\n',
};
const QEXT = join('helpbutton-qs-ext', 'helpbutton-qs.qext');

const folderWith = testFolders('helpbutton-qs-zip-');

// mkfifo makes the named pipe one case needs; Windows and some minimal images have none.
const HAS_MKFIFO =
    process.platform !== 'win32' && !spawnSync('mkfifo', [], { stdio: 'ignore' }).error;

/**
 * Run the zip step in a folder.
 *
 * @param {string} cwd - The folder to run it in.
 * @returns {import('node:child_process').SpawnSyncReturns<string>} How the run ended.
 */
function zip(cwd) {
    return spawnSync(process.execPath, [SCRIPT], { cwd, encoding: 'utf8' });
}

/**
 * The names of the files in a zip, read from its central directory, without its folder entries.
 *
 * @param {string} path - The zip's path.
 * @returns {string[]} The files' names, sorted.
 */
function filesIn(path) {
    const bytes = readFileSync(path);
    // The end of central directory record holds the number of entries at +10 and the central
    // directory's offset at +16; each entry's header there holds the lengths of its name, extra
    // field and comment at +28, +30 and +32, and its name at +46 (the .ZIP File Format
    // Specification, 4.3.16 and 4.3.12).
    const end = bytes.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
    let offset = bytes.readUInt32LE(end + 16);
    const names = [];
    for (let left = bytes.readUInt16LE(end + 10); left > 0; left--) {
        const nameLength = bytes.readUInt16LE(offset + 28);
        names.push(bytes.toString('utf8', offset + 46, offset + 46 + nameLength));
        offset +=
            46 + nameLength + bytes.readUInt16LE(offset + 30) + bytes.readUInt16LE(offset + 32);
    }
    return names.filter((name) => !name.endsWith('/')).sort();
}

describe('scripts/zip-extension.mjs', () => {
    it('zips every file in the extension folder but its dotfiles', () => {
        const cwd = folderWith({
            ...PACKAGE,
            ...EXTENSION,
            'helpbutton-qs-ext/.DS_Store': 'Finder',
        });

        const run = zip(cwd);

        expect(run.status, run.stderr).toBe(0);
        expect(run.stdout).toContain('Successfully created helpbutton-qs.zip');
        expect(filesIn(join(cwd, 'helpbutton-qs.zip'))).toEqual([
            'dist/helpbutton-qs.js',
            'helpbutton-qs.js',
            'helpbutton-qs.qext',
        ]);
    });

    it.each([
        ['there is no extension folder', {}],
        ['the folder holds no .qext', { 'helpbutton-qs-ext/helpbutton-qs.js': 'define();\n' }],
    ])('fails, and leaves no zip, not even an earlier one, when %s', (_, files) => {
        const cwd = folderWith({ ...PACKAGE, ...files });
        writeFileSync(join(cwd, 'helpbutton-qs.zip'), 'the zip of an earlier build');

        const run = zip(cwd);

        expect(run.status).toBe(1);
        expect(run.stderr).toContain(`Zip: FAILED, no ${QEXT} to zip.`);
        expect(existsSync(join(cwd, 'helpbutton-qs.zip'))).toBe(false);
    });

    it('fails when there is no package.json to read the name from', () => {
        const run = zip(folderWith(EXTENSION));

        expect(run.status).toBe(1);
        expect(run.stderr).toContain('Zip: FAILED');
        expect(run.stderr).toContain('package.json');
    });

    it('fails when it cannot write the zip', () => {
        const cwd = folderWith({ ...PACKAGE, ...EXTENSION });
        mkdirSync(join(cwd, 'helpbutton-qs.zip'));

        const run = zip(cwd);

        expect(run.status).toBe(1);
        expect(run.stderr).toContain('Zip: FAILED');
        expect(run.stderr).toContain('EISDIR');
    });

    // archiver cannot zip a named pipe: it warns, and leaves the pipe out.
    it.skipIf(!HAS_MKFIFO)('fails, and leaves no zip, when archiver leaves a file out', () => {
        const cwd = folderWith({ ...PACKAGE, ...EXTENSION });
        const mkfifo = spawnSync('mkfifo', [join(cwd, 'helpbutton-qs-ext', 'pipe')]);
        expect(mkfifo.status, 'mkfifo').toBe(0);

        const run = zip(cwd);

        expect(run.status).toBe(1);
        expect(run.stderr).toContain('Zip: FAILED');
        expect(run.stderr).toContain('ENTRYNOTSUPPORTED');
        expect(existsSync(join(cwd, 'helpbutton-qs.zip'))).toBe(false);
    });

    // Windows ignores the mode, and root reads the file anyway.
    it.skipIf(process.platform === 'win32' || process.getuid?.() === 0)(
        'fails, and leaves no partial zip, when it cannot read a file in the extension folder',
        () => {
            const cwd = folderWith({ ...PACKAGE, ...EXTENSION });
            chmodSync(join(cwd, 'helpbutton-qs-ext', 'dist', 'helpbutton-qs.js'), 0o000);

            const run = zip(cwd);

            expect(run.status).toBe(1);
            expect(run.stderr).toContain('Zip: FAILED');
            expect(run.stderr).toContain('EACCES');
            expect(existsSync(join(cwd, 'helpbutton-qs.zip'))).toBe(false);
        }
    );
});
