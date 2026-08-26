# XUI — the KoinX design system

Components, tokens and icons, derived from Figma and verified against it.
38 components, 69 icons, 118 tokens.

## Install

No registry account needed — install straight from GitHub. The package builds
itself on install:

```bash
# tracks main — you get updates as they land
npm install github:Chebrolu-Tejopriya/xui

# pinned to a generation — nothing changes until you move it
npm install github:Chebrolu-Tejopriya/xui#v1.0.0
```

## Versioning

XUI versions by **generation**, not per change — the way Material has M1/M2/M3.
The number moves when the design system does, not when a component does, so
`v1` will stand for a long time.

Day to day, tracking `main` is the intended mode and updates arrive as commits.
Pin to a tag if you need a build that will not move under you.

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

XUI ships an **MCP server**, so the design system is a set of tool calls rather
than a document an agent may or may not open. Point your editor at it:

```json
{ "mcpServers": { "xui": { "command": "npx", "args": ["-y", "xui-mcp"] } } }
```

Four tools:

| Tool | Returns |
|---|---|
| `list_xui_components` | All 38 components and their imports — call before building anything |
| `get_xui_component` | One component: every prop, and its design rules from Figma |
| `get_xui_tokens` | Which token for which situation, and hex → token resolution |
| `get_xui_guidelines` | Principles, layout patterns, and anti-patterns to avoid |

It has **no dependencies** and reads the same generated contract the linter and
the Figma plugin do, so it cannot drift from the code.

The raw contract is also importable if you would rather read it directly:

```js
import manifest from '@koinx/xui/manifest';  // components, props, rules
import rulebook from '@koinx/xui/rulebook';  // tokens, and hex -> token
```

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
