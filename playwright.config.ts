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
      // Set by experiment, and tightened twice — each time because the
      // previous value was caught letting a real change through.
      //
      //   0.2  (Playwright's default) missed Select's border moving one step
      //        along the grey ramp: ZERO differing pixels.
      //   0.05 missed the Input field changing surface in LIGHT mode.
      //        #f1f5f9 -> #ffffff is a whole surface swap, but the YIQ gap is
      //        only 0.042, so it too counted zero pixels. Dark caught it
      //        (0.061) — the suite reported the change in one theme and not
      //        the other, which is how it was noticed at all.
      //   0    is unusable: anti-aliasing on the icon-only button's circles
      //        alone registers 28,434 pixels.
      //   0.02 catches both of the above and produces zero false positives
      //        across all 154 shots.
      //
      // This palette's adjacent surfaces are ~0.04 apart in YIQ, so anything
      // at or above 0.03 is blind to a surface swap. Do not loosen it.
      //
      // maxDiffPixelRatio stays 0 — a ratio scales with canvas size, so a
      // large story (the icon gallery) would get a proportionally huge budget
      // while a small one gets none. If CI ever proves flaky, raise
      // maxDiffPixels (an absolute count) instead.
      threshold: 0.02,
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
