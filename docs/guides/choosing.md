# Choosing components

### Choosing a component

Several XUI components look alike in a Figma frame while behaving very
differently in a browser. This page is for the moments where two
look like they would both work.

If you are an agent, `get_xui_guidelines` returns the same guidance as a tool
call — both read `choosing` in the generated manifest, so they cannot disagree.

> **These are usage calls, not Figma values.** Figma draws what each component
> looks like; it does not say which to reach for. The distinctions below were
> written here and are open to a designer's correction — unlike the geometry
> and colour rules, which are read from the file.

---

### Picking from a set of options

| Use | When |
|---|---|
| `Switch` | One binary setting where **choosing is doing** — it applies immediately, with no submit step |
| `Checkbox` | Several from a set, or one opt-in that is submitted with the rest of a form |
| `Radio` | Exactly one from a small set where seeing all the options matters |
| `Tabs` | The choice **swaps a panel of content**, not a value |
| `Dropdown` | One value, inside a form |
| `Select` | One value, outside a form — a toolbar, a filter bar, a table control |

**`Switch` vs `Checkbox`** is the question people get wrong most. A switch takes
effect the moment it moves. A checkbox is a value you are collecting, and
nothing happens until the form is submitted. If there is a Save button, it is a
checkbox.

**`Radio` vs `Dropdown`**: a radio group shows every option at once, so it
costs vertical space and buys comparison. Past roughly five options, or when the
options are not worth comparing, use `Dropdown`.

**`Tabs` vs anything else**: `Tabs` does not hold a value your form submits. If
the selection changes *what is displayed below it*, it is Tabs. If it changes
*what will be saved*, it is not. `Tabs` comes in `boxed` and `underline`.

#### `Select` vs `Dropdown`

Both are one-of-many pickers. They are not variants of each other — they are for
different places.

| | `Dropdown` | `Select` |
|---|---|---|
| Belongs in | A form | A toolbar, filter bar, table header |
| Form-field props | `label`, `mandatory`, `helperText`, `helperIcon`, `error` | none of these |
| Search | no | `searchInput`, with `searchPlaceholder`, `onSearchChange`, `clearSearchOnClose` |
| Grouping | flat list | flat **or** `SelectGroup[]`, drawn as heading + rule |
| Nesting | no | one level, via an option's own `options` |
| Create a new value | no | `isCustomOptionCreationAllowed` + `onCreateOption` |
| Clear | no | `isClearable` |

Short version: **if it needs a label and an error state, it is `Dropdown`.** If
it needs search, groups, or a "+ Create New" row, it is `Select`.

In a filter bar, every field fills an equal share of the row and only the
trailing action hugs. Do not give the fields fixed widths — `Select`'s 255px is
a flex *basis*, and a neighbouring field set to `flex: 1 1 0` will collapse to
zero once the row overflows.

---

### Text entry

There is one `Input` and seven specialisations. Reach for the specialisation —
each one carries behaviour you would otherwise rebuild.

| Use | For |
|---|---|
| `Input` | Anything without a dedicated field below |
| `AmountInput` | Money — carries `currencyCode`, `currencyIcon`, and an optional currency picker |
| `DateInput` | A date, with a calendar affordance (`onCalendarClick`) |
| `PhoneInput` | A phone number, with country code and flag |
| `PasswordInput` | A password — masked, **and it offers "Forgot password?"** |
| `SecretInput` | An API key or token — masked, **with a reveal toggle** |
| `Otp` | A fixed-length code, with expiry and resend built in |
| `FileUpload` | Files — `default` or `compact`, single or `multiple` |

**`PasswordInput` vs `SecretInput`** both mask their contents, and that is the
only thing they share. A password is something the user knows and might have
forgotten, so the field offers recovery. A secret is something the system
issued and the user needs to read back, so the field offers a reveal. Picking
the wrong one gives an API-key field a "Forgot password?" link.

