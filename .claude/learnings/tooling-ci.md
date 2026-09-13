# Tooling & CI

Gates, workflows, and the machinery around the system. Format: see `README.md`.

---

## Every gate here photographs; almost none of them clicks

> gotcha · 2026-09-12 · claude · confident

Visual regression, pixel parity, the token linter, the axis check — all look at
a component sitting still. That is why a checkbox whose label swallowed 968px of
a row, and a sidebar flyout that would not dismiss, both passed everything.

`npm test` (Storybook + vitest, real Chromium) is the only gate that interacts.
It existed and passed for a long time before anything ran it in CI.

When a component's behaviour matters, write a `behaviour`-tagged story with
assertions. Those are skipped by the visual suite and by `check:coverage` on
purpose — they exist to be clicked, not photographed.

---

## Renaming a story silently drops its visual coverage

> gotcha · 2026-09-12 · claude · confident

Moving the icon galleries from `Foundations/*` to `Icons Library/*` orphaned
their baselines under the old ids and gave the new ids none. **All 275 icons
lost visual coverage and the counts still balanced** — 119 stories, 119
baselines — so nothing looked wrong from any angle.

`npm run check:coverage` now asserts component→story, story→baseline and
baseline→story.

---

## Baselines are Linux and only CI can make them

> decision · confident

Committed baselines are `*-linux.png`; `*-win32.png` is per-developer scratch
and gitignored. Nobody here develops on Linux, so **the person who accepts a
visual change is never the person who made it**. That asymmetry, not the
frequency, is what makes baselines feel like a chore.

A failing `visual` job now writes a summary naming every story that moved and
attaches the new renders as `visual-baselines-proposed`, so the accept step is
no longer taken blind. Accepting stays manual: a gate that accepts its own
output is not a gate.

---

## Table strategy on narrow widths

> decision · 2026-08-27 · teja · confident

*"depending upon the content, we will probably hide a few columns, or sometimes
we have a horizontal scroll, or convert each row into a card."* Mobile is for
the taxes platform only.

---

## A generated file must not contain today's date

> gotcha · 2026-09-13 · confident

`xui.icons.json` stamped `"generated": "<today>"`. CI regenerates every
generated file and fails on any diff, so the stamp passed on the day it was
committed and would have failed **every push on every later day** — a gate that
breaks on the calendar, not on the code. Found as a one-line diff nobody made.

Output must depend on the source alone: no dates, no timestamps, no machine
paths, no unordered object keys. `gen-manifest` and `build-rulebook` already
wrote a fixed string; `gen-icon-index` now does too. If a date is genuinely
wanted, derive it from git (`git log -1 --format=%cs -- <path>`), which is
the same on every machine.

---

## Claude Code never read AGENTS.md — and Jetro owned CLAUDE.md

> gotcha · 2026-09-13 · confident

Claude Code reads `CLAUDE.md`, **not** `AGENTS.md` (its docs say so outright).
Both repos had only `AGENTS.md`, so no Claude session ever saw it: on teja's
machine Claude read the Jetro extension's `CLAUDE.md` ("You are an assistant
for the Jetro research platform") instead, and on a fresh clone it read nothing.
Cursor and Codex were fine all along — they read `AGENTS.md`.

The fix is a `CLAUDE.md` that is one line, `@AGENTS.md`, so every tool reads
one file. Do not copy the content across; import it.

The deeper cause: the Jetro VS Code extension **overwrote** `CLAUDE.md`,
`.mcp.json` and `.cursor/mcp.json` in every folder VS Code opened, on every
start, so we gitignored those names — and with them the only places a project
can configure its own agent. XUI's MCP server was therefore configured nowhere.
Jetro was uninstalled; the four files are ours and committed now, and CI fails
a commit that carries Jetro's copies. If the files ever revert, it is back.

---

## A hook command is `node <script>` — no Python, no shell syntax

> gotcha · 2026-09-13 · confident

The parity reminder was a `python -c` one-liner. It worked on teja's laptop and
nowhere else: most designers have no Python, and on Windows `python` is a
Microsoft Store stub, so the hook failed — silently, because it ended in
`|| true`. Now `scripts/hooks/parity-reminder.mjs`; Node is the one runtime
this repo can assume.

The same hooks run in Codex (`.codex/hooks.json`, generated from
`.claude/settings.json`), which does not say which shell it uses. So a command
is exactly `node scripts/hooks/<name>.mjs`: no `2>/dev/null`, no `||`. A script
that must never break the session exits 0 on every path itself.
`gen-agent-rules` refuses a command with shell syntax.

Codex describes an edit differently: `apply_patch`, with the patch text in
`tool_input.command` rather than a `file_path`. It accepts `"Write"` as a
matcher, which is what lets one config serve both — but a hook that reads only
`file_path` will match in Codex and never fire.

---

## Codex runs a repo's hooks only after each person trusts them

> gotcha · 2026-09-13 · confident

The first real Codex test (0.154 alpha, VS Code panel): the MCP server worked,
both hooks stayed silent. Not a bug in them — Codex's `hooks` feature is on,
but every project hook starts as *review required*, stores `enabled` +
`trusted_hash` per user once trusted, and re-asks when the hook changes. The
VS Code panel never shows that review; the terminal Codex does ("Hooks need
review" → Trust all and continue). Tell: the session log has **no hook events
at all** — an untrusted hook is skipped, not run and empty.

Two more from the same test:
- **Run the test in the right folder.** The first attempt ran in the
  Playground, which has no hooks; Codex then *created* a Badge.tsx to satisfy
  the prompt. Check `cwd` in `~/.codex/sessions/.../rollout-*.jsonl` first.
- **Codex writes tool approvals into the project config.** "Always allow" on
  `find_xui_icon` added a table to the committed `.codex/config.toml`. Every
  XUI tool is read-only, so they are pre-approved there — generated from
  `mcp/server.mjs` in this repo — and Codex has nothing to write.
- The learning nudge ignores messages over 600 characters, so two test prompts
  pasted as one never trigger it. Send them separately.
