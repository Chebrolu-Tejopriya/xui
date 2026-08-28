# Mobile spec — MCP Mobile Taxes

**Status:** breakpoint settled (ADR 0019); awaiting the section order · **Derived:** 2026-08-16
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

| Element | Size | Detail |
|---|---|---|
| **Menu** (top bar) | 390x48, padding 16 | logo 72x48 left, actions 167x24 right (bell + hamburger) |
| **Bottom Nav** | 393x86 | 54px bar plus a 30px iPhone home indicator — ours is the 54. Items FIXED 74px, SPACE_BETWEEN, padding 12/12/0/12, 24px icon over `Label/4` with 6px between; resting `content-secondary`, selected `content-brand-primary` |
| **Drawer** | 320x876, from the right | 48px header with a Close icon, then the nav list |

`Sidebar` today has expanded (224) and collapsed (61). Mobile is neither: it is
hidden, with its content relocated into the drawer and the bottom bar.

**The drawer is the desktop Sidebar in a different container.** Its items are
36px tall and 8px apart, 288 wide, and the selected one carries the same
`3 x 22.5` tapered brand rail (`Vector 567`) that `SidebarItem` already draws.
Its footer holds the theme switcher and profile, exactly as the rail does.
`SidebarItem` is reusable as-is; only the shell around it is new.

Nav items: Overview, Portfolio, Transactions, Integrations, Taxes, Tax Reports,
Refer & Earn, Settings, Resources.

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
| `AppShell` | **built** — below 900 it becomes a column, hides the rail, and switches the content column to 16px sides / 16px gap |
| `Sidebar` | Third mode — hidden, content served through a drawer |
| `TopBar` | **built** — 48px, 16px sides, brand + actions, hides itself above 900 |
| `BottomNav` | **built** — 58px tab bar, icon tone carries selection, hides itself above 900 |
| `Drawer` | **built** — 320px from the right over an `overlay-popup` scrim; wraps `SidebarItem` unchanged |
| `Table` | The three strategies above |
| `Pagination` | Already has `mobile` and `size="small"` — the one component that anticipated this |
| `Dialog` | **A mobile variant already exists** in the XUI file: `Mobile/Dialog with Icon`, 356x258, padding 24, radius 8, variants Default / Alert / Destructive. A size, not a new component — XUI hard-codes 609/490/471 and needs 356 |
| `Select`, `Input` | Fixed defaults (255/240) now capped by `max-width: 100%`, so they already shrink |

XUI currently has **one media query in the entire system** (Button) and no
breakpoint tokens.

## Open — needed before any code

1. ~~The breakpoint value.~~ **Settled: 900px**, taken from `app.koinx.com`
   where it is used 23 times against one-off values at 450/599/600/980/1024/
   1050/1200/1250. Desktop-first authoring, matching the product. See
   [ADR 0019](decisions/0019-breakpoint-from-production.md). Note it cannot be
   used inside a media query — that fails silently.

2. **Which section first.** 151 screens across 9 sections is not one piece of
   work. Overview and Integrations V2 are the two largest.

## Not open, recorded for later

- Mobile is Taxes-only today. The responsive work lands in XUI (shared), but
  only Taxes composes it. If Books or Professionals ever get mobile, nothing
  here needs redoing.
- The mobile designs include device chrome (a `Browser` frame, iPhone home
  indicator). That is mock furniture, not ours to build.
