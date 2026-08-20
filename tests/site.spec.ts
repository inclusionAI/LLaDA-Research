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
  await expect(page.getByRole('region', { name: 'Research updates' })).toBeVisible();
  await expect(page.locator('[data-update-entry]')).toHaveCount(4);
  await expect(page.locator('[data-research-index]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Papers', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
});

test('hero links reveal their rules on hover and keyboard focus', async ({ page }) => {
  await page.goto('/');

  const heroLink = page.locator('.hero-links a').first();
  const ink = await page.locator('#hero-title').evaluate((element) => getComputedStyle(element).color);
  await expect(heroLink).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');

  await heroLink.hover();
  await expect(heroLink).toHaveCSS('border-bottom-color', ink);

  await page.mouse.move(0, 0);
  await expect(heroLink).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await heroLink.focus();
  await expect(heroLink).toHaveCSS('border-bottom-color', ink);
});

test('homepage supporting type is readable at desktop and mobile sizes', async ({ page }) => {
  const expectFontSizeAtLeast = async (selector: string, minimum: number) => {
    const size = await page.locator(selector).first().evaluate((element) => (
      Number.parseFloat(getComputedStyle(element).fontSize)
    ));
    expect.soft(size, `${selector} font size`).toBeGreaterThanOrEqual(minimum);
  };

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  await expectFontSizeAtLeast('.hero-kicker', 10.8);
  await expectFontSizeAtLeast('.hero-summary', 15);
  await expectFontSizeAtLeast('.hero-links a', 12);
  await expectFontSizeAtLeast('.update-kind', 10.8);
  await expectFontSizeAtLeast('.update-title', 12.8);
  await expectFontSizeAtLeast('.index-eyebrow', 10.8);
  await expectFontSizeAtLeast('.index-description', 14);
  await expectFontSizeAtLeast('.column-header h2', 22);
  await expectFontSizeAtLeast('.column-header p', 13);
  await expectFontSizeAtLeast('.entry-meta', 10.8);
  await expectFontSizeAtLeast('.entry-link--lead h3', 21);
  await expectFontSizeAtLeast('.entry-link--compact h3', 15);
  await expectFontSizeAtLeast('.entry-link--lead > p', 13);
  await expectFontSizeAtLeast('.entry-token', 10.8);
  await expectFontSizeAtLeast('.view-all', 11);

  await page.setViewportSize({ width: 390, height: 844 });
  await expectFontSizeAtLeast('.column-header p', 13);
  await expectFontSizeAtLeast('.entry-link--lead > p', 13);
  await expect(page.locator('[data-update-entry]')).toHaveCount(4);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('site typography hierarchy distinguishes headings, supporting copy, and metadata', async ({ page }) => {
  const fontSize = async (selector: string) => page.locator(selector).first().evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).fontSize)
  ));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  const columnTitle = await fontSize('.column-header h2');
  const columnDescription = await fontSize('.column-header p');
  const leadTitle = await fontSize('[data-entry-kind="lead"] h3');
  const compactTitle = await fontSize('[data-entry-kind="compact"] h3');
  const leadSummary = await fontSize('[data-entry-kind="lead"] > .entry-link > p');
  expect(columnTitle).toBeGreaterThanOrEqual(28);
  expect(columnDescription).toBeGreaterThanOrEqual(15);
  expect(leadTitle).toBeGreaterThanOrEqual(21);
  expect(compactTitle).toBeGreaterThanOrEqual(16);
  expect(leadSummary).toBeGreaterThanOrEqual(14);
  expect(columnTitle).toBeGreaterThan(leadTitle);
  expect(columnTitle / leadTitle).toBeGreaterThanOrEqual(1.5);
  expect(leadTitle).toBeGreaterThan(compactTitle);
  const columnTitleWeight = await page.locator('.column-header h2').first().evaluate((element) => (
    Number.parseInt(getComputedStyle(element).fontWeight, 10)
  ));
  const leadTitleWeight = await page.locator('[data-entry-kind="lead"] h3').first().evaluate((element) => (
    Number.parseInt(getComputedStyle(element).fontWeight, 10)
  ));
  expect(columnTitleWeight).toBeLessThanOrEqual(leadTitleWeight);
  await expect(page.locator('.column-header').first()).toHaveCSS('border-bottom-width', '1px');
  expect(await fontSize('.desktop-nav a')).toBeGreaterThanOrEqual(12);

  await page.goto('/models/');
  expect(await fontSize('.page-intro > p')).toBeGreaterThanOrEqual(16);
  expect(await fontSize('.content-card h2')).toBeGreaterThanOrEqual(24);
  expect(await fontSize('.content-card .card-copy > p')).toBeGreaterThanOrEqual(15);
  expect(await fontSize('.card-meta')).toBeGreaterThanOrEqual(11);
  expect(await fontSize('.filter-tags button')).toBeGreaterThanOrEqual(12);

  await page.goto('/models/llada-2-2/');
  expect(await fontSize('.content-summary')).toBeGreaterThanOrEqual(18);
  expect(await fontSize('.prose')).toBeGreaterThanOrEqual(17);

  await page.goto('/about/');
  expect(await fontSize('.button')).toBeGreaterThanOrEqual(12);
  expect(await fontSize('.about-copy > p:not(.eyebrow)')).toBeGreaterThanOrEqual(16);
});

