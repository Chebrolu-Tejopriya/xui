# Gotchas

Technical traps that cost real time. Mostly CSS and Figma geometry.
Format: see `README.md`.

---

## `inline-flex` is NOT a hug inside a flex parent

> gotcha · 2026-09-04 · claude · confident

**CSS blockifies a flex item's `display`.** An `inline-flex` element that is
itself a flex child computes to `flex` and fills the line. Checkbox, Radio and
Switch each wrap their input in a `<label>` that did this — measured at **968px**
inside a real screen while passing every check in isolation.

Use `width: fit-content`. There is now a behaviour test asserting the label
stays under 300px in a 900px column.

---

## A Figma stroke takes no layout space; a CSS border does

> gotcha · confident

Hit three separate times:

- **Tabs** shipped at 44 where Figma draws 42 — the border was adding height.
  Fixed by shaving the container's vertical padding 4 → 3.
- **The KoinX Books wordmark** declared `viewBox="0 0 147 20"` while the Beta
  pill's geometry already reached x=147.443, and its 0.797 centre stroke painted
  to 147.842. The pill's right edge was sliced flat. Now 148.
- Figma reports a frame as 147 wide because **frame bounds do not count a
  stroke**. Measure the artwork, not the frame.

---

## Measure the ink, not the box

> gotcha · 2026-09-04 · claude · confident

Four icons were all correctly "20px" and the row still read as ragged, because
the painted geometry inside the boxes ranged from 45% to 94% of them.

Generalises: nearly every check here measures a container. When something looks
wrong and the numbers look right, measure the thing *inside* the container.

---

## A story with a play function still renders in the visual suite

> gotcha · confident

A play function runs before the screenshot, so whatever state it leaves is what
gets baselined. Dialog and Drawer use this deliberately — `openOverlay` clicks
Open so the baseline captures the panel rather than a button. Behaviour stories
avoid the problem entirely by being tagged `behaviour` and skipped.

---

## Heredocs in this environment eat backslashes

> gotcha · 2026-09-07 · claude · confident

Writing Python or JS through a shell heredoc mangles escape sequences — `"\n"`
arrives as a real newline and silently corrupts generated source. It has broken
`gen-general-icons.mjs` and `mcp/server.mjs`.

Build the string with `chr(92)`, patch by line index, or write the file with the
editor tool and splice it in. Do not fight the quoting.

---

## `git add -A` nearly committed credentials

> gotcha · confident

`.jetro/daemon/credentials.json` sat untracked in the tree. Always stage
explicit paths. `.jetro/` is gitignored now, but the habit is the protection.
