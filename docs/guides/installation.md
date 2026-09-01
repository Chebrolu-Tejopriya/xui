# Installation

### Install

No registry account needed — install straight from GitHub. The package builds
itself on install:

```bash
# tracks main — you get updates as they land
npm install github:Chebrolu-Tejopriya/xui

# pinned to a generation — nothing changes until you move it
npm install github:Chebrolu-Tejopriya/xui#v1.0.0
```

### Versioning

XUI versions by **generation**, not per change — the way Material has M1/M2/M3.
The number moves when the design system does, not when a component does, so
`v1` will stand for a long time.

Day to day, tracking `main` is the intended mode and updates arrive as commits.
Pin to a tag if you need a build that will not move under you.
