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

### Icons

XUI ships **275 icons in four families**. Icons v2 is the primary set and carries
four tones:

```tsx
import { WalletIcon } from '@koinx/xui';
<WalletIcon size={20} variant="dualtone" />  // outlined | solid | dualtone | dualtone-selected
```

Beside it sit the 158-glyph general library, the trade-type set, and the coin
badges — the last being transaction *artwork* with a fixed palette that does not
follow the theme, so they are not general-purpose icons.

**Don't guess a name — search by meaning.** The names come from Figma's layers
and are inconsistent by inheritance, so `ActionsIcon` and `MoreVertIcon` are the
same idea in two families and nobody types either when they want a kebab menu:

```bash
npx xui-find-icon "three dots"     # -> ActionsIcon, MoreVertIcon, MoreHorizIcon
npx xui-find-icon gear             # -> SettingsIcon
npx xui-find-icon "incoming payment"
```

It prints the import line, flags the 13 cases where Figma reuses one name for
different drawings, and is available to agents as the `find_xui_icon` MCP tool.
Browse them all under **Icons Library** in the sidebar.

If it finds nothing, that is a gap in the set worth reporting — not a reason to
hand-write an `<svg>`. Five component stories once did, and in identical 20px
boxes the glyphs painted between 45% and 94% of the box, so the row read as
ragged however precisely it was centred.

React 19+ is a peer dependency — the package never bundles its own copy.

### Where to build

Trying an idea rather than shipping a feature? Build it in the **Console**
(<https://xui-playground.vercel.app>) — the shared prototyping repo, where every demo lives at its own URL and
everyone can see what everyone else is exploring. It consumes this package the
way any consumer does, so whatever works there works in production.

Product screens never belong in the XUI repo itself; it is the design system
only.

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
