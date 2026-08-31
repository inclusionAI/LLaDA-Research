import { expect, test } from '@playwright/test';

test('homepage presents a focused research proposition and three-layer index', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await expect(page.getByLabel('Open navigation')).toBeVisible();
  } else {
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  }

  await expect(page.getByRole('heading', { name: 'Beyond next-token prediction.', exact: true })).toBeVisible();
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
  expect(await programLinks.count()).toBe(2);
  expect(await programLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/models/',
    '/papers/',
  ]);
  expect(await programLinks.locator('.program-title').allTextContents()).toEqual(['Models', 'Publications']);
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

test('site uses the official InclusionAI browser icon', async ({ page }) => {
  await page.goto('/');

  const favicon = page.locator('link[rel="icon"]');
  await expect(favicon).toHaveAttribute('type', 'image/png');
  await expect(favicon).toHaveAttribute('href', 'https://www.inclusion-ai.org/img/favicon.png');
});

test('hero CTA uses an arrow cue without any underline decoration', async ({ page }) => {
  await page.goto('/');

  const heroLink = page.locator('.hero-links a').first();
  const label = heroLink.locator('.hero-link-label');
  const arrow = heroLink.locator('.hero-link-arrow');
  await expect(label).toBeVisible();
  const labelMetrics = await label.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontSize: Number.parseFloat(style.fontSize),
      height: element.getBoundingClientRect().height,
      overflow: style.overflow,
      position: style.position,
      zIndex: style.zIndex,
    };
  });
  expect(labelMetrics.height - labelMetrics.fontSize).toBeGreaterThanOrEqual(8);
  expect(labelMetrics).toMatchObject({ overflow: 'visible', position: 'relative', zIndex: '1' });
  const decoration = await heroLink.evaluate((element) => ({
    borderWidth: getComputedStyle(element).borderBottomWidth,
    pseudoContent: getComputedStyle(element, '::after').content,
    textDecorationLine: getComputedStyle(element).textDecorationLine,
  }));
  expect(decoration).toEqual({
    borderWidth: '0px',
    pseudoContent: 'none',
    textDecorationLine: 'none',
  });
  await expect(arrow).toHaveCSS('transform', 'none');

  await heroLink.hover();
  await expect(arrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 2, -2)');

  await page.mouse.move(0, 0);
  await expect(arrow).toHaveCSS('transform', 'none');
  await heroLink.focus();
  await expect(arrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 2, -2)');
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
  /* unified scale: section titles and entry titles share the 32px step */
  expect(Math.abs(sectionTitle - workTitle)).toBeLessThanOrEqual(1);
  const sectionTitleWeight = await page.locator('.selected-work h2').first().evaluate((element) => (
    Number.parseInt(getComputedStyle(element).fontWeight, 10)
  ));
  const workTitleWeight = await page.locator('.work-copy h3').first().evaluate((element) => (
    Number.parseInt(getComputedStyle(element).fontWeight, 10)
  ));
  expect(sectionTitleWeight).toBeGreaterThanOrEqual(workTitleWeight);
  expect(await fontSize('.desktop-nav a')).toBeGreaterThanOrEqual(12);

  await page.goto('/models/');
  expect(await fontSize('.content-card h2')).toBeGreaterThanOrEqual(24);
  expect(await fontSize('.content-card .card-copy > p')).toBeGreaterThanOrEqual(15);
  expect(await fontSize('.card-meta')).toBeGreaterThanOrEqual(11);

  await page.goto('/models/llada-2-2/');
  expect(await fontSize('.content-summary')).toBeGreaterThanOrEqual(18);
  expect(await fontSize('.prose')).toBeGreaterThanOrEqual(17);

  await page.goto('/about/');
  expect(await fontSize('.button')).toBeGreaterThanOrEqual(12);
  expect(await fontSize('.about-copy > p')).toBeGreaterThanOrEqual(14);
});

