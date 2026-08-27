# Mobile spec — MCP Mobile Taxes

**Status:** awaiting teja's ruling on the two open items · **Derived:** 2026-08-16
**Source:** Figma `KoinX-Fidisys-Internal` → page **MCP Mobile Taxes** (`9838:39590`)
**Scope read:** 151 screens at 390px across 9 sections · 31,977 nodes

Read from the file's own properties, as with the desktop spec. Mobile is
**Taxes only** — Books and Professionals have no mobile designs — and there are
**exactly two breakpoints, mobile and web**. No tablet, no desktop tier.

---

## 1. The foundations already cover mobile

This is the most important finding, and it means the work is layout, not tokens.

**Type:** mobile uses the same `KoinX/*` styles as desktop, in different
proportions — `Subtitle/2` ×580, `Body/3` ×405, `Subtitle/3` ×405,
`Subtitle/1` ×377, `Body/2` ×358, then Heading 3–6. **No new type tokens.**

**Spacing:** every gap mobile uses is already in the scale —
8 (×572), 4 (×375), 10 (×312), 6 (×259), 16 (×237), 12 (×194), 2 (×191),
24 (×87), 20 (×51). Note 6 and 10 are the steps added on 2026-08-16 for the
desktop spec; mobile leans on them harder than desktop does. **No new spacing
tokens.**

## 2. The shell is a different composition, not a narrower one

```
web      [rail 224][gap 24][ content 1168 ][24]

mobile   [ Menu (top bar)            390x48, padding 16 ]
         [ content                   358, padding 16, V gap 16 ]
         [ Bottom Nav                390x88 ]
         + drawer: "Web / Navigation / Sidebar" 358x192, padding 16/24
```

The 224px rail does not shrink — it **disappears**. Navigation becomes three
separate things:

| Element | Size | Role |
|---|---|---|
| **Menu** | 390×48, 16px sides | logo left, bell + hamburger right |
| **Bottom Nav** | 390×88 | primary tab navigation |
| **Drawer** | 358×192, close icon | opened from the hamburger |

`Sidebar` today has expanded (224) and collapsed (61). Mobile is neither: it is
hidden, with its content relocated into a drawer and a bottom bar.

## 3. Table — three strategies, chosen per table

teja's ruling: it depends on the content. All three are needed.

| Strategy | When | XUI work |
|---|---|---|
| **Hide columns** | Most tables — mobile screens show ~3 of 10 columns | New per-cell API to mark a column mobile-visible |
| **Horizontal scroll** | Wide tables where every column matters | Container mode; the cells stay as they are |
| **Row → card** | Dense rows, as on the Integrations page | A different render, not a variant of the current one |

The third is the expensive one: it is not a prop on `TableRow`, it is a second
way of rendering the same data.

## 4. Component work

| Component | Change |
|---|---|
| `AppShell` | Mobile mode: no rail, top bar + bottom nav, content 358 with 16px padding |
| `Sidebar` | Third mode — hidden, content served through a drawer |
| **new** `TopBar` | 48px, logo / actions. Does not exist |
| **new** `BottomNav` | 88px tab bar. Does not exist |
| **new** `Drawer` | Overlay panel with close. `Dialog` is modal-centred, not a side panel |
| `Table` | The three strategies above |
| `Pagination` | Already has `mobile` and `size="small"` — the one component that anticipated this |
| `Dialog` | Check whether mobile wants a bottom sheet; the designs show a centred modal, so possibly nothing |
| `Select`, `Input` | Fixed defaults (255/240) now capped by `max-width: 100%`, so they already shrink |

XUI currently has **one media query in the entire system** (Button) and no
breakpoint tokens.

## Open — needed before any code

1. **The breakpoint value.** Two tiers named "mobile" and "web", but the file
   only gives the two design widths, 390 and 1440. The switch point between
   them is not in the design and is therefore ours to choose and flag. A
   `--breakpoint-web` token has to be defined before anything can respond to it.
2. **Which section first.** 151 screens across 9 sections is not one piece of
   work. Overview and Integrations V2 are the two largest.

## Not open, recorded for later

- Mobile is Taxes-only today. The responsive work lands in XUI (shared), but
  only Taxes composes it. If Books or Professionals ever get mobile, nothing
  here needs redoing.
- The mobile designs include device chrome (a `Browser` frame, iPhone home
  indicator). That is mock furniture, not ours to build.
