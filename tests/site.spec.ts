import { expect, test } from '@playwright/test';

test('homepage presents a focused research proposition and three-layer index', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await expect(page.getByLabel('Open navigation')).toBeVisible();
  } else {
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  }

  await expect(page.getByRole('heading', { name: 'Language takes shape.', exact: true })).toBeVisible();
  await expect(page.locator('[data-denoise-field]')).toBeVisible();
  expect(await page.locator('[data-research-updates]').count()).toBe(0);
  expect(await page.locator('[data-update-entry]').count()).toBe(0);
  expect(await page.locator('[data-research-column]').count()).toBe(0);

  const heroCta = page.locator('[data-hero-cta]');
  expect(await heroCta.count()).toBe(1);
  expect(await heroCta.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(['/papers/']);

  const selectedWork = page.locator('[data-selected-work]');
  expect(await selectedWork.count()).toBe(2);
  expect(await selectedWork.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/papers/llada-2-2/',
    '/papers/llada-2-0-uni/',
  ]);
  expect(await selectedWork.allTextContents()).toEqual([
    expect.stringContaining('LLaDA2.2'),
    expect.stringContaining('LLaDA2.0-Uni'),
  ]);

  const programLinks = page.locator('[data-program-link]');
  expect(await programLinks.count()).toBe(3);
  expect(await programLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/models/',
    '/papers/',
    '/blog/',
  ]);
  expect(await programLinks.locator('.program-title').allTextContents()).toEqual(['Models', 'Publications', 'Notes']);
});

test('site chrome uses the approved black LLaDA wordmark through base-safe paths', async ({ page }) => {
  await page.goto('/');

  const headerLogo = page.locator('.site-header [data-brand-logo]');
  const footerLogo = page.locator('.site-footer [data-brand-logo]');
  await expect(headerLogo).toBeVisible();
  await expect(footerLogo).toBeVisible();
  await expect(headerLogo).toHaveAttribute('src', /\/llada-logo-black\.svg$/);
  await expect(footerLogo).toHaveAttribute('src', /\/llada-logo-black\.svg$/);
  await expect(page.locator('.brand-mark')).toHaveCount(0);

  const headerBox = await headerLogo.boundingBox();
  expect(headerBox).not.toBeNull();
  expect(headerBox!.width / headerBox!.height).toBeGreaterThan(3);
});

test('hero CTA reveals its rule on hover and keyboard focus', async ({ page }) => {
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
  await expectFontSizeAtLeast('.selected-work .section-header p', 10.8);
  await expectFontSizeAtLeast('.selected-work h2', 22);
  await expectFontSizeAtLeast('.work-meta', 10.8);
  await expectFontSizeAtLeast('.work-copy h3', 20);
  await expectFontSizeAtLeast('.work-copy p', 14);
  await expectFontSizeAtLeast('.program-title', 16);
  await expectFontSizeAtLeast('.program-description', 13);

  await page.setViewportSize({ width: 390, height: 844 });
  await expectFontSizeAtLeast('.work-copy p', 14);
  await expectFontSizeAtLeast('.program-description', 13);
  await expect(page.locator('[data-selected-work]')).toHaveCount(2);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('site typography hierarchy distinguishes headings, supporting copy, and metadata', async ({ page }) => {
  const fontSize = async (selector: string) => page.locator(selector).first().evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).fontSize)
  ));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  const sectionTitle = await fontSize('.selected-work h2');
  const workTitle = await fontSize('.work-copy h3');
  const workSummary = await fontSize('.work-copy p');
  const programTitle = await fontSize('.program-title');
  const programDescription = await fontSize('.program-description');
  expect(sectionTitle).toBeGreaterThanOrEqual(26);
  expect(workTitle).toBeGreaterThanOrEqual(20);
  expect(workSummary).toBeGreaterThanOrEqual(14);
  expect(programTitle).toBeGreaterThanOrEqual(16);
  expect(programDescription).toBeGreaterThanOrEqual(13);
  expect(sectionTitle).toBeGreaterThan(workTitle);
  const sectionTitleWeight = await page.locator('.selected-work h2').first().evaluate((element) => (
    Number.parseInt(getComputedStyle(element).fontWeight, 10)
  ));
  const workTitleWeight = await page.locator('.work-copy h3').first().evaluate((element) => (
    Number.parseInt(getComputedStyle(element).fontWeight, 10)
  ));
  expect(sectionTitleWeight).toBeLessThanOrEqual(workTitleWeight);
  await expect(page.locator('.selected-work .section-header')).toHaveCSS('border-bottom-width', '1px');
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

