// Turn .claude/skills/ into the files Cursor and Codex actually read.
//
// WHY. Claude Code auto-discovers `.claude/skills/*/SKILL.md` and surfaces one
// when its description matches the task. Cursor and Codex never look there. They
// could still reach the learnings — AGENTS.md points at them — but nothing
// prompted them at the right moment: nobody told a Cursor user's agent to run
// find-icon at the point it was about to draw an <svg>. Some of the team use
// Cursor and Codex, so for them the skills simply did not exist.
//
// WHY NOT SYMLINKS, which is how Pocket FM does it. Windows needs developer mode
// for them and git checks them out as plain text files without it. It would work
// on a Mac and silently fail on the machine this repo is maintained on.
//
// WHY THIS IS NOT THE MISTAKE IT LOOKS LIKE. .agents/skills/ was a hand-made
// copy that drifted — two of six files were stale, and an agent reading the old
// one believed it had complied. The lesson was never "no copies". It was "no
// copies that can drift". These are GENERATED on every ds:build and CI fails if
// the committed ones differ, exactly as it does for xui.manifest.json.
//
//   .claude/skills/<name>/SKILL.md          the one source; edit this
//     -> .cursor/rules/xui-<name>.mdc       Cursor, "agent requested" rule
//     -> .agents/skills/<name>/SKILL.md     Codex
//
//   .claude/settings.json  "hooks"          the one source; edit this
//     -> .codex/hooks.json                  Codex (Cursor has no equivalent)
//
//   node scripts/gen-agent-rules.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, '.claude/skills');
const cursorDir = path.join(root, '.cursor/rules');
const codexDir = path.join(root, '.agents/skills');

/** Split `---\nfrontmatter\n---\nbody` and pull out name + description. */
function parse(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${path.relative(root, file)} has no frontmatter`);
  const fm = Object.fromEntries(
    m[1]
      .split('\n')
      .map((l) => l.match(/^(\w+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, k, v]) => [k, v.trim()]),
  );
  if (!fm.name || !fm.description) {
    throw new Error(`${path.relative(root, file)} needs both name and description in its frontmatter`);
  }
  return { name: fm.name, description: fm.description, body: m[2].trimStart(), raw: text };
}

const banner = (from) =>
  `<!-- GENERATED from ${from} by scripts/gen-agent-rules.mjs. Do not edit — edit the source and run npm run ds:build. -->\n\n`;

const skills = fs
  .readdirSync(src, { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(path.join(src, e.name, 'SKILL.md')))
  .map((e) => ({ dir: e.name, ...parse(path.join(src, e.name, 'SKILL.md')) }));

// Clear only what this script owns, so a stale skill is removed rather than left
// behind — and so anything someone else put here survives.
fs.mkdirSync(cursorDir, { recursive: true });
for (const f of fs.readdirSync(cursorDir)) {
  if (f.startsWith('xui-') && f.endsWith('.mdc')) fs.rmSync(path.join(cursorDir, f));
}
fs.rmSync(codexDir, { recursive: true, force: true });

for (const s of skills) {
  const from = `.claude/skills/${s.dir}/SKILL.md`;

  // Cursor: description set, alwaysApply false, no globs = an "agent requested"
  // rule, which the agent pulls in when the description fits. The nearest thing
  // Cursor has to a Claude skill's auto-discovery.
  fs.writeFileSync(
    path.join(cursorDir, `xui-${s.name}.mdc`),
    `---\ndescription: ${s.description}\nglobs:\nalwaysApply: false\n---\n\n${banner(from)}${s.body}`,
  );

  // Codex reads the same SKILL.md format, so this is the source verbatim with a
  // banner after the frontmatter (a comment before it would break the parse).
  const out = path.join(codexDir, s.dir);
  fs.mkdirSync(out, { recursive: true });
  const [, fm, body] = s.raw.match(/^(---\n[\s\S]*?\n---\n?)([\s\S]*)$/);
  fs.writeFileSync(path.join(out, 'SKILL.md'), `${fm}\n${banner(from)}${body.trimStart()}`);
}

// ---- hooks -----------------------------------------------------------------
//
// Codex reads <repo>/.codex/hooks.json in the same shape as the "hooks" key of
// Claude Code's settings: the same event names, the same handler fields, and it
// accepts "Write" as a matcher for its apply_patch edits. So this is a copy —
// generated, because the hand-made one had already drifted: it was missing the
// learning-nudge hook added after it, and nobody noticed for a month.
//
// The scripts themselves carry the difference between the two (see
// scripts/hooks/parity-reminder.mjs). What cannot be carried is SHELL SYNTAX:
// Claude Code runs a hook command through bash, Codex does not say which shell
// it uses. So a command here must be a plain `node scripts/hooks/<name>.mjs`,
// and a script that must not fail handles that itself.
const settings = JSON.parse(fs.readFileSync(path.join(root, '.claude/settings.json'), 'utf8'));
let hookCount = 0;
for (const [event, groups] of Object.entries(settings.hooks ?? {})) {
  for (const group of groups) {
    for (const h of group.hooks) {
      hookCount++;
      if (/\|\||&&|[|<>;`$]/.test(h.command)) {
        throw new Error(
          `.claude/settings.json ${event} hook uses shell syntax: ${h.command}\n` +
            'It is copied to .codex/hooks.json, and Codex does not run hooks through bash. ' +
            'Make it a plain "node scripts/hooks/<name>.mjs" and handle errors inside the script.',
        );
      }
    }
  }
}
fs.mkdirSync(path.join(root, '.codex'), { recursive: true });
fs.writeFileSync(
  path.join(root, '.codex/hooks.json'),
  JSON.stringify(
    {
      // Codex's own top-level field; the only place a JSON file can say this.
      description:
        'GENERATED from the hooks in .claude/settings.json by scripts/gen-agent-rules.mjs. ' +
        'Do not edit - edit the source and run npm run ds:build.',
      hooks: settings.hooks,
    },
    null,
    2,
  ) + '\n',
);

console.log(
  `agent rules: ${skills.length} skills -> .cursor/rules/xui-*.mdc and .agents/skills/ ` +
    `(${skills.map((s) => s.name).join(', ')}); ${hookCount} hooks -> .codex/hooks.json`,
);
