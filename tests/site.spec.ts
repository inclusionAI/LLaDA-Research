import { expect, test } from '@playwright/test';

test('homepage presents the LLaDA diffusion hero before a compact research index', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await expect(page.getByLabel('Open navigation')).toBeVisible();
  } else {
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  }
  await expect(page.getByRole('heading', { name: 'Language, diffused.' })).toBeVisible();
  await expect(page.locator('[data-denoise-field]')).toBeVisible();
  const featuredStrip = await page.locator('[data-featured-strip]').boundingBox();
  expect(featuredStrip).not.toBeNull();
  expect(featuredStrip!.height).toBe(47);
  await expect(page.locator('[data-research-index]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Papers', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
});

test('homepage presents an editorial research shelf', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText(
    'LLaDA turns masked noise into language through iterative, parallel denoising—an open alternative to left-to-right generation.',
    { exact: true },
  )).toBeVisible();
  await expect(page.locator('[data-featured-strip]').getByText('Latest', { exact: true })).toBeVisible();
  await expect(page.getByText('The work', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models. Papers. Notes.', exact: true })).toBeVisible();
  await expect(page.getByText('Open checkpoints for language and multimodal generation.', { exact: true })).toBeVisible();
  await expect(page.getByText(
    'Methods for scaling, accelerating, and extending diffusion language models.',
    { exact: true },
  )).toBeVisible();
  await expect(page.getByText(
    'Release notes, implementation details, and research perspectives.',
    { exact: true },
  )).toBeVisible();
  const researchColumns = page.locator('[data-research-column]');
  await expect(researchColumns).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    await expect(researchColumns.nth(index).locator('[data-entry-kind="lead"]')).toHaveCount(1);
  }
  expect(await page.locator('[data-entry-kind="compact"]').count()).toBeGreaterThan(0);
});

test('homepage content uses contribution-first copy', async ({ page }) => {
  await page.goto('/');

  const researchColumns = page.locator('[data-research-column]');
  await expect(researchColumns.nth(0).getByText(
    'Open diffusion models for language, multimodal creation, and agents.',
    { exact: true },
  )).toBeVisible();
  await expect(researchColumns.nth(1).getByText(
    'Levenshtein editing enables agentic generation with insert, delete, and replace.',
    { exact: true },
  )).toBeVisible();
  await expect(researchColumns.nth(2).getByRole('heading', { name: 'A Home for LLaDA Research' })).toBeVisible();

  await page.goto('/papers/');
  await expect(page.getByText(
    'Token editing accelerates text diffusion by revising only what needs to change.',
    { exact: true },
  )).toBeVisible();
  await expect(page.getByText(
    'Scaling discrete diffusion language models to 100B parameters with Mixture-of-Experts.',
    { exact: true },
  )).toBeVisible();
});

test('homepage lead summaries remain intact at narrow desktop widths', async ({ page }) => {
  await page.setViewportSize({ width: 901, height: 900 });
  await page.goto('/');

  const summaries = page.locator('[data-entry-kind="lead"] p');
  await expect(summaries).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    const summary = summaries.nth(index);
    const fullyVisible = await summary.evaluate((element) => (
      element.scrollHeight <= element.clientHeight + 1
    ));
    const dimensions = await summary.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect.soft(
      fullyVisible,
      `lead summary ${index + 1} is not fully visible (${dimensions.scrollHeight}px > ${dimensions.clientHeight}px)`,
    ).toBe(true);
  }
});

test('research shelf lead links reveal their token state on keyboard focus', async ({ page }) => {
  await page.goto('/');

  const leadLink = page.locator('[data-research-column]').first().locator('[data-entry-kind="lead"] .entry-link');
  await leadLink.focus();
  await expect(leadLink.locator('.token-kind')).toHaveCSS('opacity', '1');
  await expect(leadLink.locator('.token-mask')).toHaveCSS('opacity', '0');
});

test('research shelf uses whitespace instead of a desktop table', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const columns = page.locator('[data-research-column]');
  await expect(columns.nth(1)).toHaveCSS('border-left-width', '0px');
  await expect(columns.first().locator('li').first()).toHaveCSS('border-top-width', '0px');

  await page.setViewportSize({ width: 1024, height: 900 });
  const columnGap = await page.locator('.research-grid').evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).columnGap)
  ));
  expect(columnGap).toBeGreaterThanOrEqual(48);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(columns.nth(1)).toHaveCSS('border-top-width', '1px');
  await expect(columns.first().locator('li').first()).toHaveCSS('border-top-width', '0px');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('homepage uses the dark research theme', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(3, 3, 3)');
  await expect(page.locator('[data-featured-strip]')).toHaveCSS('border-radius', '0px');
});

test('desktop hero stays close to 55vh on a short landscape viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  const hero = await page.locator('.research-hero').boundingBox();
  expect(hero).not.toBeNull();
  expect(hero!.height).toBeLessThanOrEqual(432);
});

test('mobile hero leaves the research index within reach on a short phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const hero = await page.locator('.research-hero').boundingBox();
  expect(hero).not.toBeNull();
  expect(hero!.height).toBeLessThanOrEqual(398);
});

test('denoise field has a designed reduced-motion state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-denoise-field]')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('[data-static-token-field]')).toBeVisible();
});

test('denoise field responds to pointer input and lets the trail settle', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');
  const box = await field.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.72, box!.y + box!.height * 0.5);
  await expect(field).toHaveAttribute('data-interacting', 'true');
  await page.mouse.move(0, 0);
  await expect(field).toHaveAttribute('data-interacting', 'false', { timeout: 2_000 });
});

test('full-motion hero keeps readable parallel token lanes in the composition', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-token-lane]')).toHaveCount(3);
  await expect(page.locator('[data-token-lane]').first()).toBeVisible();
  await expect(page.locator('[data-token-lane]').first()).toContainText('[MASK]');
});

test('mobile archives prioritize titles over decorative thumbnails', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout assertion');
  await page.goto('/papers/');
  const art = page.locator('.card-art').first();
  const box = await art.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeLessThanOrEqual(96);
});

test('token artwork link exposes its visible mask token in the accessible name', async ({ page }) => {
  await page.goto('/papers/');
  await expect(page.locator('.card-art').first()).toHaveAccessibleName(/\[MASK\]/);
});

test('footer copyright text meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/');
  const contrast = await page.locator('.site-footer small').evaluate((element) => {
    const channels = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const luminance = (value: string) => {
      const linear = channels(value).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const foreground = luminance(getComputedStyle(element).color);
    const background = luminance(getComputedStyle(element.closest('.site-footer')!).backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test('mobile featured strip exposes a concise identifiable title', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout assertion');
  await page.goto('/');
  const title = page.locator('[data-featured-mobile-title]');
  await expect(title).toBeVisible();
  await expect(title).toHaveText('LLaDA2.2 — Agentic diffusion through Levenshtein editing');
});

test('supporting pages share the dark visual system', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(3, 3, 3)');
  }
});

test('primary content routes are reachable', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/']) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
  }
});

test('archive filters entries by query and clears the filter', async ({ page }) => {
  await page.goto('/papers/');
  const cards = page.locator('[data-filter-card]');
  await expect(cards).toHaveCount(4);
  await page.getByRole('searchbox').fill('multimodal');
  await expect(page.locator('[data-filter-card]:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('[data-filter-card]:visible')).toHaveCount(4);
});

test('404 page offers recovery links', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
});

test('mobile homepage does not overflow horizontally', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