test('homepage presents restrained selected work and program navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText(
    'We study how language and multimodal systems emerge through iterative diffusion and editing.',
    { exact: true },
  )).toBeVisible();
  const selectedWork = page.getByRole('region', { name: 'Recent publications' });
  await expect(selectedWork.locator('[data-selected-work]')).toHaveCount(2);
  await expect(selectedWork.getByText('Technical Report', { exact: true })).toBeVisible();
  await expect(selectedWork.getByText('arXiv', { exact: true })).toBeVisible();
  await expect(page.getByText('Research program', { exact: true })).toBeVisible();
  await expect(page.getByText('Open checkpoints and release details.', { exact: true })).toBeVisible();
  await expect(page.getByText('Methods, results, and technical reports.', { exact: true })).toBeVisible();
  await expect(page.getByText('Research updates and implementation perspectives.', { exact: true })).toBeVisible();
});

test('homepage content uses contribution-first copy', async ({ page }) => {
  await page.goto('/');

  const selectedWork = page.locator('[data-selected-work]');
  await expect(selectedWork.nth(0).getByText(
    'Levenshtein editing enables agentic generation with insert, delete, and replace.',
    { exact: true },
  )).toBeVisible();
  await expect(selectedWork.nth(1).getByText(
    'A unified multimodal diffusion model for understanding, generation, editing, and interleaved reasoning.',
    { exact: true },
  )).toBeVisible();

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

test('homepage selected-work summaries remain intact at narrow desktop widths', async ({ page }) => {
  await page.setViewportSize({ width: 901, height: 900 });
  await page.goto('/');

  const summaries = page.locator('[data-selected-work] .work-copy p');
  await expect(summaries).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
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
      `selected-work summary ${index + 1} is not fully visible (${dimensions.scrollHeight}px > ${dimensions.clientHeight}px)`,
    ).toBe(true);
  }
});

test('selected-work links reveal their directional cue on keyboard focus', async ({ page }) => {
  await page.goto('/');

  const selectedLink = page.locator('[data-selected-work]').first();
  const ink = await page.locator('body').evaluate((element) => getComputedStyle(element).color);
  await selectedLink.focus();
  await expect(selectedLink.locator('.work-arrow')).toHaveCSS('color', ink);
});

test('selected work uses flat ruled rows', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const rows = page.locator('.selected-work li');
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toHaveCSS('border-bottom-width', '1px');
  await expect(page.locator('[data-selected-work]').first()).toHaveCSS('border-radius', '0px');

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('homepage uses the light contemporary journal theme', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(247, 248, 243)');
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(36, 49, 43)');
  await expect(page.locator('#hero-title')).toHaveCSS('color', 'rgb(36, 49, 43)');
  await expect(page.locator('[data-selected-work]').first()).toHaveCSS('border-radius', '0px');
});

test('primary navigation uses journal labels without changing route paths', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByLabel('Open navigation').click();
  }

  const navigation = page.getByRole('navigation', {
    name: isMobile ? 'Mobile navigation' : 'Primary navigation',
  });
  await expect(navigation.getByRole('link', { name: 'Publications', exact: true })).toHaveAttribute('href', '/papers/');
  await expect(navigation.getByRole('link', { name: 'Notes', exact: true })).toHaveAttribute('href', '/blog/');
  await expect(navigation.getByRole('link', { name: 'Papers', exact: true })).toHaveCount(0);
  await expect(navigation.getByRole('link', { name: 'Blog', exact: true })).toHaveCount(0);
});

