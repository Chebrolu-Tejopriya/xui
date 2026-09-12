# Installation

There are three ways in, and they are for different jobs. Pick the row, not the
page.

| I want to… | Get | Ends up at |
| --- | --- | --- |
| **Build a prototype** — a screen, a flow, an idea | the **Console** (`xui-playground`) | [xui-playground.vercel.app](https://xui-playground.vercel.app) |
| **Change the design system** — a component, token or icon | **XUI** (`xui`) | [xui.koinx.com](https://xui.koinx.com) |
| **Use XUI in my own app** | the npm package | your product |

Most people want the first. **You do not need the design system repo to build
with the design system** — the Console installs XUI the way any project would.

---

## 1 · Build a prototype — the Console

**For:** anyone. Deliberately the path that needs no terminal.

**1. Get it.**

```bash
git clone https://github.com/Chebrolu-Tejopriya/xui-playground.git
```

**2. Double-click one file.** Not a command — double-click.

| your machine | double-click |
| --- | --- |
| Windows | `start.cmd` |
| macOS | `start.command` |

A window opens and does the rest: checks Node and Git, asks your name, installs
everything. It ends with either **Ready** or a short list of what it needs from
you, each with the exact command. Your AI assistant can walk you through it —
just ask it to help you get set up.

**3. Build.** `npm run dev` → <http://localhost:5174>, or tell your assistant
what you want and it will start. Your work goes in
`src/demos/<your-name>/<demo>/` — your own folder, nobody else's. Nothing
registers it; the Console finds it because it is there.

**4. Share it, when you want to.**

```bash
npm run share                # every demo you have changed
npm run share checkout-v3    # only that one
```

It saves your work, collects everyone else's, publishes, and prints the URL.
About a minute later it is live for the team. **You never have to learn git** —
removing that requirement is the whole point of the command.

**Keeping one to yourself:** start the folder name with an underscore.

```
src/demos/you/checkout-v3/     shared when you run share
src/demos/you/_checkout-v3/    private — only ever on your machine
```

A `_` folder is gitignored, shows in your own Console badged **Local only**, and
cannot be published by accident.

---

## 2 · Change the design system — XUI

**For:** one or two people. Approval is deliberately concentrated (ADR 0018) —
anyone can ask, and the change becomes a PR.

```bash
git clone https://github.com/Chebrolu-Tejopriya/xui.git
```

Then the same double-click — `start.cmd` or `start.command`. It sets this repo
up **and clones the Console next door**, because the two are built to sit side
by side: with both present, your prototypes read XUI's source directly and an
edit shows up instantly.

`npm run storybook` → <http://localhost:6006>

Read **Contributing** before opening a PR, and `.claude/learnings/` before
writing anything — they hold what previous sessions were corrected on.

> **The trap.** With both folders side by side, a local XUI edit appears in your
> prototype immediately. The deployed Console does **not** see it — it installs
> the real published XUI. So a demo can look right on your laptop and wrong on
> the site. If that happens, check `git status` in the xui folder first.

---

## 3 · Use XUI in your own app

No registry account needed — install straight from GitHub. The package builds
itself on install:

```bash
# tracks main — you get updates as they land
npm install github:Chebrolu-Tejopriya/xui

# pinned to a generation — nothing changes until you move it
npm install github:Chebrolu-Tejopriya/xui#v1.0.0
```

Two imports, and the second is easy to forget:

```js
import { Button, AppShell } from '@koinx/xui';
import '@koinx/xui/styles.css';
```

Without the stylesheet every token is undefined and nothing is styled.

---

## Fonts

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

## Keep the token rule in your own code

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

## Versioning

XUI versions by **generation**, not per change — the way Material has M1/M2/M3.
The number moves when the design system does, not when a component does, so
`v1` will stand for a long time.

Day to day, tracking `main` is the intended mode and updates arrive as commits.
Pin to a tag if you need a build that will not move under you.

In the Console this is pinned in the lockfile, so a deploy never drifts. Move it
forward deliberately with `npm run update-xui`.
