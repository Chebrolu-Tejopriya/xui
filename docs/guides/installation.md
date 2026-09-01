# Installation

### Install

No registry account needed — install straight from GitHub. The package builds
itself on install:

```bash
# tracks main — you get updates as they land
npm install github:Chebrolu-Tejopriya/xui

# pinned to a generation — nothing changes until you move it
npm install github:Chebrolu-Tejopriya/xui#v1.0.0
```

### Fonts

XUI sets its type in **Inter**, and `styles.css` fetches it for you — its
first line is:

```css
@import "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
```

So in a normal app there is nothing to do. Three cases where there is:

- **A Content-Security-Policy.** The request needs `fonts.googleapis.com` in
  `style-src` and `fonts.gstatic.com` in `font-src`. Without them the import is
  blocked, no error surfaces, and the whole app silently renders in the fallback
  face.
- **Offline or air-gapped builds.** Same outcome, no network.
- **You already self-host Inter.** The import is then a second, redundant
  download.

In all three, self-host instead: install the font, serve the four weights
(400/500/600/700), and the tokens pick it up — `--font-family-base` already
names `Inter` with a system fallback stack, so no override is needed.

The failure is worth stating plainly because it is quiet: nothing throws, and
the only symptom is that every heading looks slightly wrong.

### Keep the token rule in your own code

A raw hex in your app is the same bug as a raw hex in XUI: it does not follow
the theme. The linter that enforces this ships with the package, so the rule
travels instead of stopping at the library boundary.

```bash
npx xui-lint-tokens src          # report
npx xui-lint-tokens src --fix    # rewrite the unambiguous ones
```

It reports four things: raw hex, raw `rgb()`, a primitive used directly
(`var(--gray-10)` instead of `var(--content-secondary)`), and a `var()` naming
a token that does not exist — which renders unstyled rather than failing.

Only unambiguous replacements are auto-fixed. The same primitive means
different tokens by context, so where the answer depends on judgement it is
suggested and left alone. `xui-lint-ignore` in a comment suppresses a line
and the four after it; always say why.

Exit code is 1 when there are findings, so it works as a CI step.

### Versioning

XUI versions by **generation**, not per change — the way Material has M1/M2/M3.
The number moves when the design system does, not when a component does, so
`v1` will stand for a long time.

Day to day, tracking `main` is the intended mode and updates arrive as commits.
Pin to a tag if you need a build that will not move under you.
