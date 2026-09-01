# FAQ

### FAQ and troubleshooting

Every entry here is something that has actually gone wrong, in this repo or in a
project consuming it. They share a shape: **nothing throws.** The build passes,
the console is clean, and the page is quietly wrong.

---

#### Nothing is styled — no colours, no spacing, plain HTML

The stylesheet is a separate import and carries the tokens as well as every
component's CSS:

```tsx
import '@koinx/xui/styles.css';
```

If it *is* imported and you still get nothing, your bundler dropped it. A bare
CSS import from an entry module looks like dead code to a tree-shaker unless
the package marks it as a side effect. XUI does (`sideEffects` in
`package.json`), but a re-export layer of your own may not — check that your own
package marks `**/*.css` too.

#### Dark mode changes some things and not others

The parts that do not change are hardcoded colours. A hex does not follow the
theme; a token does. Find them all at once:

```bash
npx xui-lint-tokens src
```

Dark mode itself is one attribute — there is no provider to wrap:

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

#### One CSS declaration does nothing at all, with no error

You have almost certainly named a token that does not exist. `var(--nope)`
resolves to nothing, the whole declaration is dropped, and CSS reports nothing.

The classic is `--radius-md`. There is no `md` in the radius scale — it runs
`none, xxs, xs, sm, mid, lg, xl, xxl, xxxl, max`. That one typo shipped in three
components and gave Tooltip and Dialog square corners. The linter reports it as
`UNDEFINED token`.

#### Text renders in the wrong font

`styles.css` imports Inter from Google Fonts on its first line. Under a
Content-Security-Policy, offline, or behind a proxy, that request fails
silently and the whole app falls back. See **Installation → Fonts** for
self-hosting.

#### My component is 2px taller than the Figma frame says

A stroke in Figma takes no layout space. A CSS border does. If you add a 1px
border to a fixed-height element, shave 1px off the vertical padding or the box
grows by 2.

This is the single most repeated correction in this codebase.

#### A field in my filter bar collapsed to zero width

Flex shrink is distributed in proportion to basis, so a field set to
`flex: 1 1 0` sitting beside Selects basing from 255px gets crushed to nothing
the moment the row overflows. Give every field in the row the **same** basis.

`Select`'s 255px is a basis, not a fixed width — a row of them shrinks to equal
shares on its own.

#### My table is not responsive — columns overflow and get clipped

Fixed widths pasted from a Figma frame cannot shrink. Use `width={n} fill` for
text columns: it starts at `n` and shares spare space in proportion. Reserve
fixed widths for content that cannot reflow — a checkbox (40), a priority meter
(80), a row of action icons.

Omitting the width entirely is not the fix either: that gives every column an
equal share, so a long value wraps and the row grows past its 52px.

#### The row hover colour is being used for the selected row

They are different states. Hover is `surface-secondary`; selected is
`surface-brand-secondary`. Selected wins when both apply.

#### My screenshot test photographs a button instead of the dialog

`Dialog` and `Drawer` render through a portal into `document.body`, so the panel
is not inside the story element a test captures — and the story starts closed
anyway. Both have to be fixed together: open it in a `play` function, and
capture the viewport rather than the element. In this repo that is the
`opens-overlay` tag.

This blind spot cost three shipped bugs in one day while CI reported green.

#### TypeScript cannot find a type I can clearly see in the source

It is probably not exported from the package entry. Being defined in a component
file is not enough. `EmptyStateClassNames` shipped that way; the
`check:consumer` gate now compiles a fake consumer against `dist/types` on every
CI run to catch it.

---

### Questions about the system itself

#### Can I add my own theme or brand colour?

No, and that is deliberate. XUI is single-brand — see
[ADR 0014](https://github.com/Chebrolu-Tejopriya/xui/blob/main/docs/decisions/0014-xui-stays-single-brand.md).
A brand axis was built and then reversed: the grey ramp is cool, and a warm
brand hue does not sit on it without reworking every surface.

#### Which React version?

React 19+, as a peer dependency. The package never bundles its own copy.

#### How do I get updates? What does the version number mean?

Tracking `main` is the intended mode; updates arrive as commits. The version
number moves by **generation**, not per change — the way Material has M1/M2/M3
— so `v1` will stand for a long time. Pin to a tag if you need a build that
will not move under you. See
[ADR 0017](https://github.com/Chebrolu-Tejopriya/xui/blob/main/docs/decisions/0017-version-by-generation.md).

#### Where does the responsive breakpoint sit?

900px, taken from production rather than chosen —
[ADR 0019](https://github.com/Chebrolu-Tejopriya/xui/blob/main/docs/decisions/0019-breakpoint-from-production.md).

#### Why is Secondary orange rather than grey?

Intentional. In XUI the secondary button family is the warning/orange one.

#### Something in the docs disagrees with the code. Which is right?

The code. Anything derived — the component list, props, tokens, the MCP
server's answers — is generated from source and checked in CI. Prose is
hand-written and can rot; if you find a disagreement, the prose is the bug.

#### How do I report something or ask for a component?

Open an issue. If it is a design question — a spacing that looks off, a missing
state — it likely needs a designer's call before it can be built, since nothing
goes in that is not in Figma
([ADR 0001](https://github.com/Chebrolu-Tejopriya/xui/blob/main/docs/decisions/0001-figma-is-the-single-source-of-truth.md)).
