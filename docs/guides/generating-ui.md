# Generating UI

### Generating UI with XUI

An agent asked to "build a settings page" will produce something. Whether it
produces something made *of XUI* depends almost entirely on what it can reach
and what you asked for.

Set up the MCP server first — see **For Agents**. Everything below assumes it.

---

### Ask for the screen, not the components

The instinct is to be helpful by listing parts. It backfires: naming components
skips the step where the agent finds out what exists.

> **Weak.** "Make a div with a header, some inputs and a button."
>
> **Better.** "Build a team-settings page: the user's profile fields, an
> invite-member action, and a table of current members with their roles. Use
> XUI — call `list_xui_components` before writing anything."

The second one produces `Input`, `Button`, `Table`, `Badge` and `EmptyState`
because the agent went and looked. The first produces a `<div>`.

### Say the two things that are not obvious

Almost every bad output traces to one of these:

1. **"Call `list_xui_components` first."** Most of what it is about to build
   already exists. This is the single highest-value sentence in the prompt.
2. **"Use semantic tokens, never raw colours."** Otherwise you get `#ffffff`,
   which looks right until someone turns on dark mode.

A third, if the screen has any overlay or picker: **"Call
`get_xui_component` before using a component."** That is what carries the rules
a prop list cannot — that `Dialog` colours its own icon from the variant, that a
`Drawer` footer is already pinned, that `Select`'s 255px is a flex basis.

### What still goes wrong

These are real, from this repo. Knowing them tells you what to look for in the
output.

| It does this | Because | Prompt with |
|---|---|---|
| Builds a table from `<div>`s | Did not check what exists | "call `list_xui_components` first" |
| Writes `#ffffff` | Colour is the path of least resistance | "semantic tokens only" |
| Invents `--radius-md` | The name is plausible; the scale is `xxs/xs/sm/mid/lg` | run the linter |
| Gives a destructive dialog a blue icon | Passed a pre-coloured icon | "call `get_xui_component` for Dialog" |
| Pastes 1440px column widths | Read a frame literally | "the table must be responsive" |
| Reaches for `Dropdown` in a filter bar | Both pick one of many | point it at **Choosing Components** |

### A prompt that works

```
Build a transactions page with XUI.

- A filter bar: a search field and three filter Selects, then a "More filters"
  action at the end.
- A table below it: date, description, amount, status, and a row of actions.
- An empty state for when the filters match nothing.

Rules:
- Call list_xui_components before writing anything, and get_xui_component
  before using one.
- Semantic tokens only — no raw hex.
- The table must stay usable at 375px, not just 1440.
```

The "rules" block is the part that matters, and it is short enough to keep in a
snippet and paste every time.

### Review what comes back

Prompting improves the odds. It does not guarantee anything, so check:

```bash
npx xui-lint-tokens src   # raw colours, primitives, tokens that do not exist
npx tsc --noEmit          # wrong props, missing required ones
```

The linter is the honest gate here — it does not care how good the prompt was.
Then read the output for the things no tool checks:

- Is it using a component where one exists, or a hand-built lookalike?
- Are widths fixed where they should fill?
- Does it work at 375, or only at the width you looked at?

### The limits worth knowing

**The tools describe; they do not enforce.** An agent can skip a tool call the
same way a person can skip a doc. What the MCP server changes is reach and
freshness, not compulsion — the linter and the type checker are what actually
stop things.

**Nothing here knows your product.** The rules cover which component and which
token. Whether the screen is the right screen is still yours.

**Generated code is a draft.** It is a fast way to a first version made of the
right parts, which is a genuinely different starting point from a fast way to a
first version made of divs. It is not a finished one.
