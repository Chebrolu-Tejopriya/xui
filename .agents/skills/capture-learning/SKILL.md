---
name: capture-learning
description: Write down something we had to be told, so we only have to be told once — append it to the right bucket in .claude/learnings/ with kind, date, author and confidence. Use whenever teja corrects you or states a preference, when you lose real time to a trap someone else will hit, when you work around something instead of fixing it, or when the user says "remember this" / "note this down" / "don't do that again". Also use to READ the learnings at the start of a session or before starting unfamiliar work.
---

<!-- GENERATED from .claude/skills/capture-learning/SKILL.md by scripts/gen-agent-rules.mjs. Do not edit — edit the source and run npm run ds:build. -->

# Capture a learning

`.claude/learnings/` holds things we had to be told. Six bucket files, in git,
read at the start of a session. `README.md` there is the format spec — read it
before writing your first entry.

## Reading them

At the start of a session, or before touching an unfamiliar area, read the
bucket that covers it. They are short by design; reading all six costs little.

Treat an `owner-correction` as settled. It is teja saying no, and relitigating
it is how the same argument gets had twice.

## Writing one

Append to the top of the matching file:

```markdown
## Short imperative title
> kind · YYYY-MM-DD · who · confidence

Two or three sentences. What the rule is, and the evidence — the quote if it
was said, the measurement if it was found.
```

**kind**: `owner-correction` (teja said no) · `preference` (how teja wants to
work) · `decision` (settled choice) · `gotcha` (technical trap) · `hardcoded`
(a workaround that is debt, not design).

**confidence**: `confident` · `likely` · `unverified`.

**who**: read it, do not guess it — `git config user.name`. The
[[onboarding]] script sets it on a new machine precisely so this field is
accurate for whoever is actually at the keyboard, not whoever you assume.

## When

- **teja corrects you → always.** This is the whole point. Six corrections were
  given in one day's work and exactly one survived anywhere; the rest sat in a
  transcript nobody reads, waiting to be repeated.
- A trap that cost you more than a few minutes and will cost someone else the
  same → `gotcha`.
- You worked around something rather than fixing it → `hardcoded`, so the next
  person knows it is debt.

## What NOT to write

Anything the repo already states. Component props are in `xui.manifest.json`,
token values in `xui.rulebook.json`, past fixes in git, architecture in
`docs/decisions/`. Record what is **not derivable from the code**.

Do not write an entry to look productive. A bucket of platitudes is worse than
an empty one, because it costs a read and returns nothing.

## Which file

| bucket | holds |
|---|---|
| `process-scope.md` | how to work here, what belongs in this repo |
| `components.md` | which component to reach for, what not to build |
| `tokens-styling.md` | naming, scales, what not to invent |
| `figma-to-code.md` | reading the file, and ambiguity in it |
| `icons.md` | four families, collisions, picking |
| `gotchas.md` | technical traps, mostly CSS and Figma geometry |

If it genuinely fits none of them, say so rather than forcing it — a seventh
bucket is cheaper than a wrong one. That mistake has already been made once
here, with the general-icon categories: **a wrong taxonomy is worse than none.**

## Related

An ADR (`docs/decisions/`) is for an architecture decision with
alternatives-rejected. A learning is shorter and is about what we were *told*.
When an entry grows past a few sentences and has real alternatives, it wants to
be an ADR — write that, and leave a one-line learning pointing at it.
