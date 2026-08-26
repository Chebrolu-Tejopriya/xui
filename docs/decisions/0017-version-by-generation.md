# 0017 — Version by generation, not by change

**Status:** accepted · **Recorded:** 2026-08-16

## Context

With XUI packaged, the question was what its version number means. The default
answer is semver: every change bumps something, breaking changes bump major.

teja rejected that, and the reasoning holds: XUI is consumed by KoinX products
inside one organisation, not by strangers on a registry. A number that moves on
every commit costs a decision each time and communicates nothing to a team who
can read the commit. What *would* be worth signalling is a change of generation
— the way Material has M1/M2/M3 and Blade offers "v10 - Old" and "v12 - Spark"
side by side.

This works here specifically because of how XUI is installed. `npm install
github:…` resolves to whatever `main` points at and records the **commit SHA**
in the consumer's lockfile. Updates already flow from commits, so the version
field is not load-bearing for delivery.

## Decision

**The version is the generation.** XUI is `1.0.0` — generation one. It moves
when the design language does, not when a component does.

**Tags mark points worth returning to**, so consumers can choose their mode:

```bash
npm install github:Chebrolu-Tejopriya/xui          # tracks main
npm install github:Chebrolu-Tejopriya/xui#v1.0.0   # pinned
```

`npm run release` gates (contract, types, lint, library build) then tags. It
never pushes — the push stays deliberate.

**No changelog.** Not now, by teja's call. Commit messages carry the reasoning
and ADRs carry the decisions.

## Alternatives rejected

- **Semver on every change.** The convention, and right for a public registry
  package where consumers are strangers who need a contract. Rejected as
  ceremony here: it asks for a major/minor/patch judgement on every commit and
  tells an internal team nothing they cannot read from the commit itself.
- **No versioning at all.** Closest to what was asked and nearly right, but it
  leaves no way to pin. Two teammates installing a week apart would get
  different code with nothing to name the difference. Tags cost nothing and
  remove that.
- **Generate a changelog from commits.** Cheap and never forgotten. Rejected
  for now — explicitly not wanted, and with ADRs plus descriptive commits it
  would largely duplicate what exists.

## Consequences

- `v1` will stand for a long time. That is the intent, not neglect.
- **Rolling `main` is the default mode, and it has a real cost:** a component
  API change reaches consumers on their next install with no version to warn
  them. Accepted knowingly; tags are the escape hatch for anyone who needs one.
- A future generation is a *parallel* thing, not a replacement — Blade keeps v10
  reachable alongside v12. If XUI ever reaches v2, v1 should stay installable by
  tag and its Storybook stay deployed. Worth remembering before deleting
  anything on that day.
- Nothing here depends on npm. If XUI is published to a registry later, this
  decision needs revisiting, because strangers do need semver.
