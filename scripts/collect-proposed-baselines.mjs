// After a failing `visual` job: gather the new renders as ready-to-commit
// baselines, and say in the job summary exactly which stories moved.
//
// WHY THIS EXISTS. A red visual job told you something changed and left you to
// dispatch the "Visual baselines" workflow blind - a second full Storybook
// build and a second full render, kicked off without knowing whether the diff
// was a real regression or the change you meant. That asymmetry is most of why
// baselines feel like a chore: the person who has to accept them is never the
// person who made the change (baselines are linux, and nobody here develops on
// linux), so they are accepting something they cannot see.
//
// Playwright has already done the expensive part. On a failed comparison it
// writes the new render next to the diff, and that file IS the replacement
// baseline - same browser, same runner, same font rasterisation as the commit
// that would regenerate it. So harvest those instead of paying to recreate
// them.
//
// The naming is load-bearing, so it was verified rather than assumed:
//
//   snapshotPathTemplate   {testDir}/__screenshots__/{arg}-{platform}{ext}
//   baseline               components-badge--large--light-linux.png
//   failure output         components-badge--large--light-actual.png
//
// The platform suffix is absent from the -actual name, which is the whole of
// the rename below. Checked by breaking a baseline on purpose and reading what
// landed in test-results/ - if a Playwright upgrade moves these files, this
// script reports zero and says so loudly rather than uploading an empty folder.
//
// Never fails the build: the real failure is the visual diff, and a diagnostic
// that can mask it is worse than no diagnostic.
//
//   node scripts/collect-proposed-baselines.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const results = path.join(root, 'test-results');
const outDir = path.join(root, 'visual/__proposed__');
const baselines = path.join(root, 'visual/__screenshots__');

// CI is linux and that is the committed set; locally this still works and
// names the platform you are actually on, which is the useful thing to see.
const PLATFORM = process.platform === 'win32' ? 'win32' : process.platform === 'darwin' ? 'darwin' : 'linux';

const summary = [];
const say = (line) => summary.push(line);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

const actuals = walk(results).filter((f) => f.endsWith('-actual.png'));

if (!actuals.length) {
  say('## Visual baselines');
  say('');
  say('No `-actual.png` files were found under `test-results/`.');
  say('');
  say('Either nothing failed a pixel comparison (the job failed for another reason —');
  say('a story that threw, a timeout, a missing build), or Playwright changed where it');
  say('writes failure output. If it is the latter, `scripts/collect-proposed-baselines.mjs`');
  say('needs updating; the diff report artifact is unaffected either way.');
  write();
  process.exit(0);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const moved = [];
for (const src of actuals) {
  const name = path.basename(src).replace(/-actual\.png$/, '');
  const target = `${name}-${PLATFORM}.png`;
  fs.copyFileSync(src, path.join(outDir, target));
  moved.push({
    target,
    // A story with no committed baseline is NEW, not changed - worth calling
    // out separately, because "accept" means something different for each.
    isNew: !fs.existsSync(path.join(baselines, target)),
    theme: name.endsWith('-dark') ? 'dark' : name.endsWith('-light') ? 'light' : '?',
    story: name.replace(/--?(light|dark)$/, ''),
  });
}

// One story failing in both themes is one story, not two.
const byStory = new Map();
for (const m of moved) {
  const row = byStory.get(m.story) ?? { themes: [], isNew: m.isNew };
  row.themes.push(m.theme);
  byStory.set(m.story, row);
}
const stories = [...byStory.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const added = stories.filter(([, r]) => r.isNew);
const changed = stories.filter(([, r]) => !r.isNew);

say('## Visual baselines');
say('');
say(`**${stories.length} ${stories.length === 1 ? 'story' : 'stories'} moved** ` +
    `— ${moved.length} ${moved.length === 1 ? 'image' : 'images'}.`);
say('');
say('The `visual-baselines-proposed` artifact on this run holds the new renders, already');
say('named as baselines. Download it to see what the pages now look like before deciding.');
say('');

if (changed.length) {
  say('### Changed');
  say('');
  say('| Story | Themes |');
  say('| --- | --- |');
  for (const [story, r] of changed) say(`| \`${story}\` | ${r.themes.sort().join(', ')} |`);
  say('');
}
if (added.length) {
  say('### New (no committed baseline yet)');
  say('');
  for (const [story, r] of added) say(`- \`${story}\` — ${r.themes.sort().join(', ')}`);
  say('');
}

const server = process.env.GITHUB_SERVER_URL;
const repo = process.env.GITHUB_REPOSITORY;
say('### If this is the change you meant');
say('');
if (server && repo) {
  say(`Run [Visual baselines](${server}/${repo}/actions/workflows/visual-baselines.yml) ` +
      '**from this branch** to regenerate and commit the linux set.');
} else {
  say('Run the "Visual baselines" workflow from this branch.');
}
say('');
say('It stays a separate, manual step on purpose — baselines that refresh themselves turn');
say('this gate into a rubber stamp that accepts the regressions it exists to catch. The');
say('point of the artifact above is that you can now see what you are accepting first.');

write();

function write() {
  const text = summary.join('\n') + '\n';
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (file) fs.appendFileSync(file, text);
  console.log(text);
}
