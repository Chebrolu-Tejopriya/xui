---
name: sync-figma-tokens
description: Audit and update XUI design tokens (colors, spacing, radius, border-width, typography, labels) against a Figma Variables screenshot or export the user provides. Use when the user pastes a Figma Variables panel screenshot and asks to add/check/sync tokens, mentions "missing semantics", "check the tokens", or says a token category (Colors, Spacing, BorderRadius, BorderWidth, Typography, Labels) doesn't match Figma.
---

# Sync Figma tokens

Keeps `src/tokens/*.css` and the Storybook foundation stories in
`src/foundations/*.stories.tsx` aligned with the XUI Figma file's Variables
panel. The user is not a developer pasting code — they paste **screenshots**
of the Figma Variables panel (Colors / Tokens / Semantics collections) and
expect the codebase to match exactly what's shown, nothing more.

## Where things live

| Token category | File |
|---|---|
| Primitive colors (Gray/Blue/Orange/Green/Red scales, accents) | `src/tokens/primitives.css` |
| Semantic colors (Surface/Content/Border) | `src/tokens/semantic.css` |
| Spacing, BorderRadius, BorderWidth, Elevation, Scrims | `src/tokens/semantic.css` |
| Typography (Heading/Label/Subtitle/Body/Button) | `src/tokens/typography.css` |
| Label foreground/background pairs (A–Z, 0–9) | `src/tokens/labels.css` |
| Colors foundation story (swatch + mapped var/hex display) | `src/foundations/Colors.stories.tsx` |
| Typography foundation story | `src/foundations/Typography.stories.tsx` |
| Labels foundation story | `src/foundations/Labels.stories.tsx` |

`Colors.stories.tsx` keeps a hand-written `semanticValueMap` (semantic token
→ primitive it resolves to) purely for display — if you add/rename a
semantic token in `semantic.css`, update that map and the `semanticGroups`
list too, or the new token won't render in the Semantic story.

## Procedure

1. **Read the current token file(s) first.** Don't rely on memory of what
   was added in a prior session — the file is the source of truth. Use Read
   on the relevant `src/tokens/*.css` file(s).

2. **Compare literally against what the user shows you.** List, item by
   item: tokens present in Figma but missing from code; tokens present in
   code but *not* in the Figma screenshot; tokens whose value differs.

3. **Never add a token the user hasn't shown you**, even if it seems like a
   natural sibling (e.g. don't invent `content-disabled` just because
   `content-tertiary` exists). If a screenshot seems to be cut off or you're
   inferring a value rather than reading it directly, say so and ask instead
   of guessing. This project's owner has explicitly corrected over-adding
   tokens before — treat "just do what's in Figma, don't add anything else"
   as the standing instruction, not a one-time note.

4. **When a primitive/spacing scale is renamed or restructured** (e.g. the
   `xui-` prefix removal, or replacing an ad-hoc spacing scale with Figma's
   `xxxs..xxl`), grep the whole `src/` tree for the old token names before
   declaring it done — component `.module.css` files and keyframe names
   reference tokens too, not just `semantic.css`:
   ```
   grep -rn "old-token-name" src/
   ```

5. **Update the CSS token file(s)**, keeping the existing grouping/comment
   structure (`/* ---- Surface ---- */` etc.) rather than reflowing the
   whole file.

6. **If component CSS references changed token names**, update those files
   too in the same pass (Button, Switch, Toast, Select, etc. have needed
   this before).

7. **Verify visually.** Make sure Storybook is running (check for a
   background `npm run storybook` task before starting a new one), then
   screenshot the specific story directly via the iframe URL — going
   through the regular Storybook UI URL is unreliable for headless
   screenshots because the sidebar/nav needs extra interaction:
   ```
   http://localhost:6006/iframe.html?id=<story-id>&viewMode=story
   ```
   Story IDs are kebab-case from the title + export name, e.g.
   `foundations-colors--semantic`, `foundations-colors--primitives`,
   `foundations-typography--scale`. Use Bash/Playwright
   (`chromium.launch()` → `page.goto(...)` → `page.waitForTimeout(2000..3000)`
   → `page.screenshot({ fullPage: true })`) — a short fixed wait is more
   reliable here than `waitForLoadState('networkidle')`, which has stalled
   on this Storybook instance before.

8. **Report concisely**: what was added/removed/fixed, file by file. Don't
   restate the full token list back if it's long — a short diff-shaped
   summary is enough.

## Guardrails

- Don't rename or restructure tokens the user didn't ask about, even in the
  same file you're already editing.
- Don't add fallback/alias tokens "for safety" (e.g. a `--radius-md` alias
  of `--radius-mid`) — this codebase had those and they were explicitly
  removed for not existing in Figma.
- If a change would touch component CSS beyond a straight token rename
  (i.e. it changes visual behavior, not just the variable name), flag it
  and ask rather than doing it silently.
