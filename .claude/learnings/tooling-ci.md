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