test('publication and notes labels are consistent across archive and recovery pages', async ({ page }) => {
  await page.goto('/papers/');
  await expect(page.getByRole('heading', { level: 1, name: 'Publications', exact: true })).toBeVisible();

  await page.goto('/blog/');
  await expect(page.getByRole('heading', { level: 1, name: 'Notes', exact: true })).toBeVisible();

  await page.goto('/404.html');
  const recovery = page.getByRole('navigation', { name: 'Page recovery' });
  await expect(recovery.getByRole('link', { name: 'Publications', exact: true })).toHaveAttribute('href', '/papers/');
  await expect(recovery.getByRole('link', { name: 'Notes', exact: true })).toHaveAttribute('href', '/blog/');
});

test('mobile menu is a flat light surface', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout assertion');
  await page.goto('/');
  await page.getByLabel('Open navigation').click();

  const menu = page.locator('.mobile-menu');
  await expect(menu).toHaveCSS('background-color', 'rgb(247, 248, 243)');
  await expect(menu).toHaveCSS('box-shadow', 'none');
});

test('desktop hero stays close to 55vh on a short landscape viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  const hero = await page.locator('.research-hero').boundingBox();
  expect(hero).not.toBeNull();
  expect(hero!.height).toBeLessThanOrEqual(432);
});

test('mobile hero leaves the selected work within reach on a short phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const hero = await page.locator('.research-hero').boundingBox();
  expect(hero).not.toBeNull();
  expect(hero!.height).toBeLessThanOrEqual(398);
});

test('denoise field has a designed reduced-motion state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');
  await expect(field).toHaveAttribute('data-motion', 'reduced');
  await expect(field).toHaveAttribute('data-coherence-state', 'partial');
  expect(Number(await field.getAttribute('data-reduced-targets'))).toBeGreaterThan(0);
  await expect(field.locator('canvas')).toBeVisible();
});

test('denoise field responds to pointer input and lets the trail settle', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');
  const box = await field.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.72, box!.y + box!.height * 0.5);
  await expect(field).toHaveAttribute('data-interacting', 'true');
  await expect(field).toHaveAttribute('data-pointer-glyphs', 'mask partial resolved');
  await page.mouse.move(0, 0);
  await expect(field).toHaveAttribute('data-interacting', 'false', { timeout: 2_000 });
});

test('semantic particles respond locally to a fast pointer pass and return to rest', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');
  await expect(field).toHaveAttribute('data-coherence-state', 'resolved', { timeout: 900 });
  const box = await field.boundingBox();
  expect(box).not.toBeNull();

  const centerX = Number(await field.getAttribute('data-coherence-x'));
  const side = Number(await field.getAttribute('data-coherence-side'));
  const semanticTop = Number(await field.getAttribute('data-semantic-top'));
  const semanticBottom = Number(await field.getAttribute('data-semantic-bottom'));
  const centerY = (semanticTop + semanticBottom) / 2;
  const cycleEpoch = await field.getAttribute('data-cycle-epoch');

  await page.mouse.move(box!.x + centerX - side * 0.28, box!.y + centerY - side * 0.09);
  await page.mouse.move(box!.x + centerX + side * 0.12, box!.y + centerY - side * 0.09);

  await expect(field).toHaveAttribute('data-semantic-proximity-state', 'near');
  await expect.poll(async () => Number(await field.getAttribute('data-semantic-max-displacement'))).toBeGreaterThan(0);
  expect(Number(await field.getAttribute('data-semantic-max-displacement'))).toBeLessThanOrEqual(8);
  expect(Number(await field.getAttribute('data-semantic-proximity'))).toBeGreaterThan(0);
  expect(Number(await field.getAttribute('data-semantic-tangent-alignment'))).toBeGreaterThan(0.9);
  await expect(field).toHaveAttribute('data-semantic-rest', 'false');

  await page.mouse.move(0, 0);
  await expect(field).toHaveAttribute('data-semantic-proximity-state', 'far', { timeout: 500 });
  await expect(field).toHaveAttribute('data-semantic-rest', 'true', { timeout: 500 });
  await expect(field).toHaveAttribute('data-cycle-epoch', cycleEpoch || '');
  await expect(field.locator('canvas')).toHaveCount(1);
  await expect(field).toHaveAttribute('data-animation-loops', '1');
});