test('editorial type roles use loaded self-hosted fonts and restrained spacing', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(async () => {
    await document.fonts.ready;
    const style = (selector: string) => getComputedStyle(document.querySelector<HTMLElement>(selector)!);
    const ratio = (value: string, fontSize: string) => Number.parseFloat(value) / Number.parseFloat(fontSize);
    const firstFamily = (value: string) => value.split(',')[0]!.trim().replaceAll('"', '');
    const families = [...document.fonts].map((face) => face.family.replaceAll('"', ''));
    const body = style('body');
    const heading = style('.hero-copy h1');
    const metadata = style('.hero-kicker');
    const fontResources = performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((name) => /\.(?:woff2?|ttf)(?:\?|$)/.test(name));

    return {
      families,
      bodyFamily: firstFamily(body.fontFamily),
      headingFamily: firstFamily(heading.fontFamily),
      metadataFamily: firstFamily(metadata.fontFamily),
      bodyLeading: ratio(body.lineHeight, body.fontSize),
      metadataTracking: ratio(metadata.letterSpacing, metadata.fontSize),
      heroTracking: ratio(heading.letterSpacing, heading.fontSize),
      fontSynthesis: body.fontSynthesis,
      fontResources,
      origin: location.origin,
    };
  });

  expect(metrics.families).toContain('Inter Variable');
  expect(metrics.families).toContain('Source Serif 4 Variable');
  expect(metrics.families).toContain('IBM Plex Mono');
  expect(metrics.bodyFamily).toBe('Inter Variable');
  expect(metrics.headingFamily).toBe('Source Serif 4 Variable');
  expect(metrics.metadataFamily).toBe('IBM Plex Mono');
  expect(metrics.bodyLeading).toBeGreaterThanOrEqual(1.55);
  expect(metrics.bodyLeading).toBeLessThanOrEqual(1.7);
  expect(metrics.metadataTracking).toBeLessThanOrEqual(0.065);
  expect(metrics.heroTracking).toBeGreaterThanOrEqual(-0.045);
  expect(metrics.fontSynthesis).toBe('none');
  expect(metrics.fontResources.length).toBeGreaterThanOrEqual(3);
  expect(metrics.fontResources.every((url) => new URL(url).origin === metrics.origin)).toBe(true);
});

test('homepage presents restrained selected work and program navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText(
    'LLaDA is a family of diffusion language models exploring how language and multimodal intelligence emerge through iterative denoising rather than autoregressive prediction.',
    { exact: true },
  )).toBeVisible();
  const selectedWork = page.getByRole('region', { name: 'Recent publications' });
  await expect(selectedWork.locator('[data-selected-work]')).toHaveCount(2);
  await expect(selectedWork.getByText('Technical Report', { exact: true })).toBeVisible();
  await expect(selectedWork.getByText('arXiv', { exact: true })).toBeVisible();
  await expect(page.getByText('Explore', { exact: true })).toBeVisible();
  await expect(page.getByText('Open checkpoints and release details.', { exact: true })).toBeVisible();
  await expect(page.getByText('Methods, results, and technical reports.', { exact: true })).toBeVisible();
});

test('selected work keeps its internal rules without a second heavy section rule', async ({ page }) => {
  await page.goto('/');

  const rules = await page.evaluate(() => {
    const section = document.querySelector('.selected-work');
    const header = section?.querySelector('.section-header');
    const rows = [...(section?.querySelectorAll('li') ?? [])];
    const links = [...(section?.querySelectorAll<HTMLElement>('[data-selected-work]') ?? [])];
    const program = document.querySelector('.program-nav');
    const programHeading = program?.querySelector('h2');
    if (!header || rows.length < 2 || links.length < 2 || !program || !programHeading) {
      throw new Error('Homepage section structure is incomplete.');
    }

    return {
      headerRule: getComputedStyle(header).borderBottomWidth,
      internalRule: getComputedStyle(rows[0]).borderBottomWidth,
      trailingRule: getComputedStyle(rows.at(-1)!).borderBottomWidth,
      programRule: getComputedStyle(program).borderTopWidth,
      sectionGap: programHeading.getBoundingClientRect().top - links.at(-1)!.getBoundingClientRect().bottom,
    };
  });

  expect(rules.headerRule).toBe('1px');
  expect(rules.internalRule).toBe('1px');
  expect(rules.trailingRule).toBe('0px');
  expect(rules.programRule).toBe('0px');
  expect(rules.sectionGap).toBeGreaterThanOrEqual(64);
  expect(rules.sectionGap).toBeLessThanOrEqual(128);
});

