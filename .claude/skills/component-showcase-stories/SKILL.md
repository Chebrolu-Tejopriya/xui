---
name: component-showcase-stories
description: Structure a component's Storybook stories as the XUI design-system showcase pattern — one left-nav leaf per variant, each rendering ALL states of that variant stacked and labelled on the right, with live args-driven Controls. Use when building or restructuring a component's stories, when the user asks for "all states shown together / at a glance", references the variants-left/states-right layout, or wants stories that serve designers + developers + agents.
---

# Component showcase stories (XUI pattern)

The XUI design system is consumed by designers, developers, AND agents who plug
it in and build UIs in code. Its Storybook is the shared reference, so every
component's stories follow one shape:

- **Left nav:** the component expands into its **variants** — one leaf each
  (Input → Default, Password, Secret Key, Date, Dropdown, Mobile Number,
  Amount, Amount-Static, OTP).
- **Right panel:** selecting a variant shows **every state of it stacked and
  labelled** — Default / Focused / Completed / Error / Disabled — so all
  behavior is visible at once without clicking between stories.
- **Controls:** stay live (args threaded into every state row), with
  descriptions expanded so the panel self-documents the API.

This is the `figma-component-parity` skill's "stories" dimension, made concrete.
Complements [[figma-component-parity]] (state-matrix vs Figma) and
[[sync-figma-tokens]] (tokens).

## The mechanics

### 1. One title per component, one story per variant

Every variant's `*.stories.tsx` uses the **same** `title: 'Components/<Name>'`.
Storybook merges stories from multiple files sharing a title into one nav group,
each keeping its own `meta.component`/`argTypes`. Name each primary story after
the variant (`Password`, `Secret Key`, `Amount-Static`, …) via the export name
or `name:`. Base/default variant → story `Default`.

Result: `Components > Input > [Default, Password, …]` — variant leaves, no extra
nesting. (Confirm with `curl -s localhost:6006/index.json` — each entry's
`title` should be identical and `name` the variant.)

### 2. Each variant story = a labelled state matrix, args threaded

Use the shared `StateShowcase` layout (`src/components/Input/storyLayout.tsx` —
labelled stacked rows). Thread `{...args}` into every row so Controls stay live;
override only the state-specific prop per row:

```tsx
export const Default: Story = {
  render: (args) => (
    <StateShowcase rows={[
      { label: 'Default',   node: <Input {...args} /> },
      { label: 'Focused',   node: <Input {...args} autoFocus /> },
      { label: 'Completed', node: <Input {...args} defaultValue="…" /> },
      { label: 'Error',     node: <Input {...args} error helperText="…" /> },
      { label: 'Disabled',  node: <Input {...args} disabled /> },
    ]} />
  ),
};
```

Enable expanded controls in each meta: `parameters: { controls: { expanded: true } }`.

### 3. The "Focused" row — native autoFocus ONLY

Show the real focus ring with **native `autoFocus`** on the focused row's
instance (`<Input {...args} autoFocus />`). This yields the component's actual
`:focus-within` ring and screenshots cleanly.

**Do NOT force focus programmatically** (a `useEffect(() => el.focus(), [])`
wrapper). It works for real users but **hangs Playwright headless screenshots**
— the capture never stabilises even with `animations:'disabled'`/`caret:'hide'`
/element-screenshot/`preventScroll` (all tried; all still hang). For
button-/grid-based variants that can't take native `autoFocus` (Dropdown, OTP),
**omit the Focused row** rather than fake it — their focus state is a subtle
ring and the matrix reads fine without it (Dropdown: Default/Selected/With
icon/Error/Disabled; OTP: Default/Filled/Error/Expiry/Disabled).

### 4. JSX-slot controls (icons, flags) — select + mapping

For a `ReactNode` prop the user should swap live (currency icon, country flag),
use a `select` control with a `mapping` from string keys → real JSX (see
`AmountInput.stories.tsx`). Store the key in `args` as
`'USD' as unknown as ReactNode`. For fixed JSX props, `{ control: false }`.

### 5. Nav ordering

Order variants (Default first) with `options.storySort` in
`.storybook/preview.tsx`:

```ts
options: { storySort: { order: ['Foundations', 'Components',
  ['Input', ['Default', 'Password', 'Secret Key', 'Date', 'Dropdown',
             'Mobile Number', 'Amount', 'Amount-Static', 'OTP']]] } }
```

**storySort is baked into the preview bundle — a running Storybook won't pick it
up via HMR. Restart Storybook after changing it**, then hard-reload the manager.
Note: in the Storybook 10.5 build in this repo, the nested `order` array did NOT
take effect even after a clean restart (the sidebar fell back to filename-glob
order). Treat ordering as best-effort; verify it actually applies in your SB
version by screenshotting the sidebar, and if it doesn't, don't claim it's
ordered. Filename-prefix ordering is the crude-but-reliable fallback.

## Verify

- `npx tsc -p tsconfig.app.json --noEmit` and `npx oxlint src/components/<Name>`.
- Screenshot each variant's iframe
  (`iframe.html?id=components-<name>--<variant>&viewMode=story`, ~2.5s wait) and
  confirm the labelled state stack.
- If a story's screenshot hangs, it's almost certainly a programmatic-focus
  wrapper (see §3) — the story still renders for users; fix it by switching to
  native autoFocus or dropping the focused row, don't ship the fragile version.
- Screenshot the sidebar to confirm variant leaves + Default-first ordering.

## Guardrails

- Don't give each variant its own sub-group title (`Components/Input/Password`);
  that adds a nesting level the pattern avoids. Same title, story per variant.
- Don't leave a non-args-threaded `render()` as the primary story — its Controls
  go inert ("Setup controls"). Thread args so the panel stays live.
- A `States`/matrix story inherently can't isolate one instance for tweaking;
  that's fine — the threaded Controls affect all rows, which is the intent.
