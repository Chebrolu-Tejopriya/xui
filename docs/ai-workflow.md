# AI Workflow Documentation

How we build UI at KoinX with AI in the loop — and, more importantly, what we
had to put around the AI to make its output trustworthy.

> **Reading this doc.** Four layers, coarse to fine. Most people need only the
> first. **1. The workflow** — what this is and whether it worked.
> **2. The playbook** — how to actually run it. **3. Decisions** — why it is
> shaped this way. **4. Reference** — the living files in the repo.

---

# 1. The workflow

## The problem

A design system drifts. Not dramatically — a hex typed instead of a token, a
hover state that never made it out of Figma, a component built from the default
variant because nobody fetched the other four. Each one is small. Together they
mean the design file and the product stop describing the same thing, and nobody
can say which one is right.

AI makes this faster in both directions. An agent can build a component in
minutes. It can also invent a plausible token that does not exist in the design
file, name it convincingly, and have it reviewed and merged — because it looks
exactly like something we would have named.

So the interesting problem was never "can AI write the component". It was:

> **What has to be true for an agent's UI output to be trustworthy without a
> human checking every pixel?**

Everything here is an answer to that.

## The four pieces

| | What it is | What it solves |
|---|---|---|
| **XUI** | The design system: tokens → components → icons → patterns, in Storybook | One implementation, theme-correct, parity-verified |
| **xemantics** | A Figma plugin that rewrites primitive colours to semantic tokens | Drift at the *design* source, where it starts |
| **XUI Code Connect** | Figma components mapped to real code components | The agent reads a design and knows what to import |
| **The agent contract** | A generated manifest + rulebook + skills | The agent composes correctly without being re-taught |

They only matter *together*. The plugin fixes design-side drift; the linter
fixes the same drift in code; both read the **same rulebook**, so a colour
resolves identically on either side.

```
                    ┌──────────────────┐
   Figma  ─────────▶│  xui.rulebook    │◀───────── src/tokens/*.css
   (design truth)   │  (derived)       │           (code truth)
                    └────────┬─────────┘
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        xemantics      lint-tokens     xui.manifest
        (fix design)   (fix code)      (teach the agent)
```

## The rules that make it work

Four constraints do most of the load-bearing:

1. **Figma is the only source of truth. Invent nothing.** Read the *bound
   variable*, not the rendered colour. Fetch every state, not the default plus
   an assumption. When something is missing, say so — do not fill the gap.
   ([0001](decisions/0001-figma-is-the-single-source-of-truth.md))
2. **Derive, never hand-maintain.** The manifest, the rulebook, and all 69 icons
   are generated from source by scripts. A hand-written contract is accurate the
   day it is written and lying by the next commit.
   ([0002](decisions/0002-derive-artefacts-never-hand-maintain.md))
3. **Assert numbers before looking at pixels.** Every visual defect a human
   caught had already passed a screenshot review.
   ([0004](decisions/0004-parity-gates-assert-numbers-first.md))
4. **Semantic tokens only.** No hex, no `rgb()`, no primitives in product code —
   enforced by a linter, not by review.
   ([0005](decisions/0005-semantic-tokens-only-in-product-code.md))

## Did it work

| | |
|---|---|
| Semantic tokens, exact mirror of Figma | **61** (24 surface · 13 content · 8 border · 16 label) |
| Components, parity-verified | **30** |
| Icons, 11 categories × 4 tones | **69** |
| Repeatable procedures captured as skills | **6** |
| Raw colours / stray primitives in product code | **0** (was 8) |

The number that matters least is the count of components. The one that matters
most is the **zero** — it is enforced by a script, so it stays zero.

## What we would tell another team

- **The guardrails are the product.** The agent was never the bottleneck.
  Extraction discipline, generated contracts, and parity gates were.
- **Write the procedure down the second time you do it.** Six skills exist
  because the same audits kept being re-explained, unevenly.
- **Invest in the gate, not the review.** A number in a test catches what a
  careful human eye does not.
- **The corrections are the valuable part.** Three of our nine recorded
  decisions came from a human pushing back on a confident, wrong agent. Capture
  those; they are where the guardrails come from.

---

# 2. The playbook

## The loop

```
  pick the Figma node
        │
        ▼
  extract the FULL spec        every variant × every state, bound variables
        │
        ▼
  build with existing parts    compose components + semantic tokens
        │
        ▼
  gate: numbers, then pixels   computed styles vs spec, light AND dark
        │
        ▼
  capture what was learned     skill update + ADR if a real decision was made
```

## Runbooks

**Build or audit a component** → skill: `figma-component-parity`, then
`pixel-parity-verify`.
Fetch every state up front (N variants × 5 states, not N × 1) — the exceptions
are exactly the bugs worth catching. Reuse existing components and tokens. Gate
before calling it done.

