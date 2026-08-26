# 0018 — Review concentrated in one or two owners, enforced by CI

**Status:** accepted · **Recorded:** 2026-08-16

## Context

XUI is moving from one author to a team. It is a public repo, it is now
installable, and the moment a second person can push, "the design system
matches Figma" stops being guaranteed by one person's habits.

teja's requirement was specific: approval sits with **one or two people, not
more**; anyone who wants something asks in Slack or Discord and it becomes a PR;
control stays in one place, the way Intercom runs theirs.

The risk is not carelessness. It is that XUI's correctness lives in things that
are invisible in a diff — a token that is right in Figma, a manifest that must
be regenerated, a line-height that quietly differs by 2px. A reviewer reading a
PR cannot see any of that.

## Decision

**Concentrate approval, and let CI check what review cannot see.**

- **`CODEOWNERS`** with one owner today, room for a second. GitHub requests
  their review automatically on every PR.
- **`CI` workflow** on every PR: typecheck (`tsc -b`, since `tsc --noEmit` is a
  no-op here), lint, token lint, library build, Storybook build.
- **A drift gate**: CI regenerates the rulebook and manifest and fails if they
  differ from what is committed. These are the contract that agents and the
  Figma plugin read — a stale one lies silently, and nobody notices for weeks.
- **A PR template** that asks for the Figma node, forces beyond-design
  decisions to be named, and asks for measured numbers rather than
  impressions.

Branch protection on `main` — require the CI check, require an owner's review —
is a repo setting and must be switched on by hand.

## Alternatives rejected

- **Trust the team, no CI.** Fine while XUI has one author, which is exactly
  the condition ending. Rejected because the failures this project actually
  hit — a 2px line-height, a mangled import string, a `dist` collision, a
  no-op typecheck — were all invisible to review and only caught by running
  something.
- **A review committee.** More eyes, better coverage. Rejected on teja's
  explicit instruction and because it slows the loop that makes a design
  system usable; consistency comes from few reviewers, not many.
- **Require a designer's approval on every visual change.** Tempting given
  Figma is the source of truth. Rejected as unworkable at this size — the PR
  template asking for the Figma node achieves most of it without a bottleneck.
- **Protect `main` without CI.** Review alone cannot see token drift or a stale
  manifest. Protection without a required check is theatre.

## Consequences

- Contributions arrive as PRs from branches; `main` stops taking direct pushes
  once protection is on.
- **CODEOWNERS has no teeth until branch protection is enabled.** On its own it
  requests a reviewer; it does not require one. That setting is the decision,
  the file is only its expression.
- CI runs the full library and Storybook build on every PR, so packaging breaks
  surface on the PR rather than at deploy.
- The drift gate makes `npm run ds:build` a required step when touching tokens
  or component props. That will annoy someone; it is the point.
- Not addressed: **visual** regression. CI proves things build and tokens are
  clean, not that a component still *looks* right. Chromatic would close that
  and plugs into this workflow — worth revisiting when PR volume justifies it.
