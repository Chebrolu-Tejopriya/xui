# 0019 — The breakpoint is 900px, taken from production

**Status:** accepted · **Recorded:** 2026-08-16

## Context

The mobile designs ([design-spec-mobile.md](../design-spec-mobile.md)) need a
breakpoint, and XUI had none — one media query in the whole system and no token.
teja's ruling was two tiers only, **mobile and web**, no tablet.

The Figma file cannot answer this. It holds two *design widths*, 390 and 1440,
and says nothing about where one layout becomes the other. Every other value in
XUI is read from the design file; this one had to come from somewhere else, and
the honest options were a convention (768px, because Bootstrap and Tailwind say
so) or the product itself.

## Decision

**`--breakpoint-web: 900px`, taken from `app.koinx.com`.**

Its three stylesheets (238KB) were fetched and every media query counted:

| Value | Occurrences |
|---|---|
| **900px** | **23** (max-width x18, min-width x5) |
| 1200px | 2 |
| 1250 / 1050 / 1024 / 980 / 600 / 599 / 450 / 400 | 1 each |

900px is the product's real breakpoint. The rest are one-offs — nine different
values doing roughly the same job, each presumably added to fix one screen. That
scatter is the argument for the token, not against the number.

900 also sits sensibly between the two design widths: under it you get the 390
layout, at or above it the 1440 one.

**Media queries must write `900px` literally.** A custom property cannot be used
in a media condition. Verified rather than assumed:

```
viewport 800px, breakpoint 900px
  @media (max-width: 900px)      -> APPLIED
  @media (max-width: var(--bp))  -> NOT APPLIED, and no error is raised
```

It fails **silently** — the rule is dropped and the layout is simply wrong. The
token is for JS (`matchMedia`) and for holding the value in one readable place;
the warning lives in `semantic.css` beside it, where someone will actually hit it.

**The product authors desktop-first** (`max-width: 900px` 18 times against
`min-width` 5), so XUI should too. Base styles are the web layout; mobile is the
override. Not because it is better — mobile-first is the more common modern
advice — but because a developer moving between XUI and the product should not
have to switch mental models.

## Alternatives rejected

- **768px, the convention.** What I would have picked without looking. Rejected
  because the product disagrees, and matching a framework default over your own
  running code is exactly the kind of plausible-but-wrong choice this project
  keeps catching.
- **Adopt all nine values as a scale.** Faithful to what exists. Rejected: they
  are drift, not design. Encoding them would make the accident permanent.
- **Mobile-first (`min-width`) authoring.** Better practice in the abstract.
  Rejected for consistency with the product, which is the stronger practical
  concern at two tiers.
- **Wait for a designer to specify it.** Correct in principle, and it is not in
  the file. Rejected as blocking: the product already answers it, and the answer
  is checkable.

## Consequences

- The mobile work is unblocked; `AppShell`, `Sidebar`, `Table` and the three new
  components now have a boundary to respond to.
- **Provenance differs from every other token in XUI.** Everything else is read
  from Figma; this is read from production. If the design file ever gains a
  breakpoint variable, it supersedes this and this ADR should be revisited.
- The `900px` literal will appear in media queries across components. That
  duplication is unavoidable in plain CSS. If it becomes a problem, PostCSS
  `@custom-media` is the fix, at the cost of a build-time dependency.
- Only the pre-auth bundle was readable — `/overview` redirects to
  `/get-started`. If the authenticated app lazy-loads further CSS, there may be
  breakpoints not counted here. 900 dominated 232KB of bundle, so this is
  unlikely to change, but it is not a complete census.
