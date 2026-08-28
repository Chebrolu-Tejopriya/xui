/**
 * One screenshot per story, per theme, diffed against a committed baseline.
 *
 * The story list is read from the build's own index.json rather than being
 * maintained here, so a new story is covered the moment it exists — a list
 * kept by hand would silently stop covering things, which is the failure mode
 * this suite is meant to remove.
 */
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const INDEX = path.resolve('storybook-static', 'index.json');

if (!fs.existsSync(INDEX)) {
  throw new Error(
    `storybook-static/index.json not found.\n` +
      `Build the docs first:  npm run build-storybook\n` +
      `(\`npm run test:visual\` does this for you.)`,
  );
}

interface Entry {
  id: string;
  title: string;
  name: string;
  type?: string;
}

const index = JSON.parse(fs.readFileSync(INDEX, 'utf8')) as {
  entries?: Record<string, Entry>;
  stories?: Record<string, Entry>;
};

// Storybook has used both keys across index versions; accept either.
const all = Object.values(index.entries ?? index.stories ?? {});
// `docs` entries render an MDX page, not a component — they are documentation
// about the stories already covered below, so snapshotting them only adds
// churn whenever prose is edited.
const stories = all.filter((e) => (e.type ?? 'story') === 'story').sort((a, b) => a.id.localeCompare(b.id));

if (stories.length === 0) {
  throw new Error('index.json contained no stories — is the Storybook build complete?');
}

/**
 * Stories that cannot be pinned to a stable image. Add an id here WITH a
 * reason; an unexplained entry is a hole in the gate that nobody will revisit.
 */
const UNSTABLE = new Map<string, string>([]);

const THEMES = ['light', 'dark'] as const;

for (const theme of THEMES) {
  test.describe(theme, () => {
    for (const story of stories) {
      const reason = UNSTABLE.get(story.id);

      test(story.id, async ({ page }) => {
        test.skip(reason !== undefined, reason);

        await page.goto(
          `/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&globals=theme:${theme}`,
        );

        const root = page.locator('#storybook-root');
        await root.waitFor({ state: 'visible' });

        // Inter is a webfont. Screenshotting before it swaps in captures the
        // fallback face and produces a baseline nobody can reproduce.
        await page.evaluate(() => document.fonts.ready);

        // An empty root has no box to screenshot; fall back to the viewport so
        // the failure is a visible diff rather than a confusing Playwright
        // error about zero-sized elements.
        const box = await root.boundingBox();
        const target = box && box.width > 0 && box.height > 0 ? root : page;

        await expect(target).toHaveScreenshot(`${story.id}--${theme}.png`);
      });
    }
  });
}
