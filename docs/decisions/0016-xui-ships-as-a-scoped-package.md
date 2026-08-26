# 0016 — XUI ships as a scoped package, built from source

**Status:** accepted · **Recorded:** 2026-08-16

## Context

teja asked how the team consumes XUI. The honest answer was that they could
not. The package metadata said so plainly:

```
private:  true                                  ← npm refuses to publish
version:  "0.0.0"                               ← 0 git tags, never released
main / module / types / files:  absent
exports:  { ".": "./src/components/index.ts" }  ← raw TypeScript
no lib build anywhere
```

A teammate could clone the repo and run Storybook, but could not install XUI
into a product: no build output, no type declarations, and an entry pointing at
`.tsx` their bundler may not compile. The `exports` entry was also stale — it
named `src/components/index.ts`, not the `src/index.ts` public entry, so even a
working resolution would have delivered components with no design tokens.

The playground works only because it aliases the *source* on the same machine.
That trick does not survive leaving one Desktop.

`xui` is taken on npm (v1.41.1, unrelated).

## Decision

**Publish `@koinx/xui`: a scoped package containing a built library, installed
from GitHub today and from a registry later.**

- **Build** — `vite.lib.config.ts`, separate from the app config so neither can
  break the other. ESM, one stylesheet (`cssCodeSplit: false`) carrying tokens
  and every component's CSS module. `publicDir: false` so the demo app's
  favicon does not ship.
- **Types** — `tsc -p tsconfig.build.json`, emit-only, stories and the demo app
  excluded.
- **React is a peer dependency**, and external in the bundle. Two copies of
  React breaks hooks.
- **`files: ["dist", "xui.manifest.json", "xui.rulebook.json"]`** — source,
  stories, scripts and the demo app stay out of the tarball.
- **`prepare: npm run build:lib`** so `npm install github:…` builds on install.
  No registry account needed to adopt it.
- **The demo app builds to `dist-app`.** It defaulted to `dist` and would have
  silently overwritten the library output.

The manifest and rulebook are **exported as subpaths** — `@koinx/xui/manifest`,
`@koinx/xui/rulebook`.

## Alternatives rejected

- **Ship source and let consumers compile it.** No build step, always current.
  Rejected: it makes every consumer's bundler responsible for CSS modules and
  TypeScript, so XUI would break differently in each product, and the failures
  would land on the consumer rather than here.
- **Publish unscoped as `xui`.** Taken on npm by an unrelated package.
- **Commit `dist/` to git.** Removes the build step for consumers. Rejected:
  every change produces a large unreviewable diff, and the built output would
  drift from source the first time someone forgets. `prepare` gets the same
  result without the churn.
- **Monorepo with the products.** Genuinely better if XUI and its consumers
  shared a repo. Rejected as far larger than the question asked, and the
  products are separate repos today.

## Consequences

- The team can adopt XUI now: `npm install github:Chebrolu-Tejopriya/xui`.
- **The agent contract travels with the package.** `@koinx/xui/manifest`
  resolves from `node_modules` — verified. This answers the "rules live in MD
  files nothing opens" problem directly: the contract is an import, not a
  document, and a consuming `CLAUDE.md` can name it by package path rather than
  a relative one that breaks on install.
- Verified end to end rather than assumed: packed the tarball, installed it in
  a throwaway project, and confirmed types resolve (`tsc` clean), it bundles,
  `@koinx/xui/manifest` gives 38 components, and it renders with tokens applied.
- The playground keeps aliasing source, deliberately — live HMR against XUI is
  the better loop for design-system work. The package path is for consumers.
- **Still missing: versioning.** Version is `0.1.0` with no tags, no changelog
  and no release process, so `npm update` means nothing yet. That is the next
  step and the prerequisite for the Blade-style version switcher teja asked for.
