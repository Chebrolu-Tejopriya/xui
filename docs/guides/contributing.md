# Contributing

### Contributing

XUI mirrors Figma. Nothing is invented here: if a value is not in the design
file, it does not go in, and anything beyond the design is recorded as an ADR
under `docs/decisions/` with the alternatives that were rejected.

```bash
npm install
npm run storybook     # every component and state
npm run ds:check      # regenerate the contract, lint the tokens

# the token linter also runs against a consuming project, so the same rule
# is enforced there rather than only here:
#   node ../xui/scripts/lint-tokens.mjs src
npm run typecheck     # tsc -b (note: `tsc --noEmit` is a no-op in this repo)
npm run build:lib     # the publishable package
```
