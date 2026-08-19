import { expect, test } from '@playwright/test';

test('homepage exposes featured, models, papers, and blog content', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await expect(page.getByLabel('Open navigation')).toBeVisible();
  } else {
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  }
  await expect(page.getByText(/featured paper/i).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Papers', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
});

test('primary content routes are reachable', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/']) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBeTruthy();
    await expect(page.locator('h1')).toBeVisible();
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
