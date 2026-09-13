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
