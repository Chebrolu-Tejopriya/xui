// The Figma -> XUI mapping, in one place.
//
// Extracted from check-variant-axes.mjs so a second reader - the figma_to_xui
// MCP tool, via gen-figma-map.mjs - uses the SAME map rather than a copy. A copy
// is how .agents/skills drifted; two readers of one source cannot disagree.
//
// Hand-kept on purpose, see MAP below. Edit here; both consumers follow.
/**
 * Which XUI component a Figma set is. Hand-kept on purpose: Figma names are
 * `select_multiple` and `menubar item`, and no rule turns those into `Select`
 * and `Tabs` without someone deciding. `null` means "no XUI component" — a
 * whole component missing, which is a finding of its own.
 */
export const MAP = {
  button: 'Button',
  select: 'Select',
  select_multiple: 'Select',
  // NOT DateInput. Figma's `Select Date` is 44/36 — the SELECT scale — while
  // XUI's DateInput is the Input family at 48/44. A select-shaped date picker
  // is a component XUI does not have; the input-shaped one it does.
  'Select Date': null,
  'Select Date Range': null,
  'Tabs/Default': 'Tabs',
  'Tabs/WithIcons': 'Tabs',
  Tabs: 'Tabs',
  'menubar item': 'Tabs',
  badge: 'Badge',
  input: 'Input',
  Avatar: 'Avatar',
  Switch: 'Switch',
  Checkbox: 'Checkbox',
  Tooltip: 'Tooltip',
  Toast: 'Toast',
  'accordion Item': 'Accordion',
  'Radio Button': 'Radio',
  'breadcrumb item': 'Breadcrumbs',
  Pagination: 'Pagination',
  'Dialog with Icon': 'Dialog',
  'Mobile/Dialog with Icon': 'Dialog',
  'menu item': null,
  Slider: null,
  Day: null,
  'Calendar + Date Picker': null,
  'Calendar + Date Range Picker': null,
  'Line Chart': null,
  'Bar Chart': null,
  Scrollbar: null,
  'State-Numbers': null,
};

/**
 * Axes that are NOT props. A hover or a disabled state is CSS and the DOM, and
 * Figma has to draw it as a variant because a static frame has no other way to
 * show it. Listing them here is what keeps the check from crying wolf on every
 * component in the file.
 */
export const NOT_A_PROP = new Set(['State', 'state', 'Property 1', 'Property 2', 'Style']);

/** Figma axis name -> the prop that implements it. */
export const PROP_FOR = {
  Size: 'size',
  Type: 'variant',
  type: 'variant',
  Variant: 'variant',
  Variants: 'variant',
  Icon: 'icon',
  'Icon on left': 'iconLeft',
  'Icon on right': 'iconRight',
  Selected: 'checked',
  isSelected: 'selected',
  Percentage: 'value',
};

/**
 * Axes we have decided NOT to implement, with the reason. An entry here is a
 * decision on the record; an axis missing from both here and the code is an
 * unanswered question, which is what this gate exists to surface.
 */
/**
 * Figma sets that are NOT part of the system — drawn, but not something XUI is
 * meant to grow. teja's call. They stay out of the backlog the report prints so
 * that list means "still to build" rather than "everything Figma contains".
 *
 * The file half-agrees: Scrollbar sits in a section still called "Section 2",
 * Figma's default name for one nobody titled. Slider has its own named section,
 * so that one is a decision rather than a signal.
 */
export const OUT_OF_SCOPE = {
  Slider: 'Not part of the system.',
  Scrollbar: 'Not part of the system — and it lives in an untitled "Section 2" in the file.',
};

export const ACCEPTED = {
  'Tooltip.Type': 'Figma encodes placement as Type; XUI has `placement` with the same four values plus its own naming.',
  'Checkbox.Property 2': 'Unnamed axis carrying states — checked/disabled are DOM, and Parital-Selected is `indeterminate`.',
  'Input.type': 'XUI splits this axis into SEPARATE COMPONENTS — AmountInput, DateInput, PhoneInput, PasswordInput, SecretInput, Otp, FileUpload — rather than one Input with eleven modes. ADR 0007, composable primitives over configured components.',
  'Switch.Selected': '`checked` is a native input attribute. SwitchProps extends InputHTMLAttributes so it is supported but never DECLARED, and the manifest lists only declared props. See the limit noted below.',
};

/**
 * KNOWN LIMIT: this compares against the manifest, which lists only props a
 * component DECLARES. A component that spreads native attributes — Switch
 * extends InputHTMLAttributes — supports more than the manifest shows, so an
 * axis covered that way reads as missing. Each such case belongs in ACCEPTED
 * with that reason, which is why Switch.Selected is there. Resolving inherited
 * types properly needs the type checker, not the manifest.
 */
