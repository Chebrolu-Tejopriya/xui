# 0020 — Visual regression runs in CI, with Linux baselines

Status: accepted

## Context

CI had six gates: typecheck, lint, token lint, derived-artefact freshness,
library build, Storybook build. Every one of them is textual. They prove the
code is well-formed. None of them renders a pixel.

That gap is not theoretical — it is the shape of nearly every bug this repo has
actually shipped:

- `Dialog` rendered with a fully transparent backdrop for weeks, because
  `--overlay-popup: var(--overlay-popup)` is a self-referencing custom property
  that fails silently at computed-value time.
- Icons stopped firing `click`, because `dangerouslySetInnerHTML` is compared
  by reference and the subtree was rebuilt under the pointer mid-gesture.
- The playground built with no design tokens at all, because `sideEffects`
  let Rollup delete a bare CSS import from the entry module.

**All three passed all six gates green.** Each was found by a person opening a
browser and noticing something looked wrong. That does not scale to 30+ story
files, two themes, and a second consuming project, and it does not happen on
every pull request.

A design system whose CI cannot detect a visual change is a design system that
finds out from its consumers.

## Decision

A Playwright suite renders **every story in the Storybook index, in both
light and dark**, and diffs each against a committed baseline PNG. It runs as
its own CI job on every PR.

The story list comes from the build's own `index.json`, never a hand-kept
array — a manual list stops covering things silently, which is the same class
of failure being fixed.

Font rasterisation is OS-specific, so baselines are keyed by platform:

| | Committed | Role |
|---|---|---|
| `*-linux.png` | yes | CI is the source of truth |
| `*-win32.png` / `*-darwin.png` | no, gitignored | per-developer scratch |

A developer on Windows gets local baselines on first run that catch *their*
changes on *their* machine, and those never argue with CI's.

Accepting an intentional visual change is a manual `workflow_dispatch`
("Visual baselines"), which regenerates the Linux set and commits it with a
stated reason.

## Alternatives rejected

**Chromatic.** The industry default, and it solves the OS problem by rendering
on their infrastructure. Rejected because the team evaluated it and found the
workflow too heavy for two people — and because it is a paid SaaS dependency
for a repo that has deliberately kept its MCP server and static file server
dependency-free. Its addon stays installed; only the service is unused.

**Baselines regenerated automatically when they change.** Removes all
maintenance and removes all value: a gate that accepts whatever it is given
is a rubber stamp for the exact regressions it exists to catch.

**Committing both Windows and Linux baselines.** Doubles the PNGs in the repo
and creates a standing question of which set is authoritative when they
disagree. One source of truth, one platform.

**Requiring Docker locally so everyone matches CI.** The cleanest technically —
identical rendering everywhere. Rejected because Docker is not installed on the
team's machines, and mandating it to run a test suite is a real barrier for a
two-person team.

**Testing only a handful of "important" components.** Someone has to keep
deciding what is important, and the bugs above were in `Dialog`, an icon, and
a build config — none of which would have made a shortlist written in advance.

## Consequences

- Every PR gets a pixel diff. A changed colour, a dropped border, a 4px
  spacing shift, or a broken dark mode fails CI instead of shipping.
- **Baselines must be seeded once** via the "Visual baselines" workflow before
  the `visual` job can pass; until then it fails with missing snapshots.
- Intentional design changes now cost one extra step: run the workflow, review
  the committed diff. That step is the point — it is where a change gets seen.
- The repo carries PNGs. They compress well and are small at CSS scale, but
  history will grow faster than it did.
- CI is slower: the `visual` job builds Storybook a second time and installs a
  browser. It runs in parallel with `verify`, so wall-clock cost is bounded by
  the slower of the two, not the sum.
- Comparison runs at **zero pixel tolerance** with a per-pixel `threshold` of
  **0.02**. That number was tightened twice, each time because the previous
  one was caught letting a real change through — which is the honest record of
  how hard this is to set:

  | threshold | what it missed |
  |---|---|
  | 0.2 (default) | Select's border moving one step along the grey ramp — zero pixels |
  | 0.05 | the Input field changing surface in **light** mode |
  | 0 | unusable — AA on one button's circles alone is 28,434 pixels |
  | **0.02** | nothing known; zero false positives across all 154 shots |

  The 0.05 failure is the instructive one. `#f1f5f9` to `#ffffff` is a whole
  surface swap, but their YIQ distance is 0.042, so it counted as zero
  differing pixels in light while dark (0.061) failed. The suite reporting a
  change in one theme and not the other is the only reason it was noticed.
  Adjacent surfaces in this palette sit ~0.04 apart, so **any threshold at or
  above 0.03 is blind to a surface swap** and must not be used.

  `maxDiffPixelRatio` stays 0: a ratio scales with canvas size, so a large
  story gets a proportionally larger licence to change. If CI proves flaky,
  the fix is `maxDiffPixels` (absolute), never a ratio.

- Components that render through a portal — Dialog and Drawer — were invisible
  to this suite for its whole first day. Their stories start closed, and the
  panel attaches to `document.body` rather than inside the story element the
  suite captures, so both conditions had to be fixed at once: a `play` function
  opens them, an `opens-overlay` tag tells the suite to wait for the panel and
  photograph the viewport instead, and a `phone` tag sets a 375x667 page for
  the ones that only make sense at that width (the device picker is a manager
  feature and this spec loads `iframe.html` directly).

  The cost of the gap was three bugs in one day — a collapsed action row, a
  divider one step too light, and a drawer rounding its outer corners — every
  one of them found by a person looking, while the suite reported green. The
  fix is verified the same way the thresholds were: reintroducing the divider
  bug now fails 20 shots at 375 differing pixels.

- `animations: 'disabled'` freezes spinners and transitions at their end state,
  so this suite proves nothing about motion. Motion remains unverified.
