# XUI — the KoinX design system

Components, tokens and icons, derived from Figma and verified against it.
38 components, 69 icons, 118 tokens.

## Docs

Storybook is the reference for every component and state:

**https://xui-five.vercel.app**

```bash
npm run storybook
```

Deployed from `vercel.json` — build `npm run build-storybook`, serve
`storybook-static`. Connect the repo once in the Vercel dashboard; no tokens
and no workflow to maintain. Render takes the same two values.

> Not GitHub Pages: every repo on an account shares one `*.github.io`
> hostname, so one flagged project blocks them all. Chrome Safe Browsing
> blocked ours.

## Guides

Written once in `docs/guides/`, rendered in Storybook under **Guides** so the
docs site and the repo cannot drift apart:

- [Installation](docs/guides/installation.md) — install from GitHub, and how versioning works
- [Usage](docs/guides/usage.md) — the two imports, icons, and the token rules
- [For agents](docs/guides/for-agents.md) — the MCP server and the raw contract
- [Contributing](docs/guides/contributing.md) — what gets in, and the checks