test('single coherence field replaces persistent background token lanes', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');

  await expect(field.locator('canvas')).toHaveCount(1);
  await expect(field.locator('[data-token-lane]')).toHaveCount(0);
  await expect(field.locator('[data-static-token-field]')).toHaveCount(0);
  await expect(field).toHaveAttribute('data-visual-system', 'coherence-field');
  await expect(field).toHaveAttribute('data-decode-window-ms', '650');
  await expect(field).toHaveAttribute('data-edit-mode', 'simultaneous');
});

test('coherence field merges into the light journal hero without a pointer spotlight', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');
  const canvas = field.locator('canvas');

  await expect(field).toHaveAttribute('data-field-theme', 'sage-light');
  await expect(field).toHaveAttribute('data-canvas-surface', 'ivory-trail');
  await expect(field).toHaveAttribute('data-pointer-spotlight', 'none');
  await expect(field).toHaveAttribute('data-visual-system', 'coherence-field');
  await expect(field).toHaveAttribute('data-decode-window-ms', '650');
  await expect(field).toHaveAttribute('data-edit-mode', 'simultaneous');
  await expect(canvas).toHaveCount(1);
  await expect(field).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(field).toHaveCSS('background-image', 'none');
  await expect(canvas).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  await expect(page.locator('#hero-title')).toHaveCSS('color', 'rgb(36, 49, 43)');
  await expect(page.locator('.hero-kicker')).toHaveCSS('color', 'rgb(104, 117, 110)');
  await expect(page.locator('.hero-summary')).toHaveCSS('color', 'rgb(104, 117, 110)');
  await expect(page.locator('[data-hero-cta]')).toHaveCSS('color', 'rgb(36, 49, 43)');
});

test('coherence field keeps one dense multi-material animation system', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');

  await expect(field).toHaveAttribute('data-materials', 'micro stroke mask semantic');
  await expect(field).toHaveAttribute('data-density-basis', '165');
  await expect(field).toHaveAttribute('data-animation-loops', '1');
  await expect(field.locator('canvas')).toHaveCount(1);
});

test('parallel semantic convergence resolves quickly and edits two positions together', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');

  await expect(field).toHaveAttribute('data-edit-count', '2');
  await expect(field).toHaveAttribute('data-edit-mode', 'simultaneous');
  await expect(field).toHaveAttribute('data-coherence-state', 'resolved', { timeout: 900 });
  expect(Number(await field.getAttribute('data-target-error'))).toBeLessThan(3);
  await expect(field.locator('[data-coherence-region]')).toHaveCount(0);
});

test('coherence field responds without separating from the hero', async ({ page }) => {
  const cases = [
    { width: 1440, height: 1000, lines: '2', maximumSide: 390 },
    { width: 820, height: 900, lines: '2', maximumSide: 340 },
    { width: 390, height: 844, lines: '2', maximumSide: 280 },
  ];

  for (const viewport of cases) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    const field = page.locator('[data-denoise-field]');
    const hero = page.locator('.research-hero');
    await expect(field).toHaveAttribute('data-semantic-lines', viewport.lines);
    const side = Number(await field.getAttribute('data-coherence-side'));
    const centerX = Number(await field.getAttribute('data-coherence-x'));
    expect(side).toBeGreaterThan(0);
    expect(side).toBeLessThanOrEqual(viewport.maximumSide);
    expect(centerX - side / 2).toBeGreaterThanOrEqual(0);
    const [fieldBox, heroBox] = await Promise.all([field.boundingBox(), hero.boundingBox()]);
    expect(fieldBox).not.toBeNull();
    expect(heroBox).not.toBeNull();
    expect(centerX + side / 2).toBeLessThanOrEqual(fieldBox!.width);
    expect(Math.abs(fieldBox!.width - heroBox!.width)).toBeLessThan(2);
    expect(Math.abs(fieldBox!.height - heroBox!.height)).toBeLessThan(2);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  }
});