test('homepage presents an editorial research shelf', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText(
    'LLaDA turns masked noise into language through iterative, parallel denoising—an open alternative to left-to-right generation.',
    { exact: true },
  )).toBeVisible();
  const updates = page.getByRole('region', { name: 'Research updates' });
  await expect(updates.locator('[data-update-entry]')).toHaveCount(4);
  await expect(updates.getByText('Paper', { exact: true })).toHaveCount(2);
  await expect(updates.getByText('Model', { exact: true })).toHaveCount(1);
  await expect(updates.getByText('Note', { exact: true })).toHaveCount(1);
  await expect(updates.getByRole('link', { name: /^Model .* LLaDA2\.2$/ })).toContainText('Model');
  await expect(updates.getByRole('link', { name: /A Home for LLaDA Research/ })).toContainText('Note');
  await expect(page.getByText('Latest', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Research program', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', {
    name: 'Diffusion language models, from foundations to scale.',
    exact: true,
  })).toBeVisible();
  await expect(page.getByText(
    'Models, papers, and technical notes across the LLaDA research program.',
    { exact: true },
  )).toBeVisible();
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
    'A 30B-A3B model that establishes practical scaling laws for MoE diffusion language models.',
    { exact: true },
  )).toBeVisible();
  await expect(researchColumns.nth(1).getByText(
    'Derives scaling principles for MoE diffusion language models and trains a 30B-A3B model.',
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
  await expect(page.locator('[data-research-updates]')).toHaveCSS('border-radius', '0px');
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

test('research updates form a two-column desktop grid and four mobile rows', async ({ page, isMobile }) => {
  await page.goto('/');
  const entries = page.locator('[data-update-entry]');
  await expect(entries).toHaveCount(4);
  const boxes = await Promise.all(Array.from({ length: 4 }, (_, index) => entries.nth(index).boundingBox()));
  expect(boxes.every(Boolean)).toBe(true);

  if (isMobile) {
    expect(boxes[0]!.y).toBeLessThan(boxes[1]!.y);
    expect(boxes[1]!.y).toBeLessThan(boxes[2]!.y);
    expect(boxes[2]!.y).toBeLessThan(boxes[3]!.y);
    expect(Math.abs(boxes[0]!.x - boxes[1]!.x)).toBeLessThan(2);
  } else {
    expect(Math.abs(boxes[0]!.y - boxes[1]!.y)).toBeLessThan(2);
    expect(boxes[0]!.x).toBeLessThan(boxes[1]!.x);
    expect(boxes[2]!.y).toBeGreaterThan(boxes[0]!.y);
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
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

test('paper archive exposes the complete llada lineage', async ({ page }) => {
  await page.goto('/papers/');

  const cards = page.locator('[data-filter-card]');
  await expect(cards).toHaveCount(9);
  for (const title of [
    'Large Language Diffusion Models',
    'LLaDA 1.5: Variance-Reduced Preference Optimization for Large Language Diffusion Models',
    'LLaDA-MoE: A Sparse MoE Diffusion Language Model',
    'Improved Large Language Diffusion Models',
    'LLaDA MoE v2: Scaling Mixture-of-Experts Diffusion Language Models',
  ]) {
    await expect(cards.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }
});

test('expanded llada detail routes are reachable for papers', async ({ page }) => {
  for (const path of [
    '/papers/large-language-diffusion-models/',
    '/papers/llada-1-5/',
    '/papers/llada-moe/',
    '/papers/improved-large-language-diffusion-models/',
    '/papers/llada-moe-v2/',
  ]) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
  }
});

test('complete llada lineage shows corrected publication dates', async ({ page }) => {
  await page.goto('/papers/');

  const cards = page.locator('[data-filter-card]');
  await expect(cards.filter({
    has: page.getByRole('heading', { name: 'LLaDA2.0: Scaling Up Diffusion Language Models to 100B', exact: true }),
  }).getByText('Dec 10, 2025', { exact: true })).toBeVisible();
  await expect(cards.filter({
    has: page.getByRole('heading', { name: 'LLaDA2.1: Speeding Up Text Diffusion via Token Editing', exact: true }),
  }).getByText('Feb 9, 2026', { exact: true })).toBeVisible();
});

test('model archive exposes the complete llada lineage', async ({ page }) => {
  await page.goto('/models/');

  const cards = page.locator('[data-filter-card]');
  await expect(cards).toHaveCount(10);
  for (const title of [
    'LLaDA-8B',
    'LLaDA 1.5',
    'LLaDA-MoE 7B-A1B',
    'LLaDA2.0',
    'LLaDA2.1',
    'iLLaDA-8B',
    'LLaDA2.2',
    'LLaDA MoE v2',
    'LLaDA2.X',
    'LLaDA2.0-Uni',
  ]) {
    await expect(cards.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }
});

test('expanded llada model detail routes are reachable', async ({ page }) => {
  for (const path of [
    '/models/llada-8b/',
    '/models/llada-1-5/',
    '/models/llada-moe-7b-a1b/',
    '/models/llada-2-0/',
    '/models/llada-2-1/',
    '/models/illada-8b/',
    '/models/llada-2-2/',
    '/models/llada-moe-v2/',
  ]) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
  }
});

test('model detail pages enumerate checkpoint releases', async ({ page }) => {
  const cases = [
    {
      path: '/models/llada-8b/',
      checkpoints: [
        'https://huggingface.co/GSAI-ML/LLaDA-8B-Base',
        'https://huggingface.co/GSAI-ML/LLaDA-8B-Instruct',
      ],
    },
    {
      path: '/models/llada-1-5/',
      checkpoints: ['https://huggingface.co/GSAI-ML/LLaDA-1.5'],
    },
    {
      path: '/models/llada-moe-7b-a1b/',
      checkpoints: [
        'https://huggingface.co/inclusionAI/LLaDA-MoE-7B-A1B-Base',
        'https://huggingface.co/inclusionAI/LLaDA-MoE-7B-A1B-Instruct',
      ],
    },
    {
      path: '/models/llada-2-0/',
      checkpoints: [
        'https://huggingface.co/inclusionAI/LLaDA2.0-mini',
        'https://huggingface.co/inclusionAI/LLaDA2.0-flash',
        'https://huggingface.co/inclusionAI/LLaDA2.0-mini-CAP',
        'https://huggingface.co/inclusionAI/LLaDA2.0-flash-CAP',
      ],
    },
    {
      path: '/models/llada-2-1/',
      checkpoints: [
        'https://huggingface.co/inclusionAI/LLaDA2.1-mini',
        'https://huggingface.co/inclusionAI/LLaDA2.1-flash',
      ],
    },
    {
      path: '/models/illada-8b/',
      checkpoints: [
        'https://huggingface.co/GSAI-ML/iLLaDA-8B-Base',
        'https://huggingface.co/GSAI-ML/iLLaDA-8B-Instruct',
      ],
    },
    {
      path: '/models/llada-2-2/',
      checkpoints: ['https://huggingface.co/inclusionAI/LLaDA2.2-flash'],
    },
  ];

  for (const { path, checkpoints } of cases) {
    await page.goto(path);
    await expect(page.locator('.prose').getByRole('heading', {
      name: 'Checkpoints',
      exact: true,
      level: 2,
    })).toBeVisible();
    const links = page.locator('.prose h2 + ul > li > a');
    await expect(links).toHaveCount(checkpoints.length);
    for (let index = 0; index < checkpoints.length; index += 1) {
      await expect(links.nth(index)).toHaveAttribute('href', checkpoints[index]);
    }
  }
});

test('llada 2 model resources link checkpoints and official collections', async ({ page }) => {
  for (const { path, model, collection } of [
    {
      path: '/models/llada-2-0/',
      model: 'https://huggingface.co/inclusionAI/LLaDA2.0-flash',
      collection: 'https://huggingface.co/collections/inclusionAI/llada20',
    },
    {
      path: '/models/llada-2-1/',
      model: 'https://huggingface.co/inclusionAI/LLaDA2.1-flash',
      collection: 'https://huggingface.co/collections/inclusionAI/llada21',
    },
  ]) {
    await page.goto(path);
    await expect(page.locator('.prose').getByRole('link', { name: 'official collection' }))
      .toHaveAttribute('href', collection);
    await expect(page.getByRole('navigation', { name: 'External resources' })
      .getByRole('link', { name: 'Models' })).toHaveAttribute('href', model);
  }
});

test('llada moe 7b-a1b omits unverified repository links', async ({ page }) => {
  await page.goto('/models/llada-moe-7b-a1b/');
  const resources = page.getByRole('navigation', { name: 'External resources' });
  await expect(resources.getByRole('link', { name: 'Project' })).toHaveCount(0);
  await expect(resources.getByRole('link', { name: 'Code' })).toHaveCount(0);
});

test('archive filters entries by query and clears the filter', async ({ page }) => {
  await page.goto('/papers/');
  const cards = page.locator('[data-filter-card]');
  await expect(cards).toHaveCount(9);
  await page.getByRole('searchbox').fill('multimodal');
  await expect(page.locator('[data-filter-card]:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('[data-filter-card]:visible')).toHaveCount(9);
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
