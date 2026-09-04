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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'scripts/figma-axes.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'xui.manifest.json'), 'utf8'));

/**
 * Which XUI component a Figma set is. Hand-kept on purpose: Figma names are
 * `select_multiple` and `menubar item`, and no rule turns those into `Select`
 * and `Tabs` without someone deciding. `null` means "no XUI component" — a
 * whole component missing, which is a finding of its own.
 */
const MAP = {
  button: 'Button',
  select: 'Select',
  select_multiple: 'Select',
  // NOT DateInput. Figma's `Select Date` is 44/36 — the SELECT scale — while
  // XUI's DateInput is the Input family at 48/44. A select-shaped date picker
  // is a component XUI does not have; the input-shaped one it does.
  'Select Date': null,
  'Select Date Range': null,
  'Tabs/Default': 'Tabs',
  'Tabs/WithIcons': 'Tabs',
  Tabs: 'Tabs',
  'menubar item': 'Tabs',
  badge: 'Badge',
  input: 'Input',
  Avatar: 'Avatar',
  Switch: 'Switch',
  Checkbox: 'Checkbox',
  Tooltip: 'Tooltip',
  Toast: 'Toast',
  'accordion Item': 'Accordion',
  'Radio Button': 'Radio',
  'breadcrumb item': 'Breadcrumbs',
  Pagination: 'Pagination',
  'Dialog with Icon': 'Dialog',
  'Mobile/Dialog with Icon': 'Dialog',
  'menu item': null,
  Slider: null,
  Day: null,
  'Calendar + Date Picker': null,
  'Calendar + Date Range Picker': null,
  'Line Chart': null,
  'Bar Chart': null,
  Scrollbar: null,
  'State-Numbers': null,
};

/**
 * Axes that are NOT props. A hover or a disabled state is CSS and the DOM, and
 * Figma has to draw it as a variant because a static frame has no other way to
 * show it. Listing them here is what keeps the check from crying wolf on every
 * component in the file.
 */
const NOT_A_PROP = new Set(['State', 'state', 'Property 1', 'Property 2', 'Style']);

/** Figma axis name -> the prop that implements it. */
const PROP_FOR = {
  Size: 'size',
  Type: 'variant',
  type: 'variant',
  Variant: 'variant',
  Variants: 'variant',
  Icon: 'icon',
  'Icon on left': 'iconLeft',
  'Icon on right': 'iconRight',
  Selected: 'checked',
  isSelected: 'selected',
  Percentage: 'value',
};

/**
 * Axes we have decided NOT to implement, with the reason. An entry here is a
 * decision on the record; an axis missing from both here and the code is an
 * unanswered question, which is what this gate exists to surface.
 */
/**
 * Figma sets that are NOT part of the system — drawn, but not something XUI is
 * meant to grow. teja's call. They stay out of the backlog the report prints so
 * that list means "still to build" rather than "everything Figma contains".
 *
 * The file half-agrees: Scrollbar sits in a section still called "Section 2",
 * Figma's default name for one nobody titled. Slider has its own named section,
 * so that one is a decision rather than a signal.
 */
const OUT_OF_SCOPE = {
  Slider: 'Not part of the system.',
  Scrollbar: 'Not part of the system — and it lives in an untitled "Section 2" in the file.',
};

const ACCEPTED = {
  'Tooltip.Type': 'Figma encodes placement as Type; XUI has `placement` with the same four values plus its own naming.',
  'Checkbox.Property 2': 'Unnamed axis carrying states — checked/disabled are DOM, and Parital-Selected is `indeterminate`.',
  'Input.type': 'XUI splits this axis into SEPARATE COMPONENTS — AmountInput, DateInput, PhoneInput, PasswordInput, SecretInput, Otp, FileUpload — rather than one Input with eleven modes. ADR 0007, composable primitives over configured components.',
  'Switch.Selected': '`checked` is a native input attribute. SwitchProps extends InputHTMLAttributes so it is supported but never DECLARED, and the manifest lists only declared props. See the limit noted below.',
};

/**
 * KNOWN LIMIT: this compares against the manifest, which lists only props a
 * component DECLARES. A component that spreads native attributes — Switch
 * extends InputHTMLAttributes — supports more than the manifest shows, so an
 * axis covered that way reads as missing. Each such case belongs in ACCEPTED
 * with that reason, which is why Switch.Selected is there. Resolving inherited
 * types properly needs the type checker, not the manifest.
 */

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
