---
name: onboarding
description: Get a new person — especially a designer who does not use a terminal — from a freshly cloned XUI folder to building screens, without them typing anything. Use when someone says "new machine", "first time", "how do I run this", "setup", "install", "nothing works", "I just cloned this", or when any command fails in a way that suggests the project was never set up. Also use when a designer asks how to start, or does not know what to open.
---

# Onboarding

**Goal: the designer does nothing. You run the script.**

They cloned a folder. That is all you can assume. They may not have Node, may
never have opened a terminal, and should not have to care.

---

## What to do

**1. Tell them to double-click one file.** Not to run a command — to
double-click. That difference is the whole point.

- **Windows** → `start.cmd`
- **macOS** → `start.command`

Say it like this:

> Double-click **start.cmd** in the xui folder. A black window will open and
> run through setup — it takes a few minutes the first time. Come back and say
> **done** when it finishes.

**Do NOT run `node scripts/setup.mjs` yourself in their session instead.** Your
terminal is not theirs: it can time out on a long install, and it will not pick
up the PATH that a fresh Node or Homebrew install writes. The script has to run
in a real window on their machine.

**2. Wait.** When they say done, ask what the last lines said. The script ends
with either `Ready.` or a numbered list of things it could not do.

**3. If it stopped**, it printed the exact command for each problem — usually
Node or Git missing. Give them that one line, ask them to run it in the same
window, and double-click again. Do not improvise a different fix.

**4. When it says Ready**, ask what they want to build and start. The script
already told them the two commands; they do not need to memorise either.

---

## What the script handles, so you do not have to ask

- Node 22+, Git, GitHub CLI, and whether they are signed in
- **Their name and email**, written to git config — this is not cosmetic. It is
  where [[capture-learning]] gets the `who` for anything they teach the agent,
  instead of guessing.
- `npm ci` here, `npm install` in the playground, and the Playwright browser
- Whether **xui-playground** is sitting next to this folder. It has to be:
  its vite config aliases `@koinx/xui` at `../xui/src`, so the two are siblings
  or nothing resolves. If it is missing the script says so and they should ask
  teja for it.
- Prints the MCP config for the XUI server, and how to connect Figma

---

## After setup — point them at the right place

A designer almost never wants the XUI repo itself.

| they want to | send them to |
|---|---|
| build a screen, try an idea | **the Console** — `xui-playground`, `npm run dev` on :5174, deployed at https://xuiground.vercel.app |
| see what components exist | **Storybook** (`npm run storybook`, :6006) |
| find an icon | `npx xui-find-icon "<what you mean>"` |

**Never let them build product screens in this repo.** It is the design system
only — that rule is in `.claude/learnings/process-scope.md` and it is an
owner-correction, given twice.

---

## Read the learnings before you start working with them

`.claude/learnings/` holds what previous sessions were told — corrections,
preferences and traps. A new person will hit the same walls, and the difference
between a good first day and a bad one is whether you already know the answers.

And when they correct *you*, write it down. That is the loop.
