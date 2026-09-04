// A component story may not draw its own icons.
//
// Every story in src/components is a claim about what the system produces. When
// one builds an <svg> inline it is showing a drawing of XUI rather than XUI, and
// nothing checks that drawing: not the token linter (an inline path has no
// token), not pixel-parity (it compares the same story to the same frame), not
// the visual suite (it compares the story to its own past, so a bad icon becomes
// the baseline).
//
// That is not hypothetical. Tabs > With icons used four freehand glyphs under a
// comment saying they "approximate" the Figma frame. Measured in an identical
// 20px box, the file glyph painted 12x15 and the profile one 18.6x20.2 -
// overflowing the box - so the row read as ragged however exactly the tab
// centred it, and the bug was reported twice as a Tabs alignment problem. The
// library's own glyphs measure 43-63% of their box because they came off one
// grid. Four more stories had the same thing: Button, Table, Toast, Breadcrumbs.
//
// So: import the icon. If the library has no such glyph, that is a finding about
// the library, not a licence to draw one in a story.
//
//   node scripts/check-story-icons.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src/components');

/**
 * Stories allowed to contain a raw <svg>, with the reason. An entry here is a
 * decision on the record. Keep it short - the point of the rule is that the
 * list stays close to empty.
 */
const ALLOWED = {
  // (none)
};

const findings = [];

for (const component of fs.readdirSync(dir)) {
  const folder = path.join(dir, component);
  if (!fs.statSync(folder).isDirectory()) continue;
  for (const file of fs.readdirSync(folder)) {
    if (!file.endsWith('.stories.tsx')) continue;
    const rel = path.relative(root, path.join(folder, file)).replace(/\\/g, '/');
    if (ALLOWED[rel]) continue;
    const src = fs.readFileSync(path.join(folder, file), 'utf8');
    // Ignore <svg mentioned inside a comment - the fix for this rule explains
    // itself in prose, and that prose should not trip it.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    const lines = code.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('<svg')) findings.push({ rel, line: i + 1, text: line.trim().slice(0, 72) });
    });
  }
}

if (!findings.length) {
  console.log('✓ no component story draws its own icons');
  process.exit(0);
}

console.log('Component stories drawing their own icons:\n');
for (const f of findings) console.log(`  ${f.rel}:${f.line}\n    ${f.text}`);
console.log(
  `\n${findings.length} inline <svg>. Import the glyph from src/icons instead -\n` +
    `Icons v2 (iconRegistry), the general icons (generalIcons) or the coin badges.\n` +
    `If the library genuinely lacks it, say so on Guides > Status rather than drawing it here.`,
);
process.exit(1);
