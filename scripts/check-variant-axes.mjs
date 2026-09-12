// Completeness check: does XUI implement every variant AXIS Figma defines?
//
// Every other gate in this repo verifies FIDELITY — that what was built matches
// the frame it was built from. None of them asks whether something exists in
// Figma that was never built at all, and those are different questions:
//
//   - pixel-parity compares a Figma PNG to a screenshot, so both sides are the
//     same variant by construction. A missing axis is invisible to it.
//   - figma-component-parity audits the STATE matrix (default/focused/error/...).
//     A size axis is not a state.
//   - the visual suite compares XUI to its own past, never to Figma.
//
// That gap shipped: Figma's `select` and `Tabs` both carry Size=[Large|Medium]
// and XUI implemented only Large. The audit that set Select's height even saw
// the evidence — "44 in 183 of its 187 instances" — and read the 4 outliers as
// noise rather than as the other size.
//
// This reads the committed axis snapshot rather than Figma, because CI has no
// Figma access — and it is not getting a token. Same shape as the visual
// baselines: a committed artefact plus a manual refresh.
//
// REFRESHING scripts/figma-axes.json is a Figma read, so it is done through the
// MCP server rather than a CLI: ask an agent to re-read every COMPONENT_SET's
// `componentPropertyDefinitions` on the Primary Components page and rewrite the
// file, unioning axes by set NAME. The union matters — the file carries two
// generations of several sets and the newer copy has sometimes lost an axis.
//
//   node scripts/check-variant-axes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAP, NOT_A_PROP, PROP_FOR, OUT_OF_SCOPE, ACCEPTED } from './figma-map.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'scripts/figma-axes.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'xui.manifest.json'), 'utf8'));


const findings = [];

for (const set of snapshot.sets) {
  const component = MAP[set.figma];

  if (component === undefined) {
    findings.push({ kind: 'unmapped', set: set.figma, detail: 'not in MAP — add it or map it to null' });
    continue;
  }

  if (OUT_OF_SCOPE[set.figma]) continue;

  if (component === null) {
    const axes = Object.keys(set.axes).filter((a) => !NOT_A_PROP.has(a));
    findings.push({
      kind: 'no-component',
      set: set.figma,
      detail: axes.length ? `no XUI component; axes ${axes.join(', ')}` : 'no XUI component',
    });
    continue;
  }

  const props = new Set(((manifest.components[component] ?? {}).props ?? []).map((p) => p.name));
  if (!manifest.components[component]) {
    findings.push({ kind: 'no-component', set: set.figma, detail: `MAP points at "${component}", which is not in the manifest` });
    continue;
  }

  for (const axis of Object.keys(set.axes)) {
    if (NOT_A_PROP.has(axis)) continue;
    if (ACCEPTED[`${component}.${axis}`]) continue;

    const prop = PROP_FOR[axis];
    if (!prop) {
      findings.push({ kind: 'unknown-axis', set: set.figma, component, detail: `axis "${axis}" has no entry in PROP_FOR` });
      continue;
    }
    if (!props.has(prop)) {
      const values = Array.isArray(set.axes[axis]) ? set.axes[axis].join(' | ') : `${set.axes[axis]} values`;
      findings.push({
        kind: 'missing-axis',
        set: set.figma,
        component,
        detail: `Figma has ${axis}=[${values}] — \`${prop}\` is not a prop on ${component}`,
      });
    }
  }
}

/* ---- report ---------------------------------------------------------------- */

// Several Figma sets map to one component — select and select_multiple are both
// Select, three sets are Tabs. The same missing axis is one finding, not three,
// so collapse by component+detail and name every set that shows it.
const grouped = new Map();
for (const f of findings.filter((x) => x.kind !== 'no-component')) {
  const key = `${f.kind}|${f.component ?? ''}|${f.detail}`;
  if (grouped.has(key)) grouped.get(key).sets.push(f.set);
  else grouped.set(key, { ...f, sets: [f.set] });
}
const blocking = [...grouped.values()];
const info = findings.filter((f) => f.kind === 'no-component');

if (info.length) {
  console.log('Figma sets with no XUI component — a backlog, not a regression.');
  console.log(`(${Object.keys(OUT_OF_SCOPE).length} more are out of scope and not listed: ${Object.keys(OUT_OF_SCOPE).join(', ')}.)`);
  for (const f of info) console.log(`  ${f.set.padEnd(30)} ${f.detail}`);
  console.log('');
}

if (!blocking.length) {
  console.log(`✓ every Figma variant axis is implemented or accepted (${snapshot.sets.length} sets checked)`);
  process.exit(0);
}

console.log('Variant axes Figma defines that XUI does not implement:\n');
for (const f of blocking) {
  console.log(`  ${f.kind}  ${f.component ?? f.sets[0]}   (from: ${f.sets.join(', ')})`);
  console.log(`    ${f.detail}\n`);
}
console.log(
  `${blocking.length} finding(s).\n` +
    `Implement the prop, or record the decision in ACCEPTED in this file with a reason.\n` +
    `If Figma changed, refresh scripts/figma-axes.json — see the header of this file.`,
);
process.exit(1);
