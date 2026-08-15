# 0001 — Figma is the single source of truth

**Status:** accepted · **Recorded:** 2026-08-15

## Context

An AI agent generating UI code is fluent and confident, which is exactly the
problem. Asked for "the missing semantic tokens", it will produce a plausible,
well-named, internally consistent set — that does not exist in the design file.
This happened repeatedly early on and was only caught because the designer read
the output closely. The failure is quiet: invented tokens look right, pass
review, and diverge from design permanently.

The same applies to component states. A variant matrix inferred from the default
state is right most of the time, which is worse than being wrong all the time —
the exceptions hide.

## Decision

The Figma file is the only source of truth. The agent extracts; it does not
infer, fill gaps, or tidy up.

Concretely:

- Read the **bound variable** on a node, not the rendered hex. The binding is
  the designer's intent; the hex is a consequence.
- Fetch **every state** of a variant, not the default plus an assumption.
- When something is missing from the design, say so and stop. Do not invent a
  token, a state, or a name to make the set feel complete.
- Beyond-design decisions get flagged for approval before being built.

## Alternatives rejected

- **Let the agent complete obvious gaps.** Tempting, and the gaps really are
  often obvious. Rejected because "obvious" is doing the load-bearing work, and
  nobody audits a plausible-looking token. One invented value poisons the
  design/code contract that everything else here rests on.
- **Design in code, sync back to Figma.** Coherent, and a legitimate model for
  some teams. Rejected because the designers work in Figma and the design file
  is where product decisions actually get made.

## Consequences

- Slower up front. Building a component means N variants × M states of fetching
  before a line of code.
- Extraction over generation shapes every tool here: the icon pipeline, the
  parity skills, the token rulebook.
- Gaps in the design surface as explicit questions rather than silent invention
  — which is the point, but it does push work back to the designer.
- When the design *is* wrong, code inherits the error faithfully. That is the
  correct trade: one visible bug beats an invisible divergence.
