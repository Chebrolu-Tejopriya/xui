/**
 * Drift check: the xemantics Figma plugin vs xui.rulebook.json.
 *
 * The plugin keeps its own SEMANTICS map — Figma variable path -> primitive —
 * because a Figma plugin cannot read this repo at runtime. That copy is the
 * risk: when a semantic is added or repointed here, nothing tells the plugin,
 * and design and code start disagreeing silently.
 *
 * This does not fix that. It makes it visible in one command:
 *
 *   node scripts/check-xemantics.mjs [path/to/xemantics/rules.js]
 *
 * Defaults to ../xemantics/rules.js. Exits non-zero only on a real conflict —
 * a token both sides know about but map differently. Tokens missing from the
 * plugin are reported as warnings, since it deliberately ignores some (scrims).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rulesPath = process.argv[2] ?? path.resolve(root, '..', 'xemantics', 'rules.js');

if (!fs.existsSync(rulesPath)) {
  console.error(`Cannot find the plugin's rules at ${rulesPath}`);
  console.error('Pass the path: node scripts/check-xemantics.mjs <path/to/rules.js>');
  process.exit(2);
}

/** `Gray/02-Background` -> `gray-02`, `Blue/09(Base)` -> `blue-09`. */
function toPrimitive(value) {
  const [group, rest = ''] = value.split('/');
  const num = /^(\d+)/.exec(rest)?.[1];
  return num
    ? `${group.toLowerCase()}-${num}`
    : `${group.toLowerCase()}-${rest.toLowerCase().replace(/[^a-z0-9]+/g, '')}`;
}

const src = fs.readFileSync(rulesPath, 'utf8');
const start = src.indexOf('const SEMANTICS = {');
if (start === -1) {
  console.error('No `const SEMANTICS = {` found — has the plugin been restructured?');
  process.exit(2);
}
const block = src.slice(start, src.indexOf('\n};', start));

const plugin = {};
for (const [, key, value] of block.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
  plugin[key.split('/').pop()] = toPrimitive(value);
}

const rulebook = JSON.parse(fs.readFileSync(path.join(root, 'xui.rulebook.json'), 'utf8'));
const code = rulebook.semantics;

const conflicts = [];
const missingFromPlugin = [];
const unknownToCode = [];

for (const [token, def] of Object.entries(code)) {
  if (!(token in plugin)) {
    missingFromPlugin.push(token);
    continue;
  }
  // Label tokens resolve to raw hex here, not a primitive — nothing to compare.
  if (def.primitive && plugin[token] !== def.primitive) {
    conflicts.push(`${token}: plugin=${plugin[token]}  code=${def.primitive}`);
  }
}
for (const token of Object.keys(plugin)) if (!(token in code)) unknownToCode.push(token);

console.log(`plugin semantics: ${Object.keys(plugin).length}   rulebook semantics: ${Object.keys(code).length}`);

if (conflicts.length) {
  console.log(`\n✗ ${conflicts.length} token(s) mapped differently — design and code disagree:`);
  conflicts.forEach((c) => console.log('   ' + c));
}
if (missingFromPlugin.length) {
  console.log(`\n! ${missingFromPlugin.length} token(s) the plugin does not know about:`);
  console.log('   ' + missingFromPlugin.join(', '));
}
if (unknownToCode.length) {
  console.log(`\n! ${unknownToCode.length} token(s) the plugin has that this repo does not:`);
  console.log('   ' + unknownToCode.join(', '));
}
if (!conflicts.length && !missingFromPlugin.length && !unknownToCode.length) {
  console.log('\n✓ plugin and rulebook agree exactly');
} else if (!conflicts.length) {
  console.log('\n✓ no conflicts — every shared token maps identically');
}

process.exit(conflicts.length ? 1 : 0);
