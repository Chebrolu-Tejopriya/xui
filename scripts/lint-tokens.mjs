/**
 * Token linter — the code-side mirror of the xemantics Figma plugin.
 *
 * xemantics rewrites primitive colours to semantic tokens in Figma; this does
 * the same job in the codebase: it finds raw hex/rgb() colours and direct
 * primitive references (var(--gray-04)) in product code, resolves each to the
 * semantic token that should be used instead, and can rewrite them.
 *
 * Both read the same derived rulebook (xui.rulebook.json), so design and code
 * resolve a colour identically.
 *
 *   node scripts/lint-tokens.mjs          # report
 *   node scripts/lint-tokens.mjs --fix    # rewrite the unambiguous ones
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIX = process.argv.includes('--fix');
const rulebook = JSON.parse(fs.readFileSync(path.join(root, 'xui.rulebook.json'), 'utf8'));

/** Token files legitimately hold raw hex — that is where colour is defined. */
const SKIP = [
  path.join('src', 'tokens'),
  path.join('src', 'icons', 'icons.tsx'), // generated; knockouts already tokenised
  path.join('src', 'index.css'), // demo-app page chrome, not design-system code
];

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full);
    } else if (/\.(css|tsx|ts)$/.test(entry.name)) {
      const rel = path.relative(root, full);
      if (!SKIP.some((s) => rel.startsWith(s))) files.push(full);
    }
  }
})(path.join(root, 'src'));

/**
 * Blank out comment CONTENT while preserving line/column positions, so a hex
 * quoted inside a comment (they document token mappings all over this codebase)
 * is never reported as a finding. Line-anchored filtering isn't enough — the
 * hex usually sits on a continuation line of a block comment.
 */
function stripComments(src) {
  const out = src.split('');
  let inBlock = false;
  for (let i = 0; i < src.length; i++) {
    if (!inBlock && src[i] === '/' && src[i + 1] === '*') {
      inBlock = true;
      out[i] = out[i + 1] = ' ';
      i++;
      continue;
    }
    if (inBlock) {
      if (src[i] === '*' && src[i + 1] === '/') {
        inBlock = false;
        out[i] = out[i + 1] = ' ';
        i++;
      } else if (src[i] !== '\n') out[i] = ' ';
      continue;
    }
    // `//` line comment, but not the `//` in a URL (`https://`)
    if (src[i] === '/' && src[i + 1] === '/' && src[i - 1] !== ':') {
      while (i < src.length && src[i] !== '\n') out[i++] = ' ';
    }
  }
  return out.join('');
}

/** Files carrying brand artwork (logos, flags) keep their own fixed colours. */
const IGNORE_FILE = /xui-lint-ignore-file/;

const normHex = (h) => {
  let v = h.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(v)) v = '#' + [...v.slice(1)].map((c) => c + c).join('');
  return v.slice(0, 7);
};

/** CSS property (or JSX style key) immediately before the colour on this line. */
function propertyOf(line) {
  const css = /([a-z-]+)\s*:\s*[^:]*$/i.exec(line);
  if (css) return css[1].toLowerCase();
  const jsx = /(\w+)\s*:\s*['"][^'"]*$/.exec(line);
  if (jsx) return jsx[1].replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
  return '';
}

/**
 * Which semantic token should replace `primitive` used as `property`?
 *
 * Only a candidate from the property's own group counts as auto-fixable — the
 * same primitive means different tokens by context (xemantics' GROUP_FOR). If
 * gray-08 is used as a border but its only semantic is `content-quaternary`,
 * that is a real design gap, not a rename: suggest it, never apply it.
 */
function suggest(primitive, property) {
  const all = rulebook.reverse.primitiveToSemantics[primitive] ?? [];
  if (!all.length) return { candidates: [], group: null, scopedHit: false };
  const group = rulebook.groupForProperty[property] ?? null;
  const scoped = group ? all.filter((t) => t.startsWith(group + '-')) : [];
  return { candidates: scoped.length ? scoped : all, group, scopedHit: scoped.length > 0 };
}

const findings = [];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  if (IGNORE_FILE.test(raw)) continue;
  const lines = stripComments(raw).split('\n');
  lines.forEach((line, i) => {

    // 1. raw hex
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const hex = normHex(m[0]);
      const property = propertyOf(line.slice(0, m.index));
      const prims = rulebook.reverse.hexToPrimitive.light[hex] ?? rulebook.reverse.hexToPrimitive.dark[hex] ?? [];
      const s = prims.length ? suggest(prims[0], property) : { candidates: [] };
      findings.push({
        file: path.relative(root, file),
        line: i + 1,
        kind: 'raw-hex',
        found: m[0],
        property,
        primitive: prims[0] ?? null,
        candidates: s.candidates,
        fixable: s.candidates.length === 1 && s.scopedHit,
        raw: m[0],
      });
    }

    // 2. rgb()/rgba() literals
    for (const m of line.matchAll(/\brgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g)) {
      findings.push({
        file: path.relative(root, file),
        line: i + 1,
        kind: 'raw-rgb',
        found: m[0] + '…)',
        property: propertyOf(line.slice(0, m.index)),
        candidates: [],
        fixable: false,
      });
    }

    // 3. a primitive used directly instead of a semantic token
    for (const m of line.matchAll(/var\(\s*--((?:gray|blue|red|orange|green)-\d+)\s*\)/g)) {
      const property = propertyOf(line.slice(0, m.index));
      const s = suggest(m[1], property);
      findings.push({
        file: path.relative(root, file),
        line: i + 1,
        kind: 'primitive',
        found: `var(--${m[1]})`,
        property,
        primitive: m[1],
        candidates: s.candidates,
        fixable: s.candidates.length === 1 && s.scopedHit,
        raw: `var(--${m[1]})`,
      });
    }
  });
}

// ---- fix mode ---------------------------------------------------------------
let fixed = 0;
if (FIX) {
  const byFile = {};
  for (const f of findings.filter((x) => x.fixable)) (byFile[f.file] ||= []).push(f);
  for (const [rel, list] of Object.entries(byFile)) {
    const full = path.join(root, rel);
    const lines = fs.readFileSync(full, 'utf8').split('\n');
    for (const f of list) {
      const i = f.line - 1;
      if (!lines[i].includes(f.raw)) continue;
      lines[i] = lines[i].replace(f.raw, `var(--${f.candidates[0]})`);
      fixed++;
    }
    fs.writeFileSync(full, lines.join('\n'));
  }
}

// ---- report -----------------------------------------------------------------
if (!findings.length) {
  console.log('✓ no raw colours or primitive references in product code');
  process.exit(0);
}

const label = { 'raw-hex': 'raw hex', 'raw-rgb': 'raw rgb()', primitive: 'primitive token' };
let current = '';
for (const f of findings) {
  if (f.file !== current) {
    current = f.file;
    console.log('\n' + current);
  }
  const fix = f.candidates.length
    ? `-> var(--${f.candidates[0]})${f.candidates.length > 1 ? `  (or ${f.candidates.slice(1).join(', ')})` : ''}`
    : '(no semantic token resolves this colour — check it is intentional)';
  console.log(`  ${String(f.line).padStart(4)}  ${label[f.kind]} ${f.found}${f.property ? ` on ${f.property}` : ''}  ${fix}`);
}

const fixable = findings.filter((f) => f.fixable).length;
console.log(
  `\n${findings.length} finding(s), ${fixable} auto-fixable.` +
    (FIX ? ` Fixed ${fixed}.` : fixable ? ' Run with --fix to rewrite them.' : ''),
);
process.exit(FIX ? 0 : 1);
