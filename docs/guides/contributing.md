# Contributing

### Contributing

XUI mirrors Figma. Nothing is invented here: if a value is not in the design
file, it does not go in, and anything beyond the design is recorded as an ADR
under `docs/decisions/` with the alternatives that were rejected.

```bash
npm install
npm run storybook     # every component and state
npm run ds:check      # regenerate the contract, lint the tokens

# the token linter ships with the package as a bin, so a consuming project
# runs the same rule against its own source:
#   npx xui-lint-tokens src
npm run typecheck     # tsc -b (note: `tsc --noEmit` is a no-op in this repo)
npm run build:lib     # the publishable package
```

Four more gates run in CI, and each exists because something got through the
others:

```bash
npm run check:axes          # a variant axis Figma defines that nothing implements
npm run check:story-icons   # a story hand-drawing an icon instead of importing one
npm run check:coverage      # a component with no story, or a story with no baseline
npm test                    # every story rendered in real Chromium, play functions run
```

The first three ask **completeness**, not fidelity — whether a thing is
connected to anything that checks it. Every other gate here compares what was
built to the frame it was built from, which is how two components shipped
missing an entire size axis with everything green.

`npm test` is the only one that *interacts*. Everything else photographs a
component sitting still, which is why a checkbox whose label swallowed 968px of
a row passed all of them.
