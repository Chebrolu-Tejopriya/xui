# Process & scope

How to work here, and what belongs in this repo at all. Format: see `README.md`.

---

## An offer declined by silence is not closed

> owner-correction · 2026-09-12 · teja · confident

I flagged that nothing forces a learning to be written, offered to fix it with a
hook, and teja's next message moved to something else. I treated that as the
matter being dropped and never raised it again — until it surfaced days later in
the Notion doc as an open gap, which is the first they had heard of it since.

*"isn't the issue fixed, why haven't flagged this issue to me"* — fair.

**An offer that gets overtaken is still open.** If a real gap is named and not
explicitly closed, carry it forward and say so, rather than letting the next
topic bury it. Same rule as a half-finished task: scaling work down is teja's
call, and silence is not that call.

## This repo is the design system only

> owner-correction · 2026-09-02 · teja · confident

No product screens, no mobile designs, no desktop layouts. Experiments go in the
sibling **xui-playground**, which already exists for exactly this.

Said twice in one day, because I started writing a screen into `src/App.tsx` and
then again into the system repo. The second time: *"This file should be purely
designed system. We should not add any mobile designs or desktop designs."*

---

## Build only what Figma defines; ask rather than invent

> owner-correction · 2026-07-17 · teja · confident

*"just do what i have defined in figma, don't add anything else"* and, the same
day, *"you have hallucinated more — if you have any doubts ask me, don't over do
things."*

This is the oldest rule in the project and the one most often broken by
enthusiasm. Where Figma is genuinely silent — interaction, dismissal, scroll —
decide, then record it as `beyondFigma` in `scripts/composition-rules.json` so
it is visible rather than smuggled in.

---

## teja barely uses the terminal

> preference · 2026-08-15 · teja · confident

*"i barely use terminal so i don't need this."*

Prefer a script, a workflow button, or a Storybook page over instructions to
type something. When a terminal step is unavoidable, give the exact command,
once, rather than a procedure to follow.

---

## Answer the question asked, at the length asked

> preference · 2026-08-31 · teja · confident

*"are these in the storybook now say yes/no don't overexplain."* Also
*"just analyze it don't build it"* (2026-08-26) and *"just reply don't make any
changes"* (2026-08-28).

When the ask is scoped, honour the scope exactly. A question is not an
invitation to build.

---

## Turn a repeated procedure into a skill

> preference · 2026-07-18 · teja · confident

*"write a skill for this as well so that we can call that skill whenever
needed."* If something has been done twice by hand, it belongs in
`.claude/skills/`.

---

## Deployment: not GitHub Pages, not Chromatic

> decision · 2026-08-27 · teja · confident

*"this is the reason i don't prefer github pages"* (it kept flagging the deploy
as suspicious) and *"we anyway don't use this design system in pages or
chromatic."* The docs are on Vercel.
