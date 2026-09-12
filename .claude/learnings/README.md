# Learnings

Things we had to be told, written down so we only have to be told once.

**Read these at the start of a session.** Seven files, short on purpose.

## Why this exists, and why the repo rather than memory

An agent working here already has two places to put knowledge, and neither does
this job:

- **ADRs** (`docs/decisions/`) are long-form architecture decisions with
  alternatives-rejected. Right for "why is Input split into seven components",
  wrong for "teja already told you Select IS the menu".
- **Agent memory** lives outside the repo, on one machine, belonging to one
  session. It does not ship, cannot be reviewed, and does not reach the next
  person or the next tool.

So corrections evaporated. Six were given in a single day's work and exactly one
survived anywhere — the rest sat in a transcript nobody will read, waiting to be
made again next month.

These files are in git. They travel.

## Format

One entry, one thing. Newest at the top of its file.

```markdown
## Select is the menu
> owner-correction · 2026-09-04 · teja · confident

XUI has no separate Menu component and does not need one — Select with
`value={null} check={false} menuWidth="content"` IS the action menu. Do not
build a local one; that has been tried and deleted.
```

The metadata line is `kind · date · who · confidence`.

**kind** — what sort of knowledge this is, because they carry different weight:

| kind | meaning |
|---|---|
| `owner-correction` | teja said no. Highest authority here. Do not relitigate. |
| `preference` | how teja wants to work, not a technical fact |
| `decision` | a settled choice; if it has an ADR, link it |
| `gotcha` | a technical trap that cost us real time |
| `hardcoded` | a workaround that is NOT principled — flag it if you touch it |

**confidence** — `confident` (seen more than once, or stated outright) ·
`likely` (inferred from one instance) · `unverified` (write it down, but check).

## When to add one

- teja corrects you → **always**, as `owner-correction`
- you lose more than a few minutes to a trap someone else will hit → `gotcha`
- you work around something rather than fix it → `hardcoded`, so the next person
  knows it is debt and not design

Do not record what the repo already says. A component's props are in the
manifest; a token's value is in the rulebook; a past fix is in git. Record what
is **not** derivable from the code.

## The buckets

| file | holds |
|---|---|
| `process-scope.md` | how to work here, and what belongs in this repo at all |
| `components.md` | which component to reach for, and what not to build |
| `tokens-styling.md` | naming, scales, and what not to invent |
| `figma-to-code.md` | reading the file, and what to do when it is ambiguous |
| `icons.md` | four families, collisions, and how to pick |
| `gotchas.md` | technical traps, mostly CSS and Figma's geometry |
| `tooling-ci.md` | the gates, the baselines, and what each one cannot see |

## The manual half is the whole thing, for now

Pocket FM's version also extracts learnings automatically on push, with a small
model categorising session transcripts. Ours are on disk and readable — the
question list in this repo's history was pulled from them — but the categorising
step needs an API key nothing here has. The manual half is where most of the
value is anyway: the agent writing it down at the moment it is told.
