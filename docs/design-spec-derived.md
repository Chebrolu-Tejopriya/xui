# Derived design spec — MCP Training page

**Status:** confirmed by teja 2026-08-16 · **Derived:** 2026-08-16
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

## Rulings (teja, 2026-08-16)

| # | Item | Ruling | State |
|---|---|---|---|
| A1 | `Subtitle/2` 14/18 vs 14/20 | Figma wins — XUI was wrong | **fixed** |
| A2 | `Heading/0` | XUI already correct — see correction below | **closed, no change** |
| B1-B5 | Spacing 6/10/20/40, radius 32 | Add them | **done** |
| B6 | Letter-spacing | not yet ruled | open |
| C1 | Collapsed rail | **61px** | already correct |
| C2 | Content gutter | **24px**, as Professionals and Taxes. Books moves to it | feeds `AppShell` |
| D | Foreign text styles | **Do not edit Figma.** Map them in code when generating | mapping below |
| E | Component generations | Tables: **Professionals** standard. Tabs + inputs: **use the existing XUI components**. Icons: **XUI v2** | settled |

### Correction on A2

The spec first reported `Heading/0` as `Regular 36/48` against XUI's `700 40px/48px`
and called XUI wrong on both weight and size. That was a misread: those values came
from two **stale nodes**, not from the library. Re-importing the style by key returns
the published definition:

```
KoinX/Heading/0   in-file: Inter Regular 36/48   PUBLISHED: Inter Bold 40/48
```

`Bold 40/48` is exactly what XUI ships. **XUI was right; the flag was wrong.** Reading
a bound instance is not the same as reading the style — `importStyleByKeyAsync` is, and
it is what settles this class of question.

### A1 impact, measured

`--type-subtitle-2` 14/18 → 14/20, A/B'd by overriding the token at runtime:

| Component | Effect |
|---|---|
| Table, Select, Pagination, FileUpload | nothing moved — fixed heights absorb it |
| Sidebar | 11 text boxes +2px; the 36px item height is unchanged |
| Checkbox, Radio, Switch | 1-2 label boxes +2px |
| Input | 3 elements +1-2px |

No container geometry changed. Sidebar item stays 36px, table row stays 52px.

### D — foreign style mapping, for code generation only

The Figma file keeps these as-is. When generating from a screen that uses one, resolve
it to the KoinX style — and therefore to the XUI token — on this table:

| Foreign style | Definition | KoinX equivalent | XUI token | Exact? |
|---|---|---|---|---|
| `BuyProperly/Heading/5` | Semi Bold 16/22 | `Heading/5` | `--type-heading-5` | yes |
| `BuyProperly/Subtitle/1` | Medium 16/22 ls0.10 | `Subtitle/1` | `--type-subtitle-1` | yes |
| `Text sm/Regular` | Regular 14/20 | `Body/2` | `--type-body-2` | yes |
| `Typography/Subtitle/3` | Medium 12/16 | `Subtitle/3` | `--type-subtitle-3` | yes |
| `Blog/H3` | Semi Bold 24/122% | `Heading/2` | `--type-heading-2` | ~ (29.3 vs 30) |
| `Text xs/Regular` | Regular 12/18 | `Body/3` | `--type-body-3` | no — lh 18→16 |
| `Text xs/Medium` | Medium 12/18 | `Subtitle/3` | `--type-subtitle-3` | no — lh 18→16 |
| `Label` | Medium 16/AUTO | `Subtitle/1` | `--type-subtitle-1` | no — AUTO→22 |
| `Regular` | Regular 16/AUTO | `Body/1` | `--type-body-1` | no — AUTO→24 |

### On the "duplicate" styles (D2, refined)

They are not duplicates in the library — they are **stale local copies** of library
styles. `Subtitle/4` appears as both `11/14` and `11/AUTO`, where published is `11/14`
(XUI is correct). One `Heading/6` copy has a key that no longer resolves — the style it
came from was deleted upstream. Both are file hygiene, not code issues.

## Still open

- **B6 — letter-spacing.** XUI has no letter-spacing at all; three styles carry it:
  `Subtitle/1` +0.10, `Button/1` +0.10, `Label/1` -0.24. Add to those three tokens?
