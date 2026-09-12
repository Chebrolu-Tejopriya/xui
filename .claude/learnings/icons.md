# Icons

Four families, collisions, and how to pick. Format: see `README.md`.

---

## Search for an icon; never draw one

> gotcha · 2026-09-07 · claude · confident

`npx xui-find-icon "<what you mean>"`, or the `find_xui_icon` MCP tool. 275
icons, searchable by meaning with synonyms — "gear" finds Settings, "three
dots" finds Actions, "document" finds Reports.

Five component stories once shipped hand-drawn `<svg>`s. Measured in identical
20px boxes they painted between **45% and 94%** of the box — one overflowing it
— so the row read as ragged however precisely the component centred it. A human
caught it by eye after ten automated gates passed. The library's own glyphs sit
at 43–63% because they came off one grid.

`npm run check:story-icons` now rejects an inline `<svg>` in any component
story. If the search finds nothing, that is a gap to report — not licence to
draw.

---

## Icons live in their own sidebar section, not Foundations

> owner-correction · 2026-09-04 · teja · confident

*"for icons icons all the icons have keep seperatly from foundations like in the
2nd image."* Figma's sidebar has an **Icons Library** section; Storybook now
mirrors it: Coin Icons, General Icons, Icons V2, Trade Type Icons.

---

## Do not invent categories for the general icons

> owner-correction · 2026-09-04 · teja · confident

*"for general icons remove the categories because you are not categorizing them
properly."* Correct — the categories were mine, assigned by whichever JSON batch
an icon was read in, so "Arrows & controls" held a calendar, a paperclip and a
copy glyph.

**A wrong taxonomy is worse than none**: it sends you to the wrong shelf and
then convinces you the icon does not exist. The gallery is one flat searchable
list of 158. Coin icons keep theirs — Deposit/Withdraw/Trade are Figma's own.

If real grouping is wanted, it must be named in Figma and generated from there.

---

## Figma reuses one name for different drawings

> gotcha · confident

Two components called `Dust`, a `Lost` beside a `Lost1`, `ArrowForward` in two
families. Code disambiguates with a `General` or numeric suffix, and
`xui.icons.json` flags all 13 collisions — the search prints them so choosing is
a decision rather than an accident.

---

## Icons v2 first, general second, coin badges never as general-purpose

> decision · confident

Coin icons are transaction-type **artwork** with a fixed raw-hex palette that
does not follow the theme. They take `size` and ignore `color`. The search ranks
them last on purpose.
