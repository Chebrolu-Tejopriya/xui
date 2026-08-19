# Derived design spec — MCP Training page

**Status:** awaiting confirmation from teja · **Derived:** 2026-08-16
**Source:** Figma `KoinX-Fidisys-Internal` → page **MCP Training** (`9677:261004`)
**Scope read:** 26,325 frames · 19,532 auto-layout frames · 8,107 text nodes · 3 product sections

Read from the file's **own properties** — auto-layout `itemSpacing`/padding and bound
text styles — not measured off screenshots or inferred from geometry. Where the file
and XUI disagree, the file wins and the delta is listed under
[Conflicts](#conflicts-need-your-ruling).

---

## 1. Typography

Every heading/body/label in the file binds to a `KoinX/*` text style, and those styles
map 1:1 onto XUI's `--type-*` tokens. **18 of 21 match exactly.** The definitions:

| Figma style | Definition | XUI token | Status |
|---|---|---|---|
| `KoinX/Heading/0` | Regular 36/48 | `--type-heading-0` | **differs** |
| `KoinX/Heading/1` | Semi Bold 28/36 | `--type-heading-1` | ok |
| `KoinX/Heading/2` | Semi Bold 24/30 | `--type-heading-2` | ok |
| `KoinX/Heading/3` | Semi Bold 20/26 | `--type-heading-3` | ok |
| `KoinX/Heading/4` | Semi Bold 18/24 | `--type-heading-4` | ok |
| `KoinX/Heading/5` | Semi Bold 16/22 | `--type-heading-5` | ok |
| `KoinX/Heading/6` | Semi Bold 14/20 | `--type-heading-6` | ok |
| `KoinX/Body/1` | Regular 16/24 | `--type-body-1` | ok |
| `KoinX/Body/2` | Regular 14/20 | `--type-body-2` | ok — **most used (1,734)** |
| `KoinX/Body/3` | Regular 12/16 | `--type-body-3` | ok |
| `KoinX/Subtitle/1` | Medium 16/22, ls **+0.10** | `--type-subtitle-1` | **ls missing** |
| `KoinX/Subtitle/2` | Medium 14/**20** | `--type-subtitle-2` | **differs** — 2nd most used (1,458) |
| `KoinX/Subtitle/3` | Medium 12/16 | `--type-subtitle-3` | ok |
| `KoinX/Subtitle/4` | Medium 11/14 | `--type-subtitle-4` | ok |
| `KoinX/Label/1` | Regular 14/20, ls **−0.24** | `--type-label-1` | **ls missing** |
| `KoinX/Label/2` | Regular 12/16 | `--type-label-2` | ok |
| `KoinX/Label/3` | Medium 12/16 | `--type-label-3` | ok |
| `KoinX/Label/4` | Regular 10/12 | `--type-label-4` | ok |
| `KoinX/Button/1` | Medium 16/26, ls **+0.10** | `--type-button-1` | **ls missing** |
| `KoinX/Button/2` | Medium 14/20 | `--type-button-2` | ok |
| `KoinX/Button/3` | Medium 12/16 | `--type-button-3` | ok |

**Family:** Inter throughout. Weights used: Regular (400), Medium (500), Semi Bold (600).
No Bold (700) anywhere in the file.

**1,680 of 8,107 text nodes carry no bound style** (21%). Those resolve to the same
values as the styles above in the overwhelming majority of cases, so they read as
convenience rather than intent.

---

## 2. Spacing

Distribution of auto-layout `itemSpacing` across 19,532 auto-layout frames, ignoring
fractional values (those come from scaled icon instances, not design intent):

| Gap | Uses | XUI token |
|---|---|---|
| 0 | 5,828 | — |
| **6** | **2,736** | **none** |
| **10** | **2,336** | **none** |
| 4 | 1,586 | `--spacing-xxs` |
| 8 | 1,140 | `--spacing-xs` |
| 16 | 755 | `--spacing-mid` |
| 2 | 579 | `--spacing-xxxs` |
| 12 | 418 | `--spacing-sm` |
| **20** | **386** | **none** |
| 24 | 283 | `--spacing-lg` |
| **40** | **226** | **none** |
| 18 | 105 | none |

**Padding** follows the same alphabet — vertical: 16 (3,697), 8 (3,295), 6 (1,017),
2 (958), 12 (951), 10 (333), 4 (275); horizontal: 8 (7,172), 12 (2,518), 16 (1,321),
4 (872), 6 (601), 24 (349), 20 (346).

So the real scale is **2, 4, 6, 8, 10, 12, 16, 20, 24, 40**.

XUI currently ships 2, 4, 8, 12, 16, 24, 32, 64 — it is **missing 6, 10, 20 and 40**,
and ships 32 and 64 which the designs barely use.

---

## 3. Corner radius

| Radius | Uses | XUI token |
|---|---|---|
| 4 | 1,071 | `--radius-xs` |
| 6 | 873 | `--radius-sm` |
| 1000 / 9999 | 439 / 75 | `--radius-max` |
| 8 | 205 | `--radius-mid` |
| 16 | 132 | `--radius-xl` |
| 24 | 107 | `--radius-xxl` |
| **32** | **78** | **none** |
| 3 | 60 | none |

`--radius-lg` (12px) does not appear in the top of the distribution — XUI has it, the
designs do not lean on it.

---

## 4. Page shell

Consistent across all six Professionals screens measured:

```
rail 224  +  gap 24  +  content 1168  =  1416   (1440 viewport, 24 right margin)
```

Books screens put the content wrapper flush against the rail (gap 0, content 1220) and
carry their own inner padding instead. Two Taxes screens use a **collapsed rail of 62px**
— XUI ships 61px.

---

## Conflicts — need your ruling

1. **`Subtitle/2` line-height.** Figma says Medium 14/**20**; XUI ships `500 14px/18px`.
   This is the second most-used style in the file (1,458 nodes) and it is what
   `SidebarItem` renders its labels in, so XUI is currently 2px tight on every nav item.
2. **`Heading/0`.** Figma says **Regular 36/48** (weight 400); XUI ships `700 40px/48px`
   — wrong weight *and* wrong size. Only 2 uses in the file, so low blast radius, but
   XUI is plainly wrong.
3. **Letter-spacing is absent from XUI entirely.** Three styles carry it:
   `Subtitle/1` +0.10, `Button/1` +0.10, `Label/1` −0.24. Add it to those tokens?
4. **Missing spacing tokens: 6, 10, 20, 40.** 6px and 10px are the two most common
   non-zero gaps in the entire file (5,072 uses between them) and have no token, so any
   faithful build has to hard-code them. Add them to the scale? And should 32/64 stay?
5. **Missing radius token: 32px** (78 uses).
6. **Collapsed rail: 61 or 62px?** XUI has 61 (taken from Books); two Taxes screens show 62.
7. **Content width per product.** Professionals is a clean 1168 with a 24px gutter.
   Books runs the content flush to the rail. Is `AppShell` one component with a gutter
   prop, or is Professionals' 24px gutter the house standard everything moves to?

## Contamination worth a cleanup pass (file-side, not code)

- **Foreign text styles**: `BuyProperly/Heading/5`, `BuyProperly/Subtitle/1` (4 nodes),
  `Text sm/Regular`, `Text xs/Regular`, `Text xs/Medium` (31), `Label`, `Regular`,
  `Typography/Subtitle/3` (26). All from other systems.
- **Duplicate KoinX styles**: `Heading/6` exists twice; `Subtitle/4` exists twice
  (11/14 and 11/AUTO).
