# Components

Which one to reach for, and what not to build. Format: see `README.md`.

---

## Select IS the menu — do not build one

> owner-correction · 2026-09-04 · teja · confident

*"for select we already have a component with left icon right then why are you
flagging it"* — said after I claimed XUI had no menu component and wrote an
85-line local one in the playground.

An action menu is `Select` with `value={null} check={false}
menuWidth="content"`. It takes left and right icons already. The local copy was
deleted.

Before recording anything as missing, search the manifest and ask whether an
existing component covers it in another configuration.

---

## Use our Badge and Chip, not local pills

> owner-correction · 2026-09-04 · teja · confident

*"for badge and chip use whatever we have in our design system, and for drawer
spacing as well use what we have in design system."*

The same instinct as above: when a screen needs a small labelled thing, it is
`Badge variant="accent-primary"`, not a styled `<span>`. This applies to
spacing too — reach for the token, not a number that looks right.

---

## Hover shows a tooltip; click shows the flyout

> owner-correction · 2026-08-16 · teja · confident

*"on hover it is showing overlay instead of tooltip."*

The collapsed Sidebar rail has two overlays and they are mutually exclusive.
Hover → tooltip. Click → flyout, and the tooltip must go. Moving to another
item dismisses a click-opened flyout. There is now a behaviour test for all of
it in `Sidebar.behaviour.stories.tsx`, because a screenshot cannot see this.

---

## Show states together; drop the redundant default

> owner-correction · 2026-08-14 · teja · confident

*"we don't need default thing just the playground with 2 more rows is enough"*
and *"keep the states things just remove the default."*

A story that repeats what the playground already shows is noise. Prefer one
live playground plus an all-states showcase. See the
`component-showcase-stories` skill.

---

## One story with a toggle beats three near-identical ones

> preference · 2026-08-31 · teja · confident

*"add a toggle here to switch for no connection / maintenance / no details so we
don't have to repeat these 3 more times."*

---

## Gradient Isolation was not needed

> owner-correction · 2026-09-07 · teja · confident

A story existed only to prove the `_kxpro` / `_kxtax` gradient-id namespacing
worked. But `Lockups` already renders both wordmarks on one page, so it was the
same proof twice. Removed.

General shape: a story whose only job another story already does is upkeep, not
coverage.