test('mobile semantic lines sit below the hero links and remain inside the field', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const field = page.locator('[data-denoise-field]');
    const links = page.locator('.hero-links');
    const [fieldBox, linksBox] = await Promise.all([field.boundingBox(), links.boundingBox()]);
    expect(fieldBox).not.toBeNull();
    expect(linksBox).not.toBeNull();

    const semanticTop = Number(await field.getAttribute('data-semantic-top'));
    const semanticBottom = Number(await field.getAttribute('data-semantic-bottom'));
    const semanticLeft = Number(await field.getAttribute('data-semantic-left'));
    const semanticRight = Number(await field.getAttribute('data-semantic-right'));
    const linksBottomInField = linksBox!.y + linksBox!.height - fieldBox!.y;
    expect(semanticTop).toBeGreaterThan(linksBottomInField);
    expect(semanticBottom).toBeGreaterThan(semanticTop);
    expect(semanticBottom).toBeLessThanOrEqual(fieldBox!.height);
    expect(semanticLeft).toBeGreaterThanOrEqual(0);
    expect(semanticRight).toBeLessThanOrEqual(fieldBox!.width);
  }
});

test('semantic particle type uses two readable intentional lines', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');
  await expect(field).toHaveAttribute('data-semantic-lines', '2');
  await expect(field).toHaveAttribute('data-semantic-copy', 'LANGUAGE FORMS / TOKENS RESOLVE');
  await expect(field).toHaveAttribute('data-semantic-font-size', /^(18|19|20)$/);
  const desktopFontSize = Number(await field.getAttribute('data-semantic-font-size'));
  expect(desktopFontSize).toBeGreaterThanOrEqual(18);
  expect(desktopFontSize).toBeLessThanOrEqual(20);
  await expect.poll(async () => Number(await field.getAttribute('data-unchanged-layout-shifts'))).toBeGreaterThan(0);
  await expect(field.locator('canvas')).toHaveCount(1);
  await expect(field.locator('canvas')).toBeVisible();
  await expect(field.locator('[data-semantic-text]')).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(field).toHaveAttribute('data-semantic-font-size', /^(14|15|16)$/);
  const mobileFontSize = Number(await field.getAttribute('data-semantic-font-size'));
  expect(mobileFontSize).toBeGreaterThanOrEqual(14);
  expect(mobileFontSize).toBeLessThanOrEqual(16);
  expect(Number(await field.getAttribute('data-unchanged-layout-shifts'))).toBeGreaterThan(0);
});

test('same-canvas semantic skeleton reconnects resolved particle strokes', async ({ page }) => {
  await page.addInitScript(() => {
    const originalFillText = CanvasRenderingContext2D.prototype.fillText;
    const draws: Array<{ text: string; state: string | null }> = [];
    Object.defineProperty(window, '__semanticCanvasTextDraws', { value: draws });
    CanvasRenderingContext2D.prototype.fillText = function fillText(
      text: string,
      x: number,
      y: number,
      maxWidth?: number,
    ) {
      const owner = this.canvas.closest<HTMLElement>('[data-denoise-field]');
      if (this.canvas.isConnected && owner) {
        draws.push({ text: String(text), state: owner.dataset.coherenceState || null });
        if (draws.length > 400) draws.splice(0, draws.length - 400);
      }
      return maxWidth === undefined
        ? originalFillText.call(this, text, x, y)
        : originalFillText.call(this, text, x, y, maxWidth);
    };
  });
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');

  await expect(field).toHaveAttribute('data-skeleton-max-opacity', '0.28');
  await expect(field).toHaveAttribute('data-skeleton-surface', 'canvas');
  await expect(field).toHaveAttribute('data-skeleton-compositing', 'trail-compensated');
  await expect(field).toHaveAttribute('data-skeleton-layout-transition', 'interpolated-crossfade');
  await expect(field).toHaveAttribute('data-skeleton-mobile-occlusion', 'shared');
  await expect.poll(async () => field.evaluate((element) => {
    const compositedOpacity = Number(element.getAttribute('data-skeleton-opacity'));
    const sourceOpacity = Number(element.getAttribute('data-skeleton-source-opacity'));
    return element.getAttribute('data-coherence-state') === 'resolved'
      && element.getAttribute('data-skeleton-state') === 'active'
      && compositedOpacity > 0
      && compositedOpacity <= 0.28
      && sourceOpacity > 0
      && sourceOpacity < compositedOpacity;
  }), { timeout: 3_500 }).toBe(true);
  await expect.poll(async () => page.evaluate(() => {
    const draws = (window as typeof window & {
      __semanticCanvasTextDraws: Array<{ text: string; state: string | null }>;
    }).__semanticCanvasTextDraws.filter((draw) => draw.state === 'resolved');
    const text = draws
      .map((draw) => draw.text)
      .filter((value, index, values) => value !== values[index - 1]);
    for (let index = 0; index <= text.length - 4; index += 1) {
      const phrase = `${text[index]} ${text[index + 1]} / ${text[index + 2]} ${text[index + 3]}`;
      if (phrase === 'LANGUAGE FORMS / TOKENS RESOLVE') return phrase;
    }
    return '';
  }), { timeout: 3_500 }).toBe('LANGUAGE FORMS / TOKENS RESOLVE');
  await expect.poll(async () => page.evaluate(() => {
    const draws = (window as typeof window & {
      __semanticCanvasTextDraws: Array<{ text: string; state: string | null }>;
    }).__semanticCanvasTextDraws.filter((draw) => draw.state === 'resolved');
    const text = draws
      .map((draw) => draw.text)
      .filter((value, index, values) => value !== values[index - 1]);
    for (let index = 0; index <= text.length - 4; index += 1) {
      const phrase = `${text[index]} ${text[index + 1]} / ${text[index + 2]} ${text[index + 3]}`;
      if (phrase === 'LANGUAGE ADAPTS / TOKENS EDIT') return phrase;
    }
    return '';
  }), { timeout: 3_500 }).toBe('LANGUAGE ADAPTS / TOKENS EDIT');
  await expect(field.locator('canvas')).toHaveCount(1);
});