test('homepage content uses contribution-first copy', async ({ page }) => {
  await page.goto('/');

  const selectedWork = page.locator('[data-selected-work]');
  await expect(selectedWork.nth(0).getByText(
    'Enables agentic diffusion generation via Levenshtein editing',
  )).toBeVisible();
  await expect(selectedWork.nth(1).getByText(
    'A unified multimodal diffusion model that integrates visual understanding',
  )).toBeVisible();

  await page.goto('/papers/');
  await expect(page.getByText(
    'Introduces token editing to accelerate text diffusion',
  )).toBeVisible();
  await expect(page.getByText(
    'Scales discrete diffusion language models to 100B parameters',
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
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(23, 25, 28)');
  await expect(page.locator('#hero-title')).toHaveCSS('color', 'rgb(23, 25, 28)');
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
  await expect(navigation.getByRole('link', { name: 'Papers', exact: true })).toHaveCount(0);
  await expect(navigation.getByRole('link', { name: 'Blog', exact: true })).toHaveCount(0);
  await expect(navigation.getByRole('link', { name: 'Notes', exact: true })).toHaveAttribute('href', '/blog/');
});

test('publication labels are consistent across recovery pages', async ({ page }) => {
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
  await expect(menu).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(menu).toHaveCSS('box-shadow', 'none');
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
      const hasArt = await card.locator('.card-art').count();
      if (hasArt > 0) {
        expect(copyBox!.y, `${path} copy should follow its compact art band at ${width}px`).toBeGreaterThan(cardBox!.y);
      } else {
        expect(copyBox!.y, `${path} copy starts at card top at ${width}px`).toBeGreaterThanOrEqual(cardBox!.y);
      }
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
  expect(relatedBox!.width).toBeGreaterThanOrEqual(proseBox!.width * 0.9);
});

test('detail editorial hierarchy keeps long-form reading roles distinct', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/papers/llada-2-0/');

  const metrics = await page.evaluate(() => {
    const style = (selector: string) => getComputedStyle(document.querySelector<HTMLElement>(selector)!);
    const size = (selector: string) => Number.parseFloat(style(selector).fontSize);
    const lineRatio = (selector: string) => (
      Number.parseFloat(style(selector).lineHeight) / Number.parseFloat(style(selector).fontSize)
    );
    const title = style('.content-header h1');

    return {
      title: size('.content-header h1'),
      summary: size('.content-summary'),
      prose: size('.prose'),
      metadata: size('.content-meta'),
      titleTracking: Math.abs(Number.parseFloat(title.letterSpacing) / Number.parseFloat(title.fontSize)),
      summaryLineRatio: lineRatio('.content-summary'),
      proseMeasure: document.querySelector<HTMLElement>('.prose')!.getBoundingClientRect().width,
      resourceHeight: document.querySelector<HTMLElement>('.resource-link')!.getBoundingClientRect().height,
    };
  });

  expect(metrics.title).toBeGreaterThan(metrics.summary);
  expect(metrics.summary).toBeGreaterThan(metrics.prose);
  expect(metrics.prose).toBeGreaterThanOrEqual(16);
  expect(metrics.metadata).toBeGreaterThanOrEqual(12);
  expect(metrics.titleTracking).toBeLessThanOrEqual(0.04);
  expect(metrics.summaryLineRatio).toBeGreaterThanOrEqual(1.7);
  expect(metrics.proseMeasure).toBeLessThanOrEqual(704);
  expect(metrics.resourceHeight).toBeGreaterThanOrEqual(44);
});

test('long detail titles keep an editorial measure on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/papers/llada-2-2/');

  const title = await page.locator('.content-header h1').evaluate((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    const lineHeight = Number.parseFloat(style.lineHeight);
    return {
      fontSize: Number.parseFloat(style.fontSize),
      lineCount: box.height / lineHeight,
    };
  });

  expect(title.fontSize).toBeGreaterThanOrEqual(20);
  expect(title.lineCount).toBeLessThanOrEqual(6);
});

