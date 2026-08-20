# Decision log

Short records of the decisions behind this workflow — kept in the repo so they
are versioned with the code they describe, and reviewable in the PR that makes
the change.

The narrative write-up (Notion) links here. It does not copy these: a copy of a
decision rots the moment the decision changes.

## Format

Each record is one file, `NNNN-kebab-title.md`, with four parts:

- **Context** — the situation that forced a choice. What hurt.
- **Decision** — what we chose, stated plainly.
- **Alternatives rejected** — what else was on the table and why it lost. This
  is the part that is worth the most later; without it a future reader re-opens
  a settled question.
- **Consequences** — what this costs us, not just what it buys.

Keep them short. A record nobody reads is worth nothing; one page is plenty.

## Writing a new one

Add one when a choice would be expensive to reverse, is non-obvious, or was
argued about. Routine choices ("use kebab-case") do not need a record — the
code shows them.

Status values: `accepted`, `superseded by NNNN`, `deprecated`.

## Index

| # | Decision | Status |
|---|---|---|
| [0001](0001-figma-is-the-single-source-of-truth.md) | Figma is the single source of truth | accepted |
| [0002](0002-derive-artefacts-never-hand-maintain.md) | Derive artefacts from source, never hand-maintain | accepted |
| [0003](0003-skills-encode-repeatable-process.md) | Skills encode repeatable process | accepted |
| [0004](0004-parity-gates-assert-numbers-first.md) | Parity gates assert numbers before screenshots | accepted |
| [0005](0005-semantic-tokens-only-in-product-code.md) | Product code uses semantic tokens only | accepted |
| [0006](0006-read-design-bindings-dont-propose-tokens.md) | Read design bindings rather than proposing tokens | accepted |
| [0007](0007-composable-primitives-over-configured-components.md) | Composable primitives over configured components | accepted |
| [0008](0008-theming-lives-in-the-generator.md) | Theming lives in the generator, extracted data stays faithful | accepted |
| [0009](0009-repo-owns-reference-notion-owns-narrative.md) | Repo owns reference, Notion owns narrative | accepted |
| [0010](0010-one-icon-set-for-navigation.md) | One icon set for navigation, tone carries selection | accepted |
| [0011](0011-icon-markup-is-hoisted-per-shape.md) | Icon markup is hoisted per shape, not rebuilt per render | accepted |
| [0012](0012-collapsed-sidebar-overlay-model.md) | Collapsed sidebar: hover names, click opens, never both | accepted |
| [0013](0013-brand-is-a-runtime-axis.md) | Brand is a runtime axis, not a fork | superseded by 0014 |
| [0014](0014-xui-stays-single-brand.md) | XUI stays single-brand — cool greys constrain the hue | accepted |
| [0015](0015-appshell-flexes-rail-fixed.md) | AppShell flexes; the rail is fixed and the content scrolls | accepted |