test('mobile archives prioritize titles over decorative thumbnails', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout assertion');
  await page.goto('/papers/');
  const art = page.locator('.card-art').first();
  const box = await art.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeLessThanOrEqual(96);
});

test('mobile archive topics wrap without clipping or page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/papers/');

  const topicLayout = await page.locator('.filter-tags').evaluate((rail) => {
    const buttons = [...rail.querySelectorAll('button')];
    return {
      clientWidth: rail.clientWidth,
      scrollWidth: rail.scrollWidth,
      rows: new Set(buttons.map((button) => Math.round(button.getBoundingClientRect().top))).size,
      minimumButtonHeight: Math.min(...buttons.map((button) => button.getBoundingClientRect().height)),
    };
  });
  expect(topicLayout.scrollWidth).toBeLessThanOrEqual(topicLayout.clientWidth + 1);
  expect(topicLayout.rows).toBeGreaterThan(1);
  expect(topicLayout.minimumButtonHeight).toBeGreaterThanOrEqual(38);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth + 1),
  );
});

test('mobile archive cards reserve the full row for readable copy', async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ['/papers/', '/models/']) {
      await page.goto(path);
      const card = page.locator('.content-card').first();
      const copy = card.locator('.card-copy');
      const [cardBox, copyBox] = await Promise.all([card.boundingBox(), copy.boundingBox()]);
      expect(cardBox, `${path} card at ${width}px`).not.toBeNull();
      expect(copyBox, `${path} copy at ${width}px`).not.toBeNull();
      expect(copyBox!.width / cardBox!.width, `${path} copy measure at ${width}px`).toBeGreaterThanOrEqual(0.85);
      expect(copyBox!.y, `${path} copy should follow its compact art band at ${width}px`).toBeGreaterThan(cardBox!.y);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        await page.evaluate(() => document.documentElement.clientWidth + 1),
      );
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/papers/');
  const title = page.locator('.content-card h2').first();
  const titleLines = await title.evaluate((element) => {
    const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
    return element.getBoundingClientRect().height / lineHeight;
  });
  expect(titleLines).toBeLessThanOrEqual(4.1);
});

test('related research spans the full desktop detail grid', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/papers/llada-2-0/');

  const [proseBox, relatedBox] = await Promise.all([
    page.locator('.prose').boundingBox(),
    page.locator('.related').boundingBox(),
  ]);
  expect(proseBox).not.toBeNull();
  expect(relatedBox).not.toBeNull();
  expect(relatedBox!.width).toBeGreaterThan(proseBox!.width * 1.4);
});

