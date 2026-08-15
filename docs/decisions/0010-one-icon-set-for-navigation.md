# 0010 — One icon set for navigation, tone carries selection

**Status:** accepted · **Recorded:** 2026-08-15

## Context

Building the sidebar meant mapping twelve nav items to icons. Reading the
Figma file rather than guessing turned up three icon sets in one component:

- **`Icons_v2(Tone Variants)`** — the current set, used by five items
- **`Navbar Icons`** — an older set with its own Default/Selected pair, used by six
- **`Iconly/Bulk/Filter`** — a third, legacy, used by one

Two consequences. First, two items (`Integrations` for Data Sources, `Filter`
for Automation) have no Icons v2 equivalent at all. Second, and worse, the two
sets disagree about what selection looks like: the six on `Navbar Icons` swap
their icon to a Selected tone, while the five on Icons v2 stay
`DualTone-Default`. So in the design file today, a selected item's icon is blue
or grey depending only on which icon set it happened to come from.

## Decision

**One icon set — Icons v2 — and the tone carries selection consistently.**

- Not selected → `dualtone` (grey, `content-tertiary`)
- Selected → `dualtone-selected` (brand, `content-brand-primary`)

Applied to every item, alongside the brand label and the 3px brand rail.

The two unmapped icons resolve to their nearest Icons v2 equivalent:

| Nav item | Was | Now |
|---|---|---|
| Data Sources | `Navbar Icons / Integrations` | `WalletIcon` — the Integrations glyph already draws a wallet |
| Automation | `Iconly/Bulk/Filter` | `RulesIcon` — matches the glyph in the mock |

Because the item picks the tone, the API takes the icon **component**, not an
element: `icon={WalletIcon}`, not `icon={<WalletIcon />}`. A caller cannot get
the selected tone wrong.

## Alternatives rejected

- **Mirror the file exactly, inconsistency included.** The strictly faithful
  reading of [0001](0001-figma-is-the-single-source-of-truth.md). Rejected
  because this is not a design decision that happens to look odd — it is two
  icon sets disagreeing, and shipping it would bake a migration artefact into
  the product. Flagged and confirmed with the designer rather than assumed.
- **Add `Integrations` and `Filter` to Icons v2 first.** Most faithful, and the
  right move if either glyph were distinctive. Rejected as blocking: both have
  close equivalents already in the set, and adding near-duplicates makes the
  set harder to choose from.
- **Keep all icons grey, show selection only via background and rail.**
  Rejected — the four-tone model exists precisely so tone can carry state, and
  six of the twelve items already did this.
- **Let the caller pass a coloured element.** Rejected: it makes tone a call-site
  decision, so any missed site is a silent inconsistency. Same reasoning as
  [0007](0007-composable-primitives-over-configured-components.md) — the spec
  belongs inside the component.

## Consequences

- Selection reads identically across all twelve items, in both themes.
- Code no longer references `Navbar Icons` or `Iconly` — one set to maintain.
- The Figma file still holds the inconsistency; the design side should migrate
  those six items onto Icons v2 so the two agree again.
- `icon` taking a component rather than an element is unusual enough to be
  worth the JSDoc note it carries.
