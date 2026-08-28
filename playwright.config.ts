import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression for XUI.
 *
 * The other six CI gates are all textual — they prove the code is well-formed,
 * not that it still looks right. Every visual bug this repo has had (a Dialog
 * with a transparent backdrop, icons vanishing mid-click, tokens tree-shaken
 * out of a build) passed all of them green. This suite is the gate that would
 * have caught them: it renders every Storybook story in light and dark and
 * diffs the pixels against a committed baseline.
 *
 * ---- Where baselines come from -------------------------------------------
 *
 * Font rasterisation differs between operating systems, so a PNG made on
 * Windows will never match one made on Linux. `{platform}` is therefore part
 * of the snapshot path, and the two sets are treated differently:
 *
 *   *-linux.png    committed. CI (ubuntu) is the source of truth.
 *   *-win32.png    gitignored. Generated on first local run; catches the
 *                  changes YOU make, on your machine, before you push.
 *
 * So `npm run test:visual` is useful locally without local baselines ever
 * arguing with CI's. To accept an intentional visual change, run the
 * "Visual baselines" workflow — it regenerates the Linux set and commits it.
 */
const PORT = 6008;

export default defineConfig({
  testDir: './visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{platform}{ext}',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry absorbs a genuinely flaky paint; a real diff fails twice.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  expect: {
    toHaveScreenshot: {
      // These two numbers were set by experiment, not by taste. With the
      // defaults, a real regression — Select's border swapped from
      // --border-primary (#cbd5e1) to --border-secondary (#dbe2ec) — passed
      // the suite silently. Both knobs had to be tightened before the gate
      // had any teeth:
      //
      //   threshold (per-pixel colour distance, YIQ). Default 0.2 is wide
      //   enough to swallow one step on the grey ramp, so that border change
      //   registered as ZERO differing pixels. At 0.05 it reads as 554.
      //
      //   maxDiffPixelRatio. That same 554px change is ratio 0.01 — exactly
      //   the 1% that "tolerates anti-aliasing" would have allowed. A ratio
      //   is the wrong unit anyway: it scales with canvas size, so a large
      //   story (the icon gallery) gets a proportionally huge budget and can
      //   change wholesale while a small one cannot.
      //
      // The full 148-shot suite passes at zero tolerance, so there is no AA
      // noise to buy off. If CI ever proves flaky, raise maxDiffPixels (an
      // absolute count) rather than reintroducing a ratio.
      threshold: 0.05,
      maxDiffPixelRatio: 0,
      // Freeze CSS animations (spinners, transitions) at their end state,
      // otherwise every run catches them at a different frame.
      animations: 'disabled',
      caret: 'hide',
      // Screenshot in CSS pixels so the baseline does not depend on the
      // display's DPI.
      scale: 'css',
    },
  },

  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://127.0.0.1:${PORT}`,
    deviceScaleFactor: 1,
    // Only kept for failures — a trace per story would be gigabytes.
    trace: 'retain-on-failure',
  },

  webServer: {
    command: `node scripts/serve-static.mjs storybook-static ${PORT}`,
    // index.json is what the suite enumerates stories from, so waiting on it
    // proves the build is both served and complete.
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
