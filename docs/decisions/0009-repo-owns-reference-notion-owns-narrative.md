# 0009 — Repo owns reference, Notion owns narrative

**Status:** accepted · **Recorded:** 2026-08-15

## Context

The workflow needs writing up: for the team (how do I work this way), for
others (what is this and did it work), and for the record (why did we decide
that). The natural instinct is one comprehensive Notion page holding
everything.

That page starts wrong on day two. `AGENTS.md`, `xui.manifest.json` and the
skills change whenever the code changes; a Notion copy does not. Documentation
that disagrees with the code is worse than none — people trust it, act on it,
and lose time.

The three audiences also want genuinely different artefacts. A doc serving all
three at one depth serves none of them.

## Decision

Split by *volatility*, not by topic.

**The repo owns reference** — anything that must track the code:

- `AGENTS.md` — how to build UI with the system
- `xui.manifest.json` / `xui.rulebook.json` — the generated contract
- `.claude/skills/**` — procedures
- `docs/decisions/**` — this log

**Notion owns narrative** — anything written once and revised deliberately: the
story, the playbook, results, lessons. It links into the repo instead of
copying it.

Structured in four layers so each reader enters where they need: narrative →
playbook → decision log → reference links.

## Alternatives rejected

- **Everything in Notion.** One place, better formatting, easier to share.
  Rejected on rot: reference material copied out of the repo is stale
  immediately and silently.
- **Everything in the repo.** Perfect freshness, and unreadable to anyone not
  in GitHub. Narrative deserves a real document.
- **Auto-sync repo → Notion.** Best of both in principle. Rejected for now: more
  machinery than the problem justifies, and it needs API access that is not
  currently wired up. Revisit if manual mirroring gets annoying.

## Consequences

- Two homes to keep straight, with one rule: *if it changes when code changes,
  it belongs in the repo.*
- Notion links out, so a reader following a link needs repo access — fine
  internally, a gap for anything published externally.
- Decisions are captured in the PR that makes them, while the reasoning is
  fresh, rather than reconstructed later. Reconstructed decision logs read too
  clean and lose the alternatives.
