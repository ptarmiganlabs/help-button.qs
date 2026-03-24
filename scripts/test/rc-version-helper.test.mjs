import assert from 'node:assert/strict';
import { parseSemver, bumpVersion, highestChangeTypeFromCommits } from '../rc-version-helper.mjs';

function testParseSemver() {
  assert.deepEqual(parseSemver('v1.2.3'), { major: 1, minor: 2, patch: 3 });
  assert.deepEqual(parseSemver('2.0.0'), { major: 2, minor: 0, patch: 0 });
  assert.deepEqual(parseSemver('invalid'), { major: 0, minor: 0, patch: 0 });
}

function testBumpVersion() {
  assert.equal(bumpVersion('1.2.3', 'patch'), '1.2.4');
  assert.equal(bumpVersion('1.2.3', 'minor'), '1.3.0');
  assert.equal(bumpVersion('1.2.3', 'major'), '2.0.0');
}

function testHighestChangeTypeFromCommits() {
  const commits1 = [
    'fix: correct typo\n\nSome details',
    'docs: update readme',
  ];
  assert.equal(highestChangeTypeFromCommits(commits1), 'patch');

  const commits2 = [
    'feat(scope): add new feature\n\nMore',
    'fix: minor bug',
  ];
  assert.equal(highestChangeTypeFromCommits(commits2), 'minor');

  const commits3 = [
    'refactor!: change API\n\nBREAKING CHANGE: new signature',
  ];
  assert.equal(highestChangeTypeFromCommits(commits3), 'major');

  const commits4 = ['chore: housekeeping'];
  assert.equal(highestChangeTypeFromCommits(commits4), 'none');
}

function runAll() {
  console.log('Running rc-version-helper tests...');
  testParseSemver();
  testBumpVersion();
  testHighestChangeTypeFromCommits();
  console.log('All tests passed.');
}

runAll();
