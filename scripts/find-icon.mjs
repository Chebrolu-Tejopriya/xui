#!/usr/bin/env node
// Find an XUI icon by what you mean, not by guessing its export name.
//
//   npx xui-find-icon settings
//   npx xui-find-icon "three dots menu"
//   node scripts/find-icon.mjs trash --all
//
// Reads xui.icons.json (see gen-icon-index.mjs for why that file exists and how
// the search terms are built). Prints the import line, because the answer to
// "which icon" is only useful if it is also the answer to "what do I type".
//
// If this returns nothing for a real concept, that IS the finding: say so on
// Guides > Status. It is not licence to draw one — check-story-icons.mjs blocks
// that in component stories, and for good reason.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// Works from the repo and from an install: src/ does not ship, the index does.
const file = [path.resolve(here, '..', 'xui.icons.json'), path.resolve(here, 'xui.icons.json')].find(
  (f) => fs.existsSync(f),
);
if (!file) {
  console.error('xui.icons.json not found. In the repo, run: node scripts/gen-icon-index.mjs');
  process.exit(1);
}
const index = JSON.parse(fs.readFileSync(file, 'utf8'));

const args = process.argv.slice(2);
const showAll = args.includes('--all');
const query = args.filter((a) => a !== '--all').join(' ').trim().toLowerCase();

if (!query) {
  console.log(`XUI has ${index.count} icons in ${Object.keys(index.families).length} families.\n`);
  for (const [key, f] of Object.entries(index.families)) {
    const n = index.icons.filter((i) => i.family === key).length;
    console.log(`  ${f.label} (${n})\n    ${f.note}\n`);
  }
  console.log('Search:  npx xui-find-icon <what you mean>      e.g. "settings", "three dots", "trash"');
  process.exit(0);
}

const qWords = query.split(/\s+/).filter(Boolean);

// Rank by how directly a hit answers the query. An exact export name beats a
// word match beats a prefix — otherwise a one-letter query drags back
// everything and the ranking carries no information.
function score(icon) {
  const name = icon.name.toLowerCase();
  let s = 0;
  if (name === query || name === `${query}icon`) s += 1000;
  if (name.startsWith(query)) s += 200;
  if (name.includes(query.replace(/\s+/g, ''))) s += 120;

  for (const w of qWords) {
    if (icon.terms.includes(w)) s += 100;
    else if (icon.terms.some((t) => t.startsWith(w))) s += 40;
    else if (w.length >= 5 && icon.terms.some((t) => t.includes(w))) s += 15;
    else s -= 25; // a query word nothing matched is evidence against this icon
  }
  // The whole phrase appearing in a curated synonym is the strongest signal
  // there is: someone wrote that phrase down for exactly this icon.
  if (icon.synonyms.some((syn) => syn.toLowerCase() === query)) s += 300;

  // Prefer the primary set when the match is otherwise equal; push the coin
  // badges down, since they are transaction artwork and almost never what
  // someone searching for a generic icon wants.
  if (icon.family === 'v2') s += 12;
  if (icon.family === 'coin') s -= 30;
  return s;
}

const hits = index.icons
  .map((i) => ({ ...i, score: score(i) }))
  .filter((i) => i.score > 0)
  .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

if (!hits.length) {
  console.log(`No XUI icon matches "${query}".\n`);
  console.log('Before drawing one: try a plainer word (we index the Figma layer names, plus');
  console.log('synonyms), or list a family with  npx xui-find-icon  and no arguments.\n');
  console.log('If the concept genuinely has no glyph, that is a gap in the icon set — record it');
  console.log('on Guides > Status. Do not hand-draw an <svg> into a component story; the');
  console.log('check:story-icons gate rejects it, and the reason is that hand-drawn glyphs');
  console.log('do not share the set’s optical sizing and read as ragged next to real ones.');
  process.exit(1);
}

const shown = showAll ? hits : hits.slice(0, 8);
console.log(`${hits.length} match${hits.length === 1 ? '' : 'es'} for "${query}"` +
            `${shown.length < hits.length ? ` — showing ${shown.length}, --all for the rest` : ''}\n`);

for (const icon of shown) {
  const fam = index.families[icon.family];
  console.log(`  ${icon.name}`);
  console.log(`    ${fam.label}${icon.synonyms.length ? `  ·  ${icon.synonyms.join(', ')}` : ''}`);
  console.log(`    ${icon.import}`);
  console.log(`    ${icon.usage}`);
  if (icon.family === 'coin') console.log(`    NOTE: ${fam.note}`);
  console.log('');
}

// Figma reuses one name for different drawings; code disambiguates with a
// suffix. Whoever is choosing needs to know the other one exists.
const stems = new Set(shown.map((i) => i.name.replace(/(General)?(Icon|Coin)\d*$/, '')));
const clashes = Object.entries(index.collisions).filter(([stem]) => stems.has(stem));
if (clashes.length) {
  console.log('Same name, different drawings — Figma reuses these, so check you picked the right one:');
  for (const [stem, names] of clashes) console.log(`  ${stem}: ${names.join('  ')}`);
}
