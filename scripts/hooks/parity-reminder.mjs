#!/usr/bin/env node
// PostToolUse hook: a component file was written, so remind the agent that
// "done" means pixel-parity verified, not "it compiles".
//
// ONE SCRIPT, TWO VENDORS. Claude Code and Codex both run this, and they
// describe a file write differently:
//
//   Claude Code  Write        tool_input.file_path
//   Codex        apply_patch  tool_input.command, the patch text — its
//                             "*** Add File: <path>" and "*** Update File:
//                             <path>" lines name the files. Codex accepts
//                             "Write" as a matcher for apply_patch, so the
//                             same hooks config serves both.
//
// WHY NOT THE `python -c` ONE-LINER IT REPLACES. Python is not on most
// designers' machines, and on Windows the `python` that is there is a Microsoft
// Store stub — so the reminder failed silently everywhere except the one laptop
// it was written on. And the Codex copy of that one-liner read only file_path,
// so in Codex it could never fire at all.
//
// It only ever ADDS context, and exits 0 on every path. The command that runs it
// is a plain `node <path>` with no shell syntax, because Codex does not promise
// which shell it uses.
//
// Test:  echo '{"tool_input":{"file_path":"src/components/Tabs/Tabs.tsx"}}' | node scripts/hooks/parity-reminder.mjs
import fs from 'node:fs';

let input;
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const toolInput = input?.tool_input ?? {};
const paths = [];

if (typeof toolInput.file_path === 'string') paths.push(toolInput.file_path);

const patch = Array.isArray(toolInput.command)
  ? toolInput.command.join('\n')
  : typeof toolInput.command === 'string'
    ? toolInput.command
    : '';
for (const m of patch.matchAll(/^\*\*\* (?:Add|Update) File: (.+)$/gm)) paths.push(m[1].trim());

// A component's own source or its CSS module — not its stories, which are
// checked by their own gates and are not what parity is measured against.
const COMPONENT = /src\/components\/.+\.(tsx|css)$/;
const written = [...new Set(paths.map((p) => p.replace(/\\/g, '/')))].filter(
  (p) => COMPONENT.test(p) && !p.endsWith('.stories.tsx'),
);
if (!written.length) process.exit(0);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext:
        `Component file written: ${written.join(', ')} - before declaring this component done, ` +
        'run the pixel-parity-verify skill (Figma PNG export vs same-scale screenshot + computed-style assertions).',
    },
  }),
);
