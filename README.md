# XUI — the KoinX design system

Components, tokens and icons, derived from Figma and verified against it.
38 components, 69 icons, 118 tokens.

## Install

No registry account needed — install straight from GitHub. The package builds
itself on install:

```bash
npm install github:Chebrolu-Tejopriya/xui
```

## Use

Two imports: the components, and the stylesheet (tokens + every component's CSS).

```tsx
import { AppShell, AppShellMain, Sidebar, Button, Badge } from '@koinx/xui';
import '@koinx/xui/styles.css';

<AppShell>
  <Sidebar>…</Sidebar>
  <AppShellMain>
    <Button>Save</Button>
    <Badge variant="label-positive">License</Badge>
  </AppShellMain>
</AppShell>
```

Icons carry four tones:

```tsx
import { WalletIcon } from '@koinx/xui';
<WalletIcon size={20} variant="dualtone" />  // outlined | solid | dualtone | dualtone-selected
```

React 19+ is a peer dependency — the package never bundles its own copy.

## Styling

**Use semantic tokens, never raw colours.** They are what makes dark mode work;
a hex value silently does not follow the theme.

```tsx
// right
<div style={{ background: 'var(--surface-raised)', color: 'var(--content-primary)' }} />
// wrong
<div style={{ background: '#ffffff' }} />
```

Spacing is `--spacing-2 … --spacing-64`, type is `font: var(--type-body-2)`.
Dark mode is `document.documentElement.setAttribute('data-theme', 'dark')`.

## For agents

The package ships a machine-readable contract. It is generated from source, so
it cannot drift:

```js
import manifest from '@koinx/xui/manifest';  // components, props, principles,
                                             // componentRules, antiPatterns
import rulebook from '@koinx/xui/rulebook';  // every token, and hex -> token
```

Point your project's `CLAUDE.md` at `@koinx/xui/manifest` and an agent building
screens will use the right component and the right token instead of guessing.

## Contributing

XUI mirrors Figma. Nothing is invented here: if a value is not in the design
file, it does not go in, and anything beyond the design is recorded as an ADR
under `docs/decisions/` with the alternatives that were rejected.

```bash
npm install
npm run storybook     # every component and state
npm run ds:check      # regenerate the contract, lint the tokens
npm run typecheck     # tsc -b (note: `tsc --noEmit` is a no-op in this repo)
npm run build:lib     # the publishable package
```
