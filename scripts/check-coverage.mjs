// Is everything in this system actually connected to the things that check it?
//
// Not "is this right" — every other gate asks that. This asks whether a thing
// is WIRED UP at all, because our failures are not bad code, they are moving
// something and nothing tracking what moved with it.
//
// Three real cases, all found by hand and none caught by anything:
//
//   1. Renaming the four icon galleries from Foundations/* to Icons Library/*
//      orphaned their baselines under the old ids and gave the new ids none. All
//      275 icons lost visual coverage. The counts still balanced perfectly —
//      119 stories, 119 baselines — so nothing looked wrong from any angle.
//
//   2. BottomNav and TopBar shipped with no story for their whole lives: no
//      docs page, no baseline, no parity audit. Publicly exported components
//      that nothing in the repo had ever rendered.
//
//   3. A story with no baseline and a baseline with no story are the same bug
//      seen from two ends, and neither end was checked.
//
// The story/baseline half needs storybook-static/index.json, which is the list
// the visual suite itself reads. If the build is absent this reports that half
// as skipped rather than inventing an answer — a check that guesses is worse
// than one that admits it cannot see.
//
//   npm run build-storybook && node scripts/check-coverage.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = path.join(root, 'src/components');
const shotsDir = path.join(root, 'visual/__screenshots__');
const indexFile = path.join(root, 'storybook-static/index.json');

/**
 * Component folders that legitimately have no story of their own, with the
 * reason. An entry here is a decision; a folder missing from both here and the
 * story list is the hole this check exists to find.
 */
const NO_STORY_OK = {
  // (none)
};

const findings = [];
const notes = [];

/* ---- 1. every component folder has a story -------------------------------- */

const folders = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

for (const folder of folders) {
  if (NO_STORY_OK[folder]) continue;
  const files = fs.readdirSync(path.join(componentsDir, folder));
  if (!files.some((f) => f.endsWith('.stories.tsx'))) {
    findings.push({
      kind: 'no-story',
      what: `src/components/${folder}`,
      detail:
        'no *.stories.tsx — so no docs page, no visual baseline and no parity audit. ' +
        'Nothing in this repo renders it.',
    });
  }
}

/* ---- 2 & 3. stories <-> baselines ----------------------------------------- */

const THEMES = ['light', 'dark'];
// CI is linux and that set is the committed source of truth; a local win32 set
// is per-developer scratch and is not what this check is about.
const baselineFiles = fs.existsSync(shotsDir)
  ? fs.readdirSync(shotsDir).filter((f) => f.endsWith('-linux.png'))
  : [];

if (!fs.existsSync(indexFile)) {
  notes.push(
    'SKIPPED the story/baseline half: storybook-static/index.json is not built.\n' +
      '  Run `npm run build-storybook` first. CI always has it.',
  );
} else {
  const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  const entries = Object.values(index.entries ?? index.stories ?? {});
  // Docs entries render MDX, not a component; the visual suite skips them on
  // purpose, so counting them here would invent failures it will never have.
  // Behaviour stories are excluded here for the same reason visual/stories.spec.ts
  // excludes them: they exist to be clicked and assert what happened, not to be
  // photographed. Demanding a baseline for one would make this gate contradict
  // the suite it is supposed to be checking.
  const stories = entries
    .filter((e) => (e.type ?? 'story') === 'story')
    .filter((e) => !(e.tags ?? []).includes('behaviour'));

  const have = new Set(baselineFiles.map((f) => f.replace(/--(light|dark)-linux\.png$/, '')));
  const live = new Set(stories.map((s) => s.id));

  for (const story of stories) {
    const missing = THEMES.filter((t) => !baselineFiles.includes(`${story.id}--${t}-linux.png`));
    if (missing.length) {
      findings.push({
        kind: 'no-baseline',
        what: story.id,
        detail:
          missing.length === THEMES.length
            ? 'no committed baseline in either theme — the visual gate does not cover this story'
            : `no committed baseline for: ${missing.join(', ')}`,
      });
    }
  }

  for (const id of [...have].sort()) {
    if (!live.has(id)) {
      findings.push({
        kind: 'orphan-baseline',
        what: id,
        detail:
          'a baseline exists but no story does — renamed or deleted. Dead weight, and it ' +
          'hides the fact that whatever replaced it may have no baseline of its own.',
      });
    }
  }
}

/* ---- report ---------------------------------------------------------------- */

for (const n of notes) console.log(n + '\n');

if (!findings.length) {
  console.log(
    `✓ coverage: ${folders.length} component folders all have stories` +
      (baselineFiles.length ? `, ${baselineFiles.length / 2} stories all have baselines` : ''),
  );
  process.exit(0);
}

const LABEL = {
  'no-story': 'Component folders with no story',
  'no-baseline': 'Stories with no committed baseline',
  'orphan-baseline': 'Baselines whose story no longer exists',
};

console.log('Things that exist but nothing checks:\n');
for (const kind of ['no-story', 'no-baseline', 'orphan-baseline']) {
  const group = findings.filter((f) => f.kind === kind);
  if (!group.length) continue;
  console.log(`  ${LABEL[kind]} (${group.length}):`);
  for (const f of group) console.log(`    ${f.what}\n      ${f.detail}`);
  console.log('');
}

console.log(
  `${findings.length} finding(s).\n` +
    `  A missing story: write one, or record the exemption in NO_STORY_OK in this file.\n` +
    `  A missing baseline: run the "Visual baselines" workflow from this branch.\n` +
    `  An orphaned baseline: delete the file — and check what replaced that story has one.`,
);
process.exit(1);
