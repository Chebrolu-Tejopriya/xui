# 0006 — Read design bindings rather than proposing tokens

**Status:** accepted · **Recorded:** 2026-08-15

## Context

The token linter's first run left five findings it could not resolve: Toast's
default used `blue-02` where no `surface-brand-tertiary` existed; Switch used
`gray-08` and `gray-06` with no Surface token at those steps; Select's spinner
used `blue-05`.

Read as code problems, these look like **gaps in the token system**, and the
obvious move is to propose three new tokens to close them. That reasoning is
clean, self-consistent, and was wrong.

Told to check the design instead, the file gave a different answer entirely.
Each component had **two variant sets** — an older one bound to primitives and a
newer one bound to semantics:

| | Assumed | Design actually says |
|---|---|---|
| Toast default | needs a new `surface-brand-tertiary` | `surface-brand-secondary` — already exists |
| Switch track/thumb | needs a Surface token at `gray-08` | `content-quaternary` |
| Switch hover | needs a token at `gray-06` | raw `Gray/06` — deliberate, no token |
| Select spinner head | `surface-brand-primary` | `content-brand-primary` — right colour, wrong group |
| Select spinner arc | needs a token at `blue-05` | raw `Blue/05` — deliberate |

Two of the five "gaps" were not gaps. Two more were already solved by an
existing token. One was a group error invisible by colour, since both tokens
resolve to the same blue.

## Decision

When code and the token system disagree, read the design's **bound variables**
before proposing anything. Adding a token is a design decision, not a code fix.

The check is cheap — resolve `node.boundVariables.fills[0]` to a variable name
via the Plugin API — and it answers definitively.

## Alternatives rejected

- **Propose the three tokens.** Would have added tokens the system does not
  need, permanently, and still missed the `surface-` vs `content-` group error.
- **Leave the primitives and suppress the warnings.** Cheap. Would have kept
  four genuinely wrong bindings, including one that renders correctly today and
  would break the moment the brand tokens diverge.
- **Match by colour value.** How the wrong-group bug hides: `surface-brand-primary`
  and `content-brand-primary` are both `blue-09`. Only the binding distinguishes them.

## Consequences

- Generalises [0001](0001-figma-is-the-single-source-of-truth.md): the rule holds
  when the agent has a *good* reason to invent, which is when it is most likely to.
- Design files carry history. Multiple variant sets exist; the semantic-bound one
  supersedes the primitive-bound one, and picking the wrong one silently
  propagates stale values.
- Escape hatches earn their keep: two findings resolved to "the design does this
  too", which needed a way to record intent rather than a fix.
