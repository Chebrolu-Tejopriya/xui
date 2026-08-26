/**
 * Tags the current generation.
 *
 * XUI versions by *generation*, not per change — the way Material has M1/M2/M3
 * and Blade has v10/v12. The number changes when the design system does, not
 * when a component does. Day to day, consumers track `main` and updates arrive
 * as commits.
 *
 * Tags exist so anyone who needs stability can pin to one:
 *
 *   npm install github:Chebrolu-Tejopriya/xui#v1.0.0
 *
 * Run via `npm run release`, which gates first. This never pushes — it prints
 * the command so the push stays a deliberate act.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const sh = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();
const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const tag = `v${version}`;

const dirty = sh('git status --porcelain --untracked-files=no');
if (dirty) {
  console.error('Working tree has uncommitted changes:\n' + dirty);
  console.error('\nCommit them first — a tag should point at a reviewable commit.');
  process.exit(1);
}

const existing = sh('git tag --list').split('\n').filter(Boolean);
if (existing.includes(tag)) {
  console.error(`Tag ${tag} already exists (at ${sh(`git rev-list -n1 ${tag}`).slice(0, 7)}).`);
  console.error('Bump "version" in package.json — a generation gets one tag.');
  process.exit(1);
}

execSync(`git tag -a ${tag} -m "XUI ${tag}"`, { stdio: 'inherit' });
console.log(`\nTagged ${tag} at ${sh('git rev-parse --short HEAD')}.`);
console.log(`\nPush it when ready:\n  git push origin ${tag}\n`);
console.log(`Consumers can then pin:\n  npm install github:Chebrolu-Tejopriya/xui#${tag}\n`);
