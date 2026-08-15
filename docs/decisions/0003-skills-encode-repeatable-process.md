# 0003 — Skills encode repeatable process

**Status:** accepted · **Recorded:** 2026-08-15

## Context

The same procedures recurred constantly: audit a component against Figma, sync
tokens, verify a render matches the design, structure a showcase story. Each
has real depth — which node IDs to fetch, which states are commonly skipped,
which browser-vs-Figma discrepancies to correct for.

Re-explaining these in a prompt each time produced uneven results. Worse, hard
lessons kept getting re-learned: a parity audit that checked only default states
missed a badge that failed to mute when disabled, an OTP error ring built per-box
instead of shared, and a box-sizing bug invisible in any screenshot. The
knowledge existed — in a past conversation nobody could see.

## Decision

Every repeatable procedure becomes a **skill**: a versioned markdown file in
`.claude/skills/<name>/SKILL.md` with a description that says when it fires, and
a body that encodes the procedure *and the traps*.

Current set:

| Skill | Fires when |
|---|---|
| `figma-component-parity` | building or auditing a component's state matrix |
| `figma-variable-parity` | auditing a whole variable collection |
| `figma-icon-parity` | icons look wrong, or the set changes |
| `sync-figma-tokens` | a Variables screenshot arrives |
| `component-showcase-stories` | structuring stories |
| `pixel-parity-verify` | the exit gate before "done" |

A skill is written the moment a procedure is done a second time, or the moment
a bug proves the procedure was incomplete. Bugs get folded back in — the icon
skill lists the five known icon failure modes because each one actually
happened.

## Alternatives rejected

- **Put it all in one big instructions file.** Simpler. Rejected because
  everything loads every time, relevant guidance gets diluted, and there is no
  signal about *when* a procedure applies.
- **Keep procedures in the prompt.** Zero setup. Rejected: it depends on the
  human remembering, which is exactly what failed.
- **Document procedures in the wiki for humans to follow.** Useful for people,
  useless to the agent — it never reads them at the right moment.

## Consequences

- Institutional knowledge is versioned and reviewable. The reason a rule exists
  is written next to the rule.
- The system gets better after each bug rather than merely fixed.
- Skills need maintenance; a stale skill actively misleads. They are edited in
  the same PR as the change that invalidates them.
- Some duplication with the agent contract (`AGENTS.md`). Deliberate: skills are
  *procedure* (how to do this task), the contract is *interface* (what exists).