test('token artwork link exposes its visible mask token in the accessible name', async ({ page }) => {
  await page.goto('/papers/');
  await expect(page.locator('.card-art').first()).toHaveAccessibleName(/\[MASK\]/);
});

test('archive token index meets WCAG AA contrast on generated artwork', async ({ page }) => {
  await page.goto('/blog/');
  const contrast = await page.locator('.token-index').first().evaluate((element) => {
    const channels = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const luminance = (value: string) => {
      const linear = channels(value).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const foreground = luminance(getComputedStyle(element).color);
    const background = luminance(getComputedStyle(element.closest('.token-art')!).backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test('footer links and copyright text meet WCAG AA contrast', async ({ page }) => {
  await page.goto('/');
  const contrasts = await page.locator('.footer-nav a, .site-footer small').evaluateAll((elements) => elements.map((element) => {
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
  }));
  expect(contrasts.every((contrast) => contrast >= 4.5)).toBe(true);
});

test('citation live status meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/papers/llada-2-0/');
  const contrast = await page.locator('.copy-status').evaluate((element) => {
    const channels = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const luminance = (value: string) => {
      const linear = channels(value).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const foreground = luminance(getComputedStyle(element).color);
    const background = luminance(getComputedStyle(element.closest('.citation')!).backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test('program navigation uses three desktop columns and three mobile rows', async ({ page, isMobile }) => {
  await page.goto('/');
  const entries = page.locator('[data-program-link]');
  await expect(entries).toHaveCount(3);
  const boxes = await Promise.all(Array.from({ length: 3 }, (_, index) => entries.nth(index).boundingBox()));
  expect(boxes.every(Boolean)).toBe(true);

  if (isMobile) {
    expect(boxes[0]!.y).toBeLessThan(boxes[1]!.y);
    expect(boxes[1]!.y).toBeLessThan(boxes[2]!.y);
    expect(Math.abs(boxes[0]!.x - boxes[1]!.x)).toBeLessThan(2);
  } else {
    expect(Math.abs(boxes[0]!.y - boxes[1]!.y)).toBeLessThan(2);
    expect(boxes[0]!.x).toBeLessThan(boxes[1]!.x);
    expect(Math.abs(boxes[1]!.y - boxes[2]!.y)).toBeLessThan(2);
    expect(boxes[1]!.x).toBeLessThan(boxes[2]!.x);
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('supporting pages share the light visual system', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(247, 248, 243)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(36, 49, 43)');
  }
});

test('archive entries are flat ruled rows on the page surface', async ({ page }) => {
  await page.goto('/papers/');
  const row = page.locator('.content-card').first();
  await expect(row).toHaveCSS('box-shadow', 'none');
  await expect(row).toHaveCSS('border-radius', '0px');
  await expect(row).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('active archive filter keeps accessible contrast on hover and keyboard focus', async ({ page }) => {
  await page.goto('/papers/');
  const activeFilter = page.getByRole('button', { name: 'All', exact: true });
  const colors = async () => activeFilter.evaluate((element) => {
    const style = getComputedStyle(element);
    const channels = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const luminance = (value: string) => {
      const linear = channels(value).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const foreground = luminance(style.color);
    const background = luminance(style.backgroundColor);
    return {
      background: style.backgroundColor,
      color: style.color,
      contrast: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05),
    };
  });

  await activeFilter.hover();
  const hovered = await colors();
  expect(hovered.background).toBe('rgb(82, 122, 104)');
  expect(hovered.color).toBe('rgb(247, 248, 243)');
  expect(hovered.contrast).toBeGreaterThanOrEqual(4.5);

  await page.mouse.move(0, 0);
  await activeFilter.focus();
  const focused = await colors();
  expect(focused.background).toBe('rgb(82, 122, 104)');
  expect(focused.color).toBe('rgb(247, 248, 243)');
  expect(focused.contrast).toBeGreaterThanOrEqual(4.5);
});

test('editorial type roles and touch targets follow the shared system', async ({ page }) => {
  await page.goto('/models/');

  const metrics = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const title = getComputedStyle(document.querySelector<HTMLElement>('.content-card h2')!);
    const summary = getComputedStyle(document.querySelector<HTMLElement>('.content-card .card-copy > p')!);
    const metadata = getComputedStyle(document.querySelector<HTMLElement>('.card-meta')!);
    const filter = document.querySelector<HTMLButtonElement>('[data-filter-tag]')!.getBoundingClientRect();

    return {
      bodySize: Number.parseFloat(body.fontSize),
      titleSize: Number.parseFloat(title.fontSize),
      summarySize: Number.parseFloat(summary.fontSize),
      metadataSize: Number.parseFloat(metadata.fontSize),
      metadataTracking: Number.parseFloat(metadata.letterSpacing) / Number.parseFloat(metadata.fontSize),
      filterHeight: filter.height,
      textBodyToken: root.getPropertyValue('--text-body').trim(),
      spaceSixToken: root.getPropertyValue('--space-6').trim(),
    };
  });

  expect(metrics.bodySize).toBeGreaterThanOrEqual(16);
  expect(metrics.titleSize).toBeGreaterThan(metrics.summarySize);
  expect(metrics.metadataSize).toBeGreaterThanOrEqual(12);
  expect(metrics.metadataTracking).toBeLessThanOrEqual(0.1);
  expect(metrics.filterHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.textBodyToken).toBe('1rem');
  expect(metrics.spaceSixToken).toBe('3rem');
});

test('primary content routes are reachable', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/']) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
  }
});

test('paper archive exposes exactly the official InclusionAI publications', async ({ page }) => {
  await page.goto('/papers/');

  const cards = page.locator('[data-filter-card]');
  await expect(cards).toHaveCount(6);
  const expectedTitles = [
    'LLaDA2.0: Scaling Up Diffusion Language Models to 100B',
    'LLaDA2.1: Speeding Up Text Diffusion via Token Editing',
    'LLaDA2.2: Enabling Agentic Diffusion Language Models via Levenshtein Editing',
    'LLaDA2.0-Uni: Unifying Multimodal Understanding and Generation with Diffusion Large Language Model',
    'LLaDA-MoE: A Sparse MoE Diffusion Language Model',
    'LLaDA MoE v2: Scaling Mixture-of-Experts Diffusion Language Models',
  ];
  const titles = await cards.locator('h2').allTextContents();
  expect(titles.toSorted()).toEqual(expectedTitles.toSorted());
});

test('official InclusionAI paper detail routes are reachable', async ({ page }) => {
  for (const path of [
    '/papers/llada-2-0/',
    '/papers/llada-2-1/',
    '/papers/llada-2-2/',
    '/papers/llada-2-0-uni/',
    '/papers/llada-moe-v2/',
    '/papers/llada-moe/',
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

test('model archive exposes six concrete models with InclusionAI participation', async ({ page }) => {
  await page.goto('/models/');

  const cards = page.locator('[data-filter-card]');
  await expect(cards).toHaveCount(6);
  const expectedTitles = [
    'LLaDA2.0',
    'LLaDA2.1',
    'LLaDA2.2',
    'LLaDA MoE v2',
    'LLaDA2.0-Uni',
    'LLaDA-MoE 7B-A1B',
  ];
  const titles = await cards.locator('h2').allTextContents();
  expect(titles.toSorted()).toEqual(expectedTitles.toSorted());
});

test('model detail routes with InclusionAI participation are reachable', async ({ page }) => {
  for (const path of [
    '/models/llada-moe-7b-a1b/',
    '/models/llada-2-0/',
    '/models/llada-2-1/',
    '/models/llada-2-2/',
    '/models/llada-moe-v2/',
    '/models/llada-2-0-uni/',
  ]) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
  }
});

test('model detail pages enumerate checkpoint releases', async ({ page }) => {
  const cases = [
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
  await expect(cards).toHaveCount(6);
  await page.getByRole('searchbox').fill('multimodal');
  await expect(page.locator('[data-filter-card]:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('[data-filter-card]:visible')).toHaveCount(6);
});

test('excluded research routes return 404', async ({ page }) => {
  for (const path of [
    '/models/illada-8b/',
    '/models/llada-8b/',
    '/models/llada-1-5/',
    '/models/llada-2-x/',
    '/papers/improved-large-language-diffusion-models/',
    '/papers/large-language-diffusion-models/',
    '/papers/llada-1-5/',
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible();
  }
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