**Sync or audit tokens** → skill: `figma-variable-parity` (whole collection) or
`sync-figma-tokens` (from a Variables screenshot).
Never conclude "all tokens match" from a sampled read — only a full-collection
dump justifies that claim.

**Add or fix icons** → skill: `figma-icon-parity`.
Extraction stays faithful to Figma; theming happens in the generator. Always
check dark mode — that is where hardcoded white surfaces as a bug.
([0008](decisions/0008-theming-lives-in-the-generator.md))

**Build a pattern** (table, form, page header) → primitives first, with the spec
baked in; convenience wrappers later, on top.
([0007](decisions/0007-composable-primitives-over-configured-components.md))

**Write UI with the system** → read
[`AGENTS.md`](../AGENTS.md) and [`xui.manifest.json`](../xui.manifest.json).

## Commands

```bash
npm run ds:check      # rebuild the contract + lint tokens
npm run lint:tokens   # find raw colours / primitives (--fix rewrites safe ones)
npm run storybook     # visual review at :6006
npm run build         # tsc + vite
```

## The gates

Nothing is "done" until:

- computed values match the Figma spec **exactly** (height, colours, gaps)
- it is verified in **light and dark**
- it holds **per variant, per state** — a passing default proves nothing
- `npm run ds:check` and `npm run build` are clean

## Traps that cost us hours

| Trap | Why it bites |
|---|---|
| Figma strokes take no layout space; CSS borders do | Fixed height + border renders 2px over spec. Table rows came out 53px against a 52px spec. |
| An inline `<svg>` sits on the text baseline | Icon-only buttons had the glyph 3.5px high — `gapTop 4.5` vs `gapBottom 11.5`. |
| Hardcoded white looks perfect in light mode | Icon knockouts rendered as white blobs on dark. |
| `selected` is not `hover` | Different tokens (`surface-brand-secondary` vs `surface-secondary`). Easy to conflate; wrong in both themes. |
| Same colour, wrong group | `surface-brand-primary` and `content-brand-primary` are both `blue-09`. Only the binding distinguishes them. |
| A design "gap" may be deliberate | Figma binds some values to raw primitives on purpose. Read the file before proposing tokens. ([0006](decisions/0006-read-design-bindings-dont-propose-tokens.md)) |

---

# 3. Decision log

Full records — context, decision, **alternatives rejected**, consequences — in
[`docs/decisions/`](decisions/). The alternatives are the point: without them a
future reader re-opens a settled question.

| # | Decision | The non-obvious part |
|---|---|---|
| [0001](decisions/0001-figma-is-the-single-source-of-truth.md) | Figma is the single source of truth | Invented tokens *look right* — that is what makes them dangerous |
| [0002](decisions/0002-derive-artefacts-never-hand-maintain.md) | Derive artefacts, never hand-maintain | A hand-written contract is wrong by the next commit |
| [0003](decisions/0003-skills-encode-repeatable-process.md) | Skills encode repeatable process | The knowledge existed — in a chat nobody could see |
| [0004](decisions/0004-parity-gates-assert-numbers-first.md) | Parity gates assert numbers first | Every caught defect had passed a screenshot review |
| [0005](decisions/0005-semantic-tokens-only-in-product-code.md) | Semantic tokens only in product code | Dark-mode bugs are invisible in light mode |
| [0006](decisions/0006-read-design-bindings-dont-propose-tokens.md) | Read design bindings, don't propose tokens | Two of five "gaps" were not gaps |
| [0007](decisions/0007-composable-primitives-over-configured-components.md) | Composable primitives over config | An agent composes JSX better than it learns a schema |
| [0008](decisions/0008-theming-lives-in-the-generator.md) | Theming in the generator | Keeps a bad mapping cheap to fix |
| [0009](decisions/0009-repo-owns-reference-notion-owns-narrative.md) | Repo owns reference, Notion owns narrative | Split by volatility, not topic |

---

# 4. Reference

Living files — they change with the code, so this section **links** rather than
copies. ([0009](decisions/0009-repo-owns-reference-notion-owns-narrative.md))

| File | What it is |
|---|---|
| [`AGENTS.md`](../AGENTS.md) | How to build UI with XUI — the entry point for any agent |
| [`xui.manifest.json`](../xui.manifest.json) | Generated contract: components, props, variants, tokens, icons, composition rules |
| [`xui.rulebook.json`](../xui.rulebook.json) | Generated colour truth: primitives ↔ semantics ↔ hex, per theme |
| [`.claude/skills/`](../.claude/skills/) | The six procedures, with their known failure modes |
| [`PROGRESS.md`](../PROGRESS.md) | Current state and open items |
| `scripts/` | The generators and the token linter |