Every field in this family takes `label`, `mandatory`, `helperText`,
`helperIcon` and `error`, so they line up in a form without extra work.

Sizes: `size="medium"` is 48px and the default; `size="small"` is 44px and what
a filter bar uses, so the field sits level with the Selects beside it.

---

### Interrupting the user

Ordered by how much they interrupt:

| Use | Interrupts | For |
|---|---|---|
| `Tooltip` | not at all | A short label on hover. **Nothing interactive inside it** |
| `Toast` | not at all | Something already happened — `default`, `success`, `warning`, `error` |
| `Accordion` | not at all | Detail that stays on the page, collapsed until wanted |
| `Dialog` | blocks | A **decision** that must be made before continuing |
| `Drawer` | blocks | A **task** with more content than a dialog should hold |

**`Toast` vs `Dialog`**: a toast reports; a dialog asks. If the user has no
choice to make, do not block them. `Toast` takes an optional single action
(`actionLabel` / `onAction`) — that is for undo, not for a decision.

#### `Dialog` vs `Drawer`

The honest rule is **length, not importance**.

Use `Dialog` when the whole thing fits without scrolling: a confirmation, a
short form, a warning. It centres, and its two actions each take half the row.
Its variants carry meaning — `default`, `alert` and `destructive` each set the
icon and its colour, and `destructive` puts the confirm button first. Do not
colour the icon yourself; passing a pre-coloured one is how a destructive
dialog ends up with a blue trash can.

Use `Drawer` when the content is long enough to scroll, or when the user needs
to keep the page behind it in mind. Its `footer` is already pinned outside the
scrolling body, so there is no separate "fixed bottom" mode to look for.

On mobile, `placement="bottom"` is the idiom for both — a bottom sheet hugs its
content up to 90vh. `right` is the desktop idiom.

---

### Navigation

| Use | Scope |
|---|---|
| `Sidebar` | Primary navigation, desktop. Composes from `SidebarHeader` / `SidebarNav` / `SidebarItem` / `SidebarSubItem` / `SidebarFooter` |
| `BottomNav` | Primary navigation, mobile — the same destinations as the sidebar |
| `TopBar` | Page chrome: title and page-level `actions` |
| `Breadcrumbs` | Where this page sits in a hierarchy |
| `Tabs` | Sibling views **within one page** |
| `Pagination` | Moving through rows, with `rowsPerPage` and a `mobile` form |

`Sidebar` and `Tabs` are not alternatives. The sidebar moves you between
sections of the product; tabs move you between views of the thing you are
already looking at.

---

### Showing state

| Use | For |
|---|---|
| `Badge` | A standing label on a thing — status, category, count |
| `PriorityMeter` | A level rather than a word, in a table column |
| `Toast` | A transient event |
| `EmptyState` | There is nothing to show |

`Badge` has sixteen variants in two families: use `label-*` for status and
category pills, and `accent-*` for softer inline tags.

`EmptyState` centres inside whatever box it is given, so the same component
serves a full-page 404 and an empty table cell. Only `title` is required, and
an omitted part is dropped from the DOM rather than rendered empty. Use the
shipped illustrations (`MaintenanceIllustration`, `ErrorIllustration`,
`NoDataIllustration`) — their paints are bound to the blue ramp and follow the
theme. A hand-pasted Figma SVG export will not: it arrives with a white card
baked in and turns into a bright disc on a dark page.

---

### Before you build something new

Check the list first. The most common mistake in a design system is not picking
the wrong component — it is not knowing a component existed and building a
worse one beside it.

Building a table out of `div`s when `Table` / `TableRow` / `TableCell` already
encode the spec is the specific case that keeps happening. `Table` gives you
52px rows, the correct hover and selected states (they are different, and
selected wins), inset-shadow dividers that do not change row height, and three
column modes. A hand-built one gives you none of that and drifts from Figma the
first time anyone touches it.

Agents: call `list_xui_components` before writing any UI.
