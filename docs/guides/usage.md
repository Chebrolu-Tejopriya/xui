# Usage

### Use

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

### Styling

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
