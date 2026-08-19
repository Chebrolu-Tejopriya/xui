/**
 * Builds xui.rulebook.json — the single source of truth shared by:
 *   - scripts/gen-manifest.mjs  (the agent contract, B)
 *   - scripts/lint-tokens.mjs   (the raw-hex linter, C)
 *   - xemantics                 (the Figma plugin — same shape as its rules.js)
 *
 * Everything here is DERIVED from src/tokens/*.css, so it can never drift from
 * the stylesheet. Re-run after changing tokens:  node scripts/build-rulebook.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, 'src/tokens', p), 'utf8');

/** Pull the body of a top-level block whose selector matches `re`. */
function block(css, re) {
  const lines = css.split('\n');
  let depth = 0;
  let capturing = false;
  const out = [];
  for (const line of lines) {
    if (!capturing && re.test(line) && /\{\s*$/.test(line)) {
      capturing = true;
      depth = 1;
      continue;
    }
    if (capturing) {
      depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (depth <= 0) break;
      out.push(line);
    }
  }
  return out.join('\n');
}

/**
 * `--name: value;` pairs inside a block. Split on `;` rather than matching
 * line-anchored — labels.css puts two declarations on one line, and a
 * line-anchored regex silently drops the second (it ate every `-content`
 * token). A `var(--x)` reference can't false-positive: it has no `:` after
 * the name.
 */
function vars(body) {
  const out = {};
  for (const chunk of body.replace(/\/\*[\s\S]*?\*\//g, '').split(';')) {
    const m = /--([a-z0-9-]+)\s*:\s*([\s\S]+)$/.exec(chunk);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

const primitivesCss = read('primitives.css');
const semanticCss = read('semantic.css');
const labelsCss = read('labels.css');
const typographyCss = read('typography.css');

// ---- primitives: name -> hex, per theme -------------------------------------
const primLight = vars(block(primitivesCss, /^\s*(:root|\[data-theme='light'\])/));
const primDark = vars(block(primitivesCss, /^\s*\[data-theme='dark'\]/));

// labels resolve to raw hex too (they are their own scale, not aliases)
const labelLight = vars(block(labelsCss, /^\s*:root/));
const labelDark = vars(block(labelsCss, /^\s*\[data-theme='dark'\]/));

const isHex = (v) => /^#[0-9a-f]{3,8}$/i.test(v);
const onlyHex = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => isHex(v)));

// ---- semantics: token -> the primitive it aliases ----------------------------
const semLight = vars(block(semanticCss, /^\s*:root/));
const semDark = vars(block(semanticCss, /^\s*\[data-theme='dark'\]/));

const aliasOf = (v) => {
  const m = /^var\(\s*--([a-z0-9-]+)\s*\)$/i.exec(v);
  return m ? m[1] : null;
};

/** Color semantics only (things that alias a primitive), split by group. */
const semantics = {};
for (const [token, value] of Object.entries(semLight)) {
  const alias = aliasOf(value);
  if (!alias) continue; // radius/spacing/border-width are literals, handled below
  if (!(alias in primLight)) continue; // not a color primitive
  semantics[token] = { primitive: alias, dark: aliasOf(semDark[token] ?? '') ?? alias };
}
for (const [token, value] of Object.entries(labelLight)) {
  if (!isHex(value)) continue;
  semantics[token] = { primitive: null, hex: value, darkHex: labelDark[token] ?? value };
}

/** Non-color scales, kept as literal values. */
const scales = {};
for (const [token, value] of Object.entries(semLight)) {
  if (aliasOf(value)) continue;
  if (/^(radius|spacing|border-width|padding)-/.test(token)) scales[token] = value;
}

// ---- reverse map: hex -> the token(s) that resolve to it ---------------------
const norm = (h) => {
  let v = h.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(v)) v = '#' + [...v.slice(1)].map((c) => c + c).join('');
  return v.slice(0, 7);
};

const hexToPrimitive = { light: {}, dark: {} };
for (const [name, hex] of Object.entries(onlyHex(primLight))) {
  (hexToPrimitive.light[norm(hex)] ||= []).push(name);
}
for (const [name, hex] of Object.entries(onlyHex(primDark))) {
  (hexToPrimitive.dark[norm(hex)] ||= []).push(name);
}

/** primitive -> the semantic tokens that alias it (what the linter suggests). */
const primitiveToSemantics = {};
for (const [token, def] of Object.entries(semantics)) {
  if (!def.primitive) continue;
  (primitiveToSemantics[def.primitive] ||= []).push(token);
}

/**
 * Which semantic GROUP a color belongs to, given where it is used. Mirrors
 * xemantics' GROUP_FOR: the same primitive means different tokens depending on
 * whether it paints a background, text, or a border.
 */
const groupForProperty = {
  background: 'surface',
  'background-color': 'surface',
  color: 'content',
  fill: 'content',
  'border-color': 'border',
  border: 'border',
  'border-top-color': 'border',
  'border-right-color': 'border',
  'border-bottom-color': 'border',
  'border-left-color': 'border',
  outline: 'border',
  'outline-color': 'border',
  stroke: 'content',
  'box-shadow': 'border',
};

const rulebook = {
  $schema: 'https://xui.dev/rulebook.schema.json',
  generated: 'scripts/build-rulebook.mjs — derived from src/tokens/*.css, do not edit',
  version: 1,
  themes: ['light', 'dark'],
  primitives: { light: onlyHex(primLight), dark: onlyHex(primDark) },
  semantics,
  scales,
  typography: vars(block(typographyCss, /^\s*:root/)),
  reverse: { hexToPrimitive, primitiveToSemantics },
  groupForProperty,
};

fs.writeFileSync(path.join(root, 'xui.rulebook.json'), JSON.stringify(rulebook, null, 2) + '\n');

const n = (o) => Object.keys(o).length;
console.log(
  `rulebook: ${n(rulebook.primitives.light)} primitives, ${n(semantics)} semantics, ` +
    `${n(scales)} scale tokens, ${n(rulebook.typography)} type tokens -> xui.rulebook.json`,
);
