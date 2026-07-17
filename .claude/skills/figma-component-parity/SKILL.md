---
name: figma-component-parity
description: Audit or build an XUI component's full state matrix (default/focused/error/disabled/completed, and every type/variant) against its real Figma spec — not just the default state. Use when building a new component or variant from Figma, when a component's stories are being restructured, or when the user reports something looks "different" from Figma and asks for a parity check/audit before fixing.
---

# Figma component parity check

Companion to [[sync-figma-tokens]] — that skill is for token *values*
(colors, spacing, radius). This one is for a component's full *structure and
state matrix*: does every variant, in every state, match Figma exactly —
box model, nested-element behavior, icon assets, and the Storybook wiring
around it.

This skill exists because a real audit skipped this once: the base `Input`
component got a full 5-state Figma audit and came out correct, but the 7
variants built after it (Password, Secret, Date, Dropdown, PhoneInput,
AmountInput, Otp) were only checked against their **default** Figma state.
Assuming they'd inherit correctness from the shared `.field`/`.error`/
`.disabled` CSS classes turned out wrong in several concrete ways — a badge
that didn't mute on disabled, an OTP error ring built per-box instead of as
one shared ring, and a box-sizing bug invisible in any screenshot. All of
that was avoidable by fetching the states up front instead of assuming.

## Procedure

### 1. Fetch every state before writing any code

For the component (and **each** type/variant it has), pull `get_design_context`
for:
- `default`
- `focused`
- `error`
- `disabled`
- `completed` / filled (only if the design shows something beyond "has a
  value" — often it's identical to default and needs no separate code)

Don't stop at default and assume the rest follow from shared CSS classes.
They usually do, but the exceptions are exactly the bugs worth catching —
e.g. Figma's disabled `Amount`/`Mobile Number` also mutes the badge/flag,
not just the outer field, and that's not something you'd guess without
looking. If you don't know the node IDs, run `get_metadata` on the parent
frame first — Figma names them predictably: `Size=default, State=<state>,
type=<type>`.

If the component has N variants, this is N×5 fetches, not N×1. Budget for
it; it's the actual audit, not a nice-to-have.

### 2. Check the box model, not just the screenshot

A screenshot can hide box-sizing/sizing bugs that are only visible via
computed styles. Before declaring a fix correct, inspect it:

```js
getComputedStyle(el).height        // does it match the Figma px value?
getComputedStyle(el).boxSizing     // border-box, or silently content-box?
getComputedStyle(el).color         // exact rgb, comparable to a hex you trust
```

Specifically: **confirm the project has a global `box-sizing: border-box`
reset** (`*, *::before, *::after { box-sizing: border-box; }`) before
building anything that combines an explicit `height`/`width` with a
`border`. Without it, every such element renders `border-width × 2` larger
than its Figma spec, and — worse — any `align-self: stretch` flex child
sized against a `content-box` parent will compute a *wrong* stretched size,
which looks like an unrelated "gap" bug with no obvious cause. If the reset
is missing project-wide, that's the actual fix — not a per-component patch.

### 3. Verify icon colors against the real asset, don't assume a token match

If icons are hand-drawn SVG approximations (common in this codebase — see
`storyIcons.tsx`), their color is whatever you typed, not necessarily what
Figma uses. When color fidelity matters, download the actual asset instead
of guessing which semantic token it "should" be:

```
mcp__figma__download_assets({ nodeId, fileKey, defaultFormat: "svg" })
curl -sL -o icon.svg "<returned url>"
```

Read the `fill`/`stroke` hex directly out of the SVG and match it against
`primitives.css` to find the real token (e.g. `#AEBDD2` → `--gray-08` →
`--content-quaternary` — one step lighter than the *text* next to it, which
correctly uses `--content-tertiary`. Two different tokens on two adjacent
elements is a real pattern in this design system, not a mistake to
"simplify" away.) Delete the downloaded SVG after — it's a verification
artifact, not something to commit.

### 4. One Storybook story file per component, with args-driven Controls

Every component gets its own `*.stories.tsx` with its own
`meta.component` and `argTypes`. Do **not** add a new component's stories
as extra exports inside another component's story file — Storybook's
Controls panel reflects `meta.component`'s props for every story in that
file, so a variant nested under the wrong meta shows the wrong (or empty)
controls regardless of what it actually renders.

Within a file, a story with a custom `render()` that doesn't consume its
`args` parameter will always show inert controls ("Setup controls," no
live binding) for every prop — this is correct Storybook behavior, not a
bug, and is unfixable for a story that intentionally shows multiple
hardcoded examples side by side (a `States`/`Variants` overview story).
`args` describes one instance; it cannot describe five at once. Only the
component's own `Playground` story (args-driven, one instance) needs to
have fully working Controls.

If a prop is `ReactNode`/JSX (an icon slot), Storybook's generic control
can crash when it defaults to `{}` for an unset value — see the Button/
Badge crash fixed earlier in this project. Either disable its control
(`{ control: false }`) if it's just a fixed prop for the story, or if the
user should be able to swap it live, use a `select` + `mapping` control
(string key → real JSX) instead of leaving it uneditable.

### 5. When the user flags something as different, investigate before fixing

Don't guess at what changed. Concretely check:
- `getComputedStyle` on the actual rendered element for size/color claims
- The downloaded Figma asset for icon-color claims
- A live interaction (click the control, screenshot before/after) for
  behavior claims

Report exactly what you found — confirmed bug with root cause, vs. expected
behavior the user was reading as a bug, vs. genuinely uncertain and needs
their input — **before** touching any code. Guessing and silently "fixing"
something that wasn't actually broken erodes trust faster than taking an
extra turn to verify.

## Guardrails

- Don't skip states because the shared-class assumption "probably" holds —
  it held for Dropdown/Password/Secret/Date here, and didn't for Amount/
  PhoneInput/Otp. There's no way to know which without checking.
- Don't add a global CSS reset change without checking what else in the
  codebase might be relying on the old (buggy) `content-box` sizing —
  scan for explicit `height`/`width` + `border` combinations across
  components before landing a box-sizing reset, and spot-check a couple of
  visually-verified components after, not just the one you were fixing.
- Don't invent a "combined" state (e.g. showing an error message next to a
  resend link) without seeing it in Figma first — this project has real
  examples of designs that intentionally combine two pieces of UI in one
  state (OTP's error), and also real examples of a single state simply
  reusing the default's structure unchanged. Only Figma tells you which.
