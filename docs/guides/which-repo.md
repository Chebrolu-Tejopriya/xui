# Which repo do I need?

There are two, and picking the wrong one costs an afternoon. The question is not
who you are — it is what you are about to do.

| You want to… | Clone | Deploys to |
|---|---|---|
| **Build a prototype** — a screen, a flow, an idea | **xui-playground** | [the Console](https://xui-playground.vercel.app) |
| **Change the design system** — a component, a token, an icon | **xui** | [xui.koinx.com](https://xui.koinx.com) |

Most people, most of the time, want the first one. **You do not need the design
system repo to build with the design system** — the playground installs XUI the
way any project would.

---

### Building a prototype

**Who.** Anyone — this is deliberately the path that needs no terminal.

**Why.** To try an idea in a real browser with real components, before it is
specified, and to put it somewhere the team can open.

**Steps.**

1. `git clone https://github.com/Chebrolu-Tejopriya/xui-playground.git`
2. Double-click **`start.cmd`** (Windows) or **`start.command`** (macOS). It
   checks Node and Git, asks your name, installs everything, and stops with
   either *Ready* or a numbered list of what it needs from you.
3. Tell your AI assistant what you want to build. It reads the `building-demos`
   skill and knows where the folder goes and which components exist.
4. `npm run dev` → <http://localhost:5174>

Your work lives in `src/demos/<your-name>/<demo-name>/` — your own folder,
nobody else's. Nothing registers it; the console finds it because it is there.

---

### Sharing a prototype

**Where.** <https://xui-playground.vercel.app> — the Console.

**Who sees it.** Everyone with the link. The site lists every demo by every
person, filterable by designer and by mobile/web, each one live rather than a
screenshot.

**How.** Say *"share my work"*, or:

```bash
npm run share
```

It saves your demo, collects everyone else's changes, publishes, and prints the
URL. About a minute later it is live. You do not need to know git — removing
that requirement is the entire point of the command.

It will not publish anything outside `src/demos`, and it will tell you if it has
nothing of yours to send.

### Keeping a prototype to yourself

**Start the folder name with an underscore.**

```
src/demos/rahul/checkout-v3/     shared — everyone sees it
src/demos/rahul/_checkout-v3/    private — only you
```

A `_` folder is gitignored. It renders in your own console, badged **Local
only**, and there is no way to publish it by accident — `share` cannot exclude
it because git never reports it in the first place.

Rename it without the underscore when you want the team to have it.

This matters more than it looks. Somewhere to think without an audience is what
makes the shared space usable: if every rough attempt is public, people stop
making rough attempts.

---

### Changing the design system

**Who.** One or two people. Approval is deliberately concentrated — see
ADR 0018. Anyone can *ask*; the change becomes a PR.

**Why.** A component or token change reaches every product and every prototype
at once. That is the point of a design system and also the risk.

**Steps.**

1. `git clone https://github.com/Chebrolu-Tejopriya/xui.git`
2. Double-click `start.cmd` or `start.command`. It also clones the playground
   next door, because the two are designed to sit side by side.
3. `npm run storybook` → <http://localhost:6006>
4. Open a PR. CI runs typecheck, lint, the token linter, the variant-axis and
   coverage gates, the behaviour tests and visual regression.

Read **Contributing** first, and `.claude/learnings/` before writing anything —
they hold what previous sessions were corrected on.

---

### The trap worth knowing

If you have **both** folders side by side, the playground reads XUI's **source**
directly, so an edit to the design system shows up in your prototype
immediately.

The deployed Console does not. It installs the real published XUI, pinned to a
specific version. So a demo can look right on your laptop and wrong on the
site, with nothing explaining the difference.

If that happens, check `git status` in the xui folder first. And if you did mean
to change XUI: that is a PR on the other repo, not an edit that rides along
inside a prototype.

To move the Console onto the latest XUI deliberately:

```bash
npm run update-xui
```