test('brand links meet the global touch-target minimum', async ({ page }) => {
  await page.goto('/models/');
  const targets = await page.locator(
    '.brand:visible, .desktop-nav > a:visible, .content-card h2 a:visible, .compact .resource-link:visible',
  ).evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect();
    return { width: box.width, height: box.height };
  }));
  expect(targets.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
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
    const resolveBackground = (el: Element): string => {
      let node: Element | null = el;
      while (node) {
        const color = getComputedStyle(node).backgroundColor;
        if (color && !color.startsWith('rgba(0, 0, 0, 0') && color !== 'transparent') return color;
        node = node.parentElement;
      }
      return 'rgb(255, 255, 255)';
    };
    const foreground = luminance(getComputedStyle(element).color);
    const background = luminance(resolveBackground(element));
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test('program navigation uses two desktop columns and two mobile rows', async ({ page, isMobile }) => {
  await page.goto('/');
  const entries = page.locator('[data-program-link]');
  await expect(entries).toHaveCount(2);
  const boxes = await Promise.all(Array.from({ length: 2 }, (_, index) => entries.nth(index).boundingBox()));
  expect(boxes.every(Boolean)).toBe(true);

  if (isMobile) {
    expect(boxes[0]!.y).toBeLessThan(boxes[1]!.y);
    expect(Math.abs(boxes[0]!.x - boxes[1]!.x)).toBeLessThan(2);
  } else {
    expect(Math.abs(boxes[0]!.y - boxes[1]!.y)).toBeLessThan(2);
    expect(boxes[0]!.x).toBeLessThan(boxes[1]!.x);
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('homepage editorial hierarchy separates labels, sections, entries, and supporting copy', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(() => {
    const size = (selector: string) => Number.parseFloat(
      getComputedStyle(document.querySelector<HTMLElement>(selector)!).fontSize,
    );
    const tracking = (selector: string) => {
      const style = getComputedStyle(document.querySelector<HTMLElement>(selector)!);
      return Number.parseFloat(style.letterSpacing) / Number.parseFloat(style.fontSize);
    };

    return {
      hero: size('.hero-copy h1'),
      heroSummary: size('.hero-summary'),
      heroKicker: size('.hero-kicker'),
      heroKickerTracking: tracking('.hero-kicker'),
      section: size('.selected-work h2'),
      item: size('.selected-work h3'),
      summary: size('.selected-work .work-copy p'),
      metadata: size('.selected-work .work-meta'),
      programTitle: size('.program-title'),
      programDescription: size('.program-description'),
    };
  });

  expect(metrics.hero).toBeGreaterThan(metrics.section);
  /* unified scale: section title and entry title share the same step */
  expect(Math.abs(metrics.section - metrics.item)).toBeLessThanOrEqual(1);
  expect(metrics.item).toBeGreaterThan(metrics.summary);
  expect(metrics.summary).toBeGreaterThan(metrics.metadata);
  expect(metrics.heroSummary).toBeGreaterThan(metrics.heroKicker);
  expect(metrics.heroKicker).toBeGreaterThanOrEqual(12);
  expect(metrics.heroKickerTracking).toBeLessThanOrEqual(0.1);
  expect(metrics.programTitle).toBeGreaterThan(metrics.programDescription);
});

test('supporting pages share the light visual system', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(23, 25, 28)');
  }
});

test('editorial type roles and touch targets follow the shared system', async ({ page }) => {
  await page.goto('/models/');

  const metrics = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const title = getComputedStyle(document.querySelector<HTMLElement>('.content-card h2')!);
    const summary = getComputedStyle(document.querySelector<HTMLElement>('.content-card .card-copy > p')!);
    const metadata = getComputedStyle(document.querySelector<HTMLElement>('.card-meta')!);

    return {
      bodySize: Number.parseFloat(body.fontSize),
      titleSize: Number.parseFloat(title.fontSize),
      summarySize: Number.parseFloat(summary.fontSize),
      metadataSize: Number.parseFloat(metadata.fontSize),
      metadataTracking: Number.parseFloat(metadata.letterSpacing) / Number.parseFloat(metadata.fontSize),
      textBodyToken: root.getPropertyValue('--text-body').trim(),
      spaceSixToken: root.getPropertyValue('--space-6').trim(),
      mobileHeroToken: root.getPropertyValue('--text-hero-mobile').trim(),
    };
  });

  expect(metrics.bodySize).toBeGreaterThanOrEqual(16);
  expect(metrics.titleSize).toBeGreaterThan(metrics.summarySize);
  expect(metrics.metadataSize).toBeGreaterThanOrEqual(12);
  expect(metrics.metadataTracking).toBeLessThanOrEqual(0.1);
  expect(metrics.textBodyToken).toBe('1rem');
  expect(metrics.spaceSixToken).toBe('3rem');
  expect(metrics.mobileHeroToken).toBe('clamp(2rem, 9vw, 2.75rem)');
});

test('primary content routes are reachable', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/']) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBeTruthy();
  }
});

test('paper archive exposes exactly the publications with InclusionAI participation', async ({ page }) => {
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

test('paper detail routes with InclusionAI participation are reachable', async ({ page }) => {
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

test('research detail metadata states participating organizations', async ({ page }) => {
  for (const path of ['/models/llada-moe-v2/', '/papers/llada-moe-v2/']) {
    await page.goto(path);
    await expect(page.locator('.content-meta')).toContainText('Research with InclusionAI');
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
