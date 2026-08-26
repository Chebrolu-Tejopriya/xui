## What changed

<!-- One or two sentences. What does this do, and why now? -->

## Design source

<!-- Figma node link, or "n/a — tooling/docs only". -->

- [ ] Values were read from the Figma file, not measured off a screenshot
- [ ] Anything **not** in the design file is called out below and has an ADR

<!-- Beyond-design decisions, if any. Interaction behaviour (triggers,
     dismissal, scroll) is never in Figma — it is always ours to decide, so it
     always belongs here. See docs/decisions/. -->

## Verification

<!-- Numbers, not impressions. What did you actually measure? -->

- [ ] `npm run ds:check` passes
- [ ] `npm run typecheck` passes
- [ ] Parity checked per state, not just the default — see the
      `pixel-parity-verify` skill
- [ ] If it is interactive: behaviour asserted (events received, DOM churn),
      driven by real input rather than `element.click()`

## Screenshots

<!-- Before / after, or the Figma frame beside the render. -->
