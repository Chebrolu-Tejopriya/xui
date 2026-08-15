/**
 * Builds xui.manifest.json — the agent contract.
 *
 * Everything about the component API is DERIVED from src/components/**, and the
 * token inventory from xui.rulebook.json, so the manifest cannot drift from the
 * code. The judgement calls an agent needs (which token for what, how patterns
 * compose, what not to do) come from scripts/composition-rules.json.
 *
 *   node scripts/build-rulebook.mjs && node scripts/gen-manifest.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const compDir = path.join(root, 'src/components');

/** Body of a brace-delimited block starting at `from` (index of the `{`). */
function braceBody(src, from) {
  let depth = 0;
  for (let i = from; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(from + 1, i);
    }
  }
  return '';
}

const clean = (s) =>
  s
    .replace(/\/\*\*|\*\//g, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*?\s?/, '').trim())
    .filter(Boolean)
    .join(' ')
    .trim();

/** `export type XVariant = 'a' | 'b'` -> { XVariant: ['a','b'] } */
function unions(src) {
  const out = {};
  for (const m of src.matchAll(/export type (\w+)\s*=\s*([^;]+);/g)) {
    const opts = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    if (opts.length) out[m[1]] = opts;
  }
  return out;
}

/** Defaults from the destructured signature: `variant = 'primary'`. */
function defaults(src) {
  const out = {};
  for (const m of src.matchAll(/^\s{2,6}(\w+)\s*=\s*('[^']*'|true|false|\d+)\s*,\s*$/gm)) {
    out[m[1]] = m[2].replace(/'/g, '');
  }
  return out;
}

/** Exported *Props interfaces -> prop list with JSDoc + type + default. */
function props(src, unionMap, defaultMap) {
  const out = {};
  for (const m of src.matchAll(/export interface (\w*Props)\b([^{]*)\{/g)) {
    const name = m[1];
    const ext = (m[2].match(/extends\s+([^{]+)/) || [, ''])[1].trim();
    const body = braceBody(src, src.indexOf('{', m.index + m[0].length - 1));
    const list = [];
    // JSDoc (optional) followed by `propName?: Type;`
    const re = /(\/\*\*[\s\S]*?\*\/)?\s*(?:'([\w-]+)'|(\w+))(\?)?\s*:\s*([^;]+);/g;
    for (const p of body.matchAll(re)) {
      const propName = p[2] ?? p[3];
      const type = p[5].trim().replace(/\s+/g, ' ');
      const entry = { type, required: !p[4] };
      if (unionMap[type]) entry.options = unionMap[type];
      if (defaultMap[propName] !== undefined) entry.default = defaultMap[propName];
      if (p[1]) entry.description = clean(p[1]);
      list.push({ name: propName, ...entry });
    }
    out[name] = { extends: ext || undefined, props: list };
  }
  return out;
}

// ---- walk components --------------------------------------------------------
const components = {};
for (const dir of fs.readdirSync(compDir)) {
  const full = path.join(compDir, dir);
  if (!fs.statSync(full).isDirectory()) continue;
  const files = fs.readdirSync(full).filter((f) => f.endsWith('.tsx') && !f.includes('.stories.'));
  if (!files.length) continue;

  const exported = new Set();
  const idx = path.join(full, 'index.ts');
  if (fs.existsSync(idx)) {
    const i = fs.readFileSync(idx, 'utf8');
    for (const m of i.matchAll(/export\s*\{([^}]+)\}/g)) {
      for (const nm of m[1].split(',')) {
        const t = nm.trim().split(/\s+as\s+/).pop().trim();
        if (t && !t.startsWith('type')) exported.add(t);
      }
    }
  }

  for (const file of files) {
    const src = fs.readFileSync(path.join(full, file), 'utf8');
    const u = unions(src);
    const d = defaults(src);
    const p = props(src, u, d);
    // component functions actually exported from this folder
    const names = [...src.matchAll(/export (?:const|function) (\w+)/g)]
      .map((m) => m[1])
      .filter((n) => /^[A-Z]/.test(n) && (!exported.size || exported.has(n)));
    for (const name of names) {
      const propsKey = Object.keys(p).find((k) => k === `${name}Props`);
      components[name] = {
        group: dir,
        import: `import { ${name} } from 'xui';`,
        props: propsKey ? p[propsKey].props : [],
        extends: propsKey ? p[propsKey].extends : undefined,
        variants: Object.fromEntries(
          Object.entries(u).filter(([k]) => k.startsWith(name) || k.startsWith(dir)),
        ),
      };
    }
  }
}

// ---- icons ------------------------------------------------------------------
const iconsSrc = fs.readFileSync(path.join(root, 'src/icons/icons.tsx'), 'utf8');
const iconNames = [...iconsSrc.matchAll(/export const (\w+Icon) = createIcon/g)].map((m) => m[1]);
const iconCats = [...new Set([...iconsSrc.matchAll(/category: "([^"]+)"/g)].map((m) => m[1]))];

// ---- tokens (from the rulebook) ---------------------------------------------
const rulebook = JSON.parse(fs.readFileSync(path.join(root, 'xui.rulebook.json'), 'utf8'));
const byPrefix = (re) => Object.keys(rulebook.semantics).filter((t) => re.test(t)).sort();

const rules = JSON.parse(fs.readFileSync(path.join(root, 'scripts/composition-rules.json'), 'utf8'));
delete rules._comment;

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const manifest = {
  $schema: 'https://xui.dev/manifest.schema.json',
  generated: 'scripts/gen-manifest.mjs — derived from source, do not edit by hand',
  name: pkg.name ?? 'xui',
  version: pkg.version ?? '0.0.0',
  description:
    'XUI design system. Import components from "xui"; style with semantic CSS custom properties. Every token is theme-reactive (light/dark) — never hardcode a color.',
  usage: {
    install: "import { Button, Table, Badge } from 'xui';",
    tokens: "Reference tokens in CSS as var(--surface-primary); never a raw hex or a --gray-* primitive.",
    theming: "Set data-theme=\"dark\" on the root element; every semantic token re-resolves automatically.",
  },
  tokens: {
    surface: byPrefix(/^surface-/),
    content: byPrefix(/^content-/),
    border: byPrefix(/^border-(?!width)/),
    label: byPrefix(/^label-/),
    radius: Object.keys(rulebook.scales).filter((t) => t.startsWith('radius-')).sort(),
    spacing: Object.keys(rulebook.scales).filter((t) => t.startsWith('spacing-')).sort(),
    borderWidth: Object.keys(rulebook.scales).filter((t) => t.startsWith('border-width-')).sort(),
    typography: Object.keys(rulebook.typography).filter((t) => t.startsWith('type-')).sort(),
  },
  components,
  icons: {
    count: iconNames.length,
    categories: iconCats,
    tones: ['outlined', 'solid', 'dualtone', 'dualtone-selected'],
    usage: "import { WalletIcon } from 'xui'; <WalletIcon variant=\"dualtone\" size={24} />",
    names: iconNames,
  },
  ...rules,
};

fs.writeFileSync(path.join(root, 'xui.manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `manifest: ${Object.keys(components).length} components, ${iconNames.length} icons, ` +
    `${Object.values(manifest.tokens).flat().length} tokens -> xui.manifest.json`,
);
