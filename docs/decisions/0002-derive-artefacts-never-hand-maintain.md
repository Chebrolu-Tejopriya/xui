# 0002 — Derive artefacts from source, never hand-maintain

**Status:** accepted · **Recorded:** 2026-08-15

## Context

The system needs several artefacts that are *about* the code rather than part
of it: a machine-readable component contract for agents, a colour rulebook
mapping primitives to semantics, 69 icon components across four tones.

Every one of these is trivial to write by hand and impossible to keep correct
by hand. A hand-written manifest is accurate the day it is written and wrong by
the next commit. The failure is silent — nothing breaks, the file just quietly
starts lying, and an agent reading it produces code against a system that no
longer exists.

## Decision

Anything derivable is generated from its source, by a script, checked in.

| Artefact | Generated from | By |
|---|---|---|
| `xui.rulebook.json` | `src/tokens/*.css` | `scripts/build-rulebook.mjs` |
| `xui.manifest.json` | `src/components/**`, the rulebook | `scripts/gen-manifest.mjs` |
| `src/icons/icons.tsx` | `scripts/icon-data/*.json` | `scripts/gen-icons.mjs` |

Generated files carry a `generated:` header naming the script. Regeneration is
one command (`npm run ds:build`). Hand-editing a generated file is a bug.

The knowledge that genuinely *cannot* be derived — which token to use for what,
per-component gotchas, anti-patterns — is authored separately
(`scripts/composition-rules.json`) and merged in, so it is editable without
touching the generator.

## Alternatives rejected

- **Hand-write the manifest.** Faster to a first version, and it would have been
  more polished. Rejected on drift: this artefact exists so an agent can trust
  it, and a stale contract is worse than no contract.
- **Generate at build time, don't commit.** Cleaner repo. Rejected because the
  contract needs to be readable on GitHub without running anything — an agent or
  a teammate should be able to fetch one URL.
- **Parse TypeScript with the compiler API** instead of targeted regex. More
  robust in general. Rejected as over-engineering for a codebase with
  consistent, self-imposed conventions; revisit if parsing starts missing props.

## Consequences

- A token or prop change is picked up by re-running one command; nothing to
  remember to update.
- Generators become load-bearing. A parser bug silently truncates the output —
  and did: a line-anchored regex dropped every `-content` label token because
  `labels.css` puts two declarations on one line. Counts are now asserted
  against the CSS as a check.
- Reviewers see generated diffs in PRs. Noisy, but it makes drift visible.
