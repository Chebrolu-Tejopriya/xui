# For agents

### For agents

XUI ships an **MCP server**, so the design system is a set of tool calls rather
than a document an agent may or may not open. That is the whole point: a
document can be skipped, summarised or half-remembered. A tool call returns the
same answer every time.

**In the Playground and in this repo, it is already configured** — `.mcp.json`
(Claude Code), `.cursor/mcp.json` (Cursor) and `.codex/config.toml` (Codex) are
committed. The first time, your tool asks whether to allow the `xui` server; say
yes. Nothing else to do. (Codex does not even ask: every tool only reads, so
they are pre-approved.)

**Codex users, one extra step for the hooks.** This repo's hooks — the reminder
to run pixel-parity after editing a component, and the nudge to record a
learning when corrected — run in Codex only after **you** trust them, and the
VS Code panel never asks. Run Codex once in a terminal, in the xui folder; it
shows *Hooks need review* → choose **Trust all and continue**. That is stored in
your own Codex config, so it holds for the VS Code panel too. It asks again
whenever the hooks change, which is the point of the check.

**In your own app**, add it the same way:

```json
{ "mcpServers": { "xui": { "command": "node", "args": ["node_modules/@koinx/xui/mcp/server.mjs"] } } }
```

`node` and a path rather than `npx xui-mcp`: on Windows an editor cannot launch
`npx` without a `cmd /c` wrapper, and this works everywhere unchanged. In
Cursor, write the path as `${workspaceFolder}/node_modules/…`. It has **no
dependencies** and starts in milliseconds.

### The eight tools

| Tool | Arguments | When to call it |
|---|---|---|
| `list_xui_components` | — | **First**, before writing any UI of your own |
| `get_xui_component` | `name` | Before using a component, every time |
| `get_xui_tokens` | `category?`, `hex?` | Instead of choosing a colour |
| `find_xui_icon` | `query`, `limit?` | **Every time** a UI needs an icon |
| `get_xui_status` | `component?` | Before assuming a gap is a bug |
| `get_xui_learnings` | `topic?` | Before building — what previous sessions were corrected on |
| `figma_to_xui` | `name` or `nodeId` | When implementing a Figma design, before choosing a component |
| `get_xui_guidelines` | — | Before composing a whole screen |

**`list_xui_components`** returns every component grouped by family, with its
import line. Most of what you are about to build already exists — the list is
there so you find out before you write it.

**`get_xui_component`** is the one that carries the weight. It returns the
import, every prop with its type *and* its description, and the design rules
governing the component. Those descriptions are not generic:

```
- width: string — Trigger width. Figma's default is 204px.
- check: boolean — Show the check against the selected row. On by default, as Figma draws it.
- isCustomOptionCreationAllowed: boolean — Offer "+ Create New" when the query
  matches nothing exactly, so a value that is not in the list can still be chosen.
```

The rules attached to a component are the ones that are easy to get wrong. For
`Dialog`, for instance, the server will tell you not to colour the icon
yourself — the component colours it from the variant, and passing a
pre-coloured icon is how a destructive dialog ends up with a blue trash can.

**`get_xui_tokens`** answers "which token for this situation", not just "what
tokens exist". Pass a `hex` and it resolves to the token that replaces it. Pass
a `category` (`surface`, `content`, `border`, `spacing`, `radius`, `type`) to
narrow it.

**`find_xui_icon`** searches all 275 icons by MEANING, across four families,
with curated synonyms — so `"three dots"` finds `ActionsIcon` and `"gear"` finds
`SettingsIcon`. Call it rather than guessing a name: the names are Figma's layer
names and are inconsistent by inheritance, and `ActionsIcon` and `MoreVertIcon`
are the same idea in two different families.

If it returns nothing, that is a gap in the icon set to report — **never a
reason to write an `<svg>`**. Five component stories once did, and in identical
20px boxes those glyphs painted between 45% and 94% of the box, so the row read
as ragged however precisely it was centred. The library's own sit at 43–63%
because they came off one grid.

**`get_xui_status`** is what is still moving: questions waiting on a designer,
things Figma draws that were deliberately not built, and decisions taken beyond
what Figma specifies. Filter by component when you are working on one.

Call it before concluding something is broken. Several entries are traps that
look exactly like defects — a Drawer frame named "Left" that is drawn
right-aligned, icon families that bind no variables at all. An open question is
a decision nobody has made yet; surface it rather than guessing an answer.

**`figma_to_xui`** answers "what is this Figma component in XUI?" — the
component, the import, and which Figma variant axis maps to which prop. It is
what Figma Code Connect would put in Dev Mode, and Code Connect is gated to
Organization and Enterprise plans. Ask it by component-set name, and it returns
every set that maps to the same component: Figma splits Tabs across four sets,
and only two of them carry the Size axis.

**`get_xui_learnings`** returns what previous sessions were corrected on — the
same files that ship in `.claude/learnings/`, served to any MCP client so Cursor
and Codex get them too.

**`get_xui_guidelines`** returns the principles, the layout patterns for common
screens (data-table page, form, empty state), and the anti-patterns — the
specific mistakes that break dark mode or drift from Figma.

### What we have already been told

The package carries more than the contract. Installed, it brings the
**learnings** — what previous sessions were corrected on, in git, six short
files:

```
node_modules/@koinx/xui/.claude/learnings/
```

They are the part that is *not* derivable from the code, and they will stop you
repeating arguments already had. `components.md` alone will stop you building a
menu (Select is one) or a styled `<span>` (Badge exists). An `owner-correction`
in there is settled.

Three skills ship alongside them — `find-icon`, `capture-learning` and
`pixel-parity-verify` — the three that make sense in a project *consuming* XUI
rather than building it.

Read them at the start of a session. When you are corrected, add one:
`capture-learning` has the format.

### If you would rather read the contract directly

Both generated files are importable:

```js
import manifest from '@koinx/xui/manifest';  // components, props, rules
import rulebook from '@koinx/xui/rulebook';  // tokens, and hex -> token
```

The MCP server is a thin renderer over `manifest`. Nothing is written twice.

### The one rule worth enforcing in CI

Semantic tokens, never raw colours. The linter that checks it ships with the
package, so it runs against your code too:

```bash
npx xui-lint-tokens src
```

It exits 1 on findings, and `--fix` rewrites the unambiguous ones. See
**Installation** for what it catches.

### Why this cannot drift

`xui.manifest.json` is generated from the source by `scripts/gen-manifest.mjs`
(`npm run ds:build`). CI regenerates it and fails the build if the committed
copy differs, so it cannot fall behind the code. The server reads it at
startup. The answer a tool gives is therefore derived from what ships, not from
prose someone remembered to update.

That distinction is not hypothetical. This very page used to say "all 38
components" — hand-written, and wrong by five for weeks, while the generated
count on the Introduction page was right the whole time.
