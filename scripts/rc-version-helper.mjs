#!/usr/bin/env node
import { execSync } from 'node:child_process';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch (e) {
    return '';
  }
}

function parseSemver(tag) {
  const t = String(tag || '').replace(/^v/, '');
  const parts = t.split('.').map((p) => parseInt(p, 10));
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
  };
}

function semverToString({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

function bumpVersion(base, level) {
  const v = parseSemver(base);
  if (level === 'major') {
    v.major += 1; v.minor = 0; v.patch = 0;
  } else if (level === 'minor') {
    v.minor += 1; v.patch = 0;
  } else if (level === 'patch') {
    v.patch += 1;
  }
  return semverToString(v);
}

function highestChangeTypeFromCommits(commits) {
  // Return 'major' | 'minor' | 'patch' | 'none'
  let level = 'none';
  for (const msg of commits) {
    if (!msg) continue;
    const header = msg.split('\n')[0] || '';
    if (/BREAKING CHANGE/.test(msg) || /![:\)]/.test(header)) return 'major';
    const m = header.match(/^(\w+)(?:\(.+\))?(!)?:/);
    if (m) {
      const type = m[1];
      if (type === 'feat' && level !== 'major') level = 'minor';
      if ((type === 'fix' || type === 'perf' || type === 'refactor') && level === 'none') level = 'patch';
    }
  }
  return level;
}

async function main() {
  const repo = process.env.GITHUB_REPOSITORY;
  const ref = process.env.GITHUB_REF || '';

  if (!ref.startsWith('refs/heads/pre-release/')) {
    console.log('action=run_release_please');
    return;
  }

  const prereleaseType = ref.replace('refs/heads/pre-release/', '');
  if (!['alpha', 'beta', 'rc'].includes(prereleaseType)) {
    console.log('action=run_release_please');
    return;
  }

  // Ensure tags are available
  run('git fetch --tags --quiet');

  const tagListRaw = run('git tag --list');
  const tags = tagListRaw ? tagListRaw.split('\n').filter(Boolean) : [];

  // Find latest stable tag (no prerelease suffix)
  const stableTags = tags.filter(t => /^v?\d+\.\d+\.\d+$/.test(t));
  let latestStable = 'v0.0.0';
  if (stableTags.length) {
    // sort semver
    stableTags.sort((a, b) => {
      const pa = parseSemver(a);
      const pb = parseSemver(b);
      if (pa.major !== pb.major) return pa.major - pb.major;
      if (pa.minor !== pb.minor) return pa.minor - pb.minor;
      return pa.patch - pb.patch;
    });
    latestStable = stableTags[stableTags.length - 1];
  }

  // Get commits since latestStable
  const range = latestStable ? `${latestStable}..HEAD` : 'HEAD';
  const commitsRaw = run(`git log ${range} --pretty=%B`);
  const commits = commitsRaw ? commitsRaw.split('\n\ncommit') : [];

  const change = highestChangeTypeFromCommits(commits);

  // Compute desired base version
  const baseNoV = String(latestStable).replace(/^v/, '');
  const desiredBase = bumpVersion(baseNoV, change === 'none' ? 'patch' : change);

  // Query GitHub releases for existing prerelease for this base
  const releasesRaw = run(`gh api repos/${repo}/releases`);
  let releases = [];
  try {
    releases = releasesRaw ? JSON.parse(releasesRaw) : [];
  } catch (e) {
    releases = [];
  }

  // Find prereleases that match desiredBase and prereleaseType
  const prefix = `v${desiredBase}-${prereleaseType}.`;
  const matching = releases.filter(r => r.tag_name && r.tag_name.startsWith(prefix));

  if (matching.length > 0) {
    // Find highest N and propose next
    let maxN = -1;
    for (const r of matching) {
      const m = String(r.tag_name).match(new RegExp(`-${prereleaseType}\\.(\\d+)$`));
      if (m) {
        const n = parseInt(m[1], 10);
        if (!Number.isNaN(n) && n > maxN) maxN = n;
      }
    }
    const nextN = maxN + 1;
    const releaseVersion = `${desiredBase}-${prereleaseType}.${nextN}`;
    console.log('action=increment_rc');
    console.log(`releases_created=true`);
    console.log(`release_tag_name=v${releaseVersion}`);
    console.log(`release_version=${releaseVersion}`);
    console.log(`is_prerelease=true`);
    // release_upload_url left empty; uploader can create/update by tag
    console.log(`release_upload_url=`);
    return;
  }

  // No existing prerelease for desired base → run release-please to create new prerelease (rc.0)
  console.log('action=run_release_please');
  return;
}

main().catch(err => {
  console.error(err);
  console.log('action=run_release_please');
});
