# 0021 — The rules travel with the package, not just the components

Status: accepted

## Context

`npm install @koinx/xui` delivered components, tokens and CSS. It delivered
none of the things that make those components used *correctly*.

The rule that matters most — semantic tokens, never raw colours — was enforced
by `scripts/lint-tokens.mjs`, which sat in this repo and was never listed in
`files`. The contributing guide told consumers to run it as:

```
node ../xui/scripts/lint-tokens.mjs src
```

That works only if the XUI repo is checked out next door. True for the
playground; false for anyone who installs the package. So the one rule you would
most want enforced downstream could not be, and a raw hex in a consuming app —
the same bug as a raw hex here, since it does not follow the theme — was caught
in one place only.

The same gap applied to knowledge. An agent building against XUI has no reason
to open a README it was never pointed at, and a document is easy to skip,
summarise or half-remember.

## Decision

**Whatever the design system knows, it ships.** The package carries four kinds
of thing, not one:

| | what it is | how it is used |
|---|---|---|
| `dist/` | the library | `import { Button } from '@koinx/xui'` |
| `xui-lint-tokens` | a command | `npx xui-lint-tokens src` |
| `xui-mcp` | a background server | an editor launches it |
| `manifest` / `rulebook` | data | `import manifest from '@koinx/xui/manifest'` |

The two programs are `bin` entries, so npm puts them in `node_modules/.bin` and
`npx` finds them from any consuming project.

They do different jobs and both are needed. **The linter enforces** — it exits
non-zero and fails a build. **The MCP server advises** — it answers "which
token", "which component", "what are this component's rules" as tool calls
rather than prose. Neither replaces the other: a tool call can be skipped the
same way a document can, so the server changes reach and freshness, not
compulsion. Only the linter is a gate.

## Alternatives rejected

**Documentation only.** Cheapest, and what we had. It fails on the thing that
matters: a doc has to be *chosen*. It also rots — the For Agents page said "38
components" for weeks while the generated count on the Introduction page said
43. That is not carelessness; it is what hand-written numbers do.

**Publish the linter as a separate package.** Cleaner boundaries, and wrong:
the linter's answers come from `xui.rulebook.json`, so a split introduces a
version skew where the checker and the tokens disagree. They ship together
because they are the same artefact.

**An ESLint plugin instead of a bespoke linter.** The natural home, and it was
considered. Rejected because the rule is not about JavaScript: it needs the hex
to primitive to semantic resolution, per CSS property, out of the rulebook.
That is the whole of the work, and an ESLint wrapper around it is packaging, not
capability. It stays available as a later addition.

**Copy the rules into each consuming repo.** Guarantees drift by construction.

## Consequences

- A consuming project can run the same check CI runs here, with no checkout of
  this repo: `npx xui-lint-tokens src`, exit 1 on findings, `--fix` for the
  unambiguous ones.
- Shipping the linter exposed a real bug that only appears once installed: it
  walked `root/src` to learn which custom properties exist, and `src/` does not
  ship. From a real install it would have crashed on first run. It now falls
  back to `dist/`, whose built CSS carries the same properties — which is also
  exactly what the consumer can reference at runtime.
- Verified the only way that can be verified: pack the tarball, install it into
  a scratch project, run the bin. All four finding kinds fire; `--fix` rewrites
  only the unambiguous ones.
- The package grows two executables and a little surface area. Both are
  dependency-free, and the MCP server's content is generated rather than
  written, so neither carries maintenance.
- The docs now have to say this. **Installation** covers the linter and the
  fonts; **For Agents** covers the server. Prose about *how to use* the tools is
  hand-written and can still rot — but what the tools *say* cannot, because it
  comes from the manifest.
