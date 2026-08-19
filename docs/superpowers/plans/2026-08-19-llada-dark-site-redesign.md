# LLaDA Dark Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current pale card-based design with an immersive black LLaDA research site whose compact homepage combines an interactive Mask-to-Token diffusion field, a slim featured strip, and immediately scannable Models, Papers, and Blog research lists.

**Architecture:** Keep Astro content collections and routing unchanged. Add a focused `DenoiseField` Canvas component and `ResearchHero` semantic wrapper, convert existing components to ruled editorial layouts, and centralize the dark visual system in global/content CSS. Behavioral requirements are covered by Playwright and unit tests before implementation; CSS and Canvas details are verified through screenshots, motion-mode tests, both base-path builds, and Lighthouse.

**Tech Stack:** Astro 7, TypeScript, Canvas 2D, MDX content collections, Vitest, Playwright, Lighthouse CI.

---

## File structure

- Create `src/components/DenoiseField.astro`: decorative Canvas, static fallback, pointer/touch decoding, adaptive density, reduced-motion behavior.
- Create `src/components/ResearchHero.astro`: semantic copy and positioning for the 55vh hero.
- Create `src/lib/particle-field.ts`: testable density and token-stage helpers used by Canvas.
- Create `tests/particle-field.test.ts`: unit coverage for adaptive density and Mask-to-Token staging.
- Modify `src/components/FeaturedRelease.astro`: replace oversized card with the 47px editorial strip.
- Modify `src/components/ResearchColumn.astro`: kind-specific metadata and ruled entries.
- Modify `src/pages/index.astro`: compact hero → featured strip → research index composition.
- Modify `src/layouts/BaseLayout.astro`: dark navigation/footer and theme metadata.
- Modify `src/styles/global.css`: global dark tokens, navigation, archives, controls, footer, responsive/reduced-motion rules.
- Modify `src/styles/content.css`: dark long-form reading and side-panel styling.
- Modify existing archive/support components only where their local styles override global dark surfaces.
- Modify `tests/site.spec.ts`: homepage hierarchy, Canvas fallback, reduced motion, mobile behavior, supporting-page consistency.

### Task 1: Lock homepage behavior with failing E2E tests

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Write failing homepage structure and style tests**

Add tests that assert the new semantic contract:

```ts
test('homepage presents the LLaDA diffusion hero before a compact research index', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Language, diffused.' })).toBeVisible();
  await expect(page.locator('[data-denoise-field]')).toBeVisible();
  await expect(page.locator('[data-featured-strip]')).toHaveCSS('min-height', '47px');
  await expect(page.locator('[data-research-index]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Papers', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
});

test('homepage uses the dark research theme', async ({ page }) => {
  await page.goto('/');
  const background = await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor);
  expect(background).toBe('rgb(3, 3, 3)');
  await expect(page.locator('[data-featured-strip]')).toHaveCSS('border-radius', '0px');
});
```

- [ ] **Step 2: Write failing accessibility/fallback tests**

Add:

```ts
test('denoise field has a designed reduced-motion state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-denoise-field]')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('[data-static-token-field]')).toBeVisible();
});

test('supporting pages share the dark visual system', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(3, 3, 3)');
  }
});
```

- [ ] **Step 3: Run tests and verify RED**

Run: `npx playwright test tests/site.spec.ts --project=desktop`

Expected: FAIL because `Language, diffused.`, `data-denoise-field`, `data-featured-strip`, and the black theme do not exist.

- [ ] **Step 4: Commit the failing contract**

```bash
git add tests/site.spec.ts
git commit -m "test: define dark LLaDA homepage experience"
```

### Task 2: Implement testable particle-field logic

**Files:**
- Create: `tests/particle-field.test.ts`
- Create: `src/lib/particle-field.ts`

- [ ] **Step 1: Write failing unit tests**

```ts
import { describe, expect, it } from 'vitest';
import { densityForFps, tokenStageForInfluence } from '../src/lib/particle-field';

describe('densityForFps', () => {
  it('keeps full density for smooth animation and degrades for slow devices', () => {
    expect(densityForFps(60, 1)).toBe(1);
    expect(densityForFps(42, 1)).toBe(0.78);
    expect(densityForFps(25, 1)).toBe(0.55);
  });

  it('never increases density above the current adaptive value', () => {
    expect(densityForFps(60, 0.55)).toBe(0.55);
  });
});

describe('tokenStageForInfluence', () => {
  it('progresses from noise to mask to partial and resolved token', () => {
    expect(tokenStageForInfluence(0.1)).toBe('noise');
    expect(tokenStageForInfluence(0.35)).toBe('mask');
    expect(tokenStageForInfluence(0.62)).toBe('partial');
    expect(tokenStageForInfluence(0.9)).toBe('resolved');
  });
});
```

- [ ] **Step 2: Run unit test and verify RED**

Run: `npx vitest run tests/particle-field.test.ts`

Expected: FAIL because `src/lib/particle-field.ts` does not exist.

- [ ] **Step 3: Implement minimal deterministic helpers**

Create exports with these exact rules:

```ts
export type TokenStage = 'noise' | 'mask' | 'partial' | 'resolved';

export function densityForFps(fps: number, current: number): number {
  const target = fps < 32 ? 0.55 : fps < 48 ? 0.78 : 1;
  return Math.min(current, target);
}

export function tokenStageForInfluence(influence: number): TokenStage {
  if (influence >= 0.78) return 'resolved';
  if (influence >= 0.52) return 'partial';
  if (influence >= 0.24) return 'mask';
  return 'noise';
}
```

- [ ] **Step 4: Run unit test and verify GREEN**

Run: `npx vitest run tests/particle-field.test.ts`

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/particle-field.test.ts src/lib/particle-field.ts
git commit -m "feat: add adaptive diffusion field logic"
```

### Task 3: Build the semantic hero and Canvas field

**Files:**
- Create: `src/components/DenoiseField.astro`
- Create: `src/components/ResearchHero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Implement the Canvas structure and static fallback**

`DenoiseField.astro` must render:

```astro
<div class="denoise-field" data-denoise-field data-motion="full" aria-hidden="true">
  <canvas></canvas>
  <div class="static-token-field" data-static-token-field>
    <span>[MASK]</span><span>La</span><span>[ · ]</span><span>DA</span><span>language</span>
  </div>
</div>
```

The inline module imports `densityForFps` and `tokenStageForInfluence`, initializes particles in a right-offset ellipse without a closed circular silhouette, handles `pointermove`, and changes local glyphs through noise → mask → partial → resolved stages. It tracks rolling frame intervals every 120 frames and lowers particle count with `densityForFps`. It sets `data-motion="reduced"` when `matchMedia('(prefers-reduced-motion: reduce)')` matches and does not start the animation loop in that case.

- [ ] **Step 2: Implement `ResearchHero`**

Render semantic HTML copy over the field:

```astro
<section class="research-hero shell" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="hero-kicker">Discrete diffusion language models</p>
    <h1 id="hero-title">Language,<br />diffused.</h1>
    <p>From masked noise to language, decoded in parallel.</p>
  </div>
  <DenoiseField />
</section>
```

Use component-scoped CSS for the 55vh minimum/maximum balance, right-offset field, mobile height, and negative-space composition.

- [ ] **Step 3: Replace homepage featured hero with `ResearchHero`**

Update imports and render order in `src/pages/index.astro`:

```astro
<BaseLayout>
  <ResearchHero />
  {featured && <FeaturedRelease entry={featured} />}
  <section class="research-index shell" data-research-index aria-labelledby="research-index-title">
```

- [ ] **Step 4: Run focused E2E and unit tests**

Run: `npx vitest run tests/particle-field.test.ts && npx playwright test tests/site.spec.ts --project=desktop -g 'diffusion hero|reduced-motion'`

Expected: particle unit tests pass; hero and reduced-motion E2E tests proceed to remaining style failures rather than missing-element failures.

- [ ] **Step 5: Commit**

```bash
git add src/components/DenoiseField.astro src/components/ResearchHero.astro src/pages/index.astro
git commit -m "feat: add interactive Mask-to-Token hero"
```

### Task 4: Convert featured content and research columns to editorial rows

**Files:**
- Modify: `src/components/FeaturedRelease.astro`
- Modify: `src/components/ResearchColumn.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace featured card with the compact strip**

Remove the cover art and resource-button layout. Keep selected entry routing and render one full-row link with `data-featured-strip`, label, kind, title, date, and arrow. CSS must use `min-height: 47px`, `border-radius: 0`, top/bottom rules, no background fill, and a 4–6px title translation on hover.

- [ ] **Step 2: Add kind-specific metadata to research columns**

Keep the existing prop interface and define:

```ts
const metaFor = (entry: Entry) => {
  if (kind === 'model') return entry.data.modality ?? 'Model';
  if (kind === 'paper') return entry.data.venue ?? 'Paper';
  return entry.data.category ?? 'Field note';
};
```

Render ruled list entries with metadata, title, two-line summary, and directional arrow. Remove card background, radius, and shadow. Keep vertical rules between desktop columns at the page-grid level.

- [ ] **Step 3: Compact the homepage index heading**

Reduce heading size to 18–22 pixels, remove the large marketing sentence, and use an editorial header row labeled `Research index` plus `Models / Papers / Notes`.

- [ ] **Step 4: Run homepage E2E tests and verify GREEN**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'homepage'`

Expected: homepage hierarchy and compact strip tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/FeaturedRelease.astro src/components/ResearchColumn.astro src/pages/index.astro
git commit -m "feat: add compact editorial research index"
```

### Task 5: Apply the dark visual system across layouts and supporting components

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `src/styles/content.css`
- Modify: `src/components/ArchiveFilter.astro`
- Modify: `src/components/ContentCard.astro`
- Modify: `src/components/RelatedContent.astro`
- Modify: `src/components/ResourceLinks.astro`
- Modify: `src/components/CitationCopy.astro`

- [ ] **Step 1: Replace global tokens and chrome**

Use these base values:

```css
:root {
  --ink: #f1f1ec;
  --ink-soft: #c3c3bd;
  --muted: #787873;
  --paper: #030303;
  --surface: #080808;
  --surface-soft: #0d0d0c;
  --line: #242421;
  --line-strong: #3a3a36;
  --accent: #f1f1ec;
  --accent-deep: #ffffff;
  --accent-soft: #171715;
  --night: #030303;
}
```

Set `body` to `background-color: rgb(3 3 3)` with no blue radial wash. Restyle header, nav, brand, controls, tags, page intros, footer, mobile menu, archive lists, and resource panels with compact rules and neutral colors.

- [ ] **Step 2: Simplify layout markup**

Set theme color to `#030303`, replace the glowing circular brand mark with a compact mask-grid mark, and turn the GitHub button into a standard navigation link. Preserve labels, landmarks, URLs, and mobile details behavior.

- [ ] **Step 3: Convert content pages to the dark reading system**

Update `content.css` so body text uses `--ink-soft`, links use warm white underlines, code uses `#090909`, inline code uses the dark soft surface, images have small radii, and side panels use rules without pale fills.

- [ ] **Step 4: Remove component-local pale overrides**

In each listed component replace `rgb(255 255 255 / ...)`, bright blue accents, large shadows, and large radii with `var(--surface)`, `var(--line)`, warm-white hover states, and small/no radius as appropriate. Do not alter filtering, copying, resource-link, or related-content behavior.

- [ ] **Step 5: Run dark-theme and route E2E tests**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'dark visual|primary content|archive|404'`

Expected: all selected tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css src/styles/content.css src/components/ArchiveFilter.astro src/components/ContentCard.astro src/components/RelatedContent.astro src/components/ResourceLinks.astro src/components/CitationCopy.astro
git commit -m "style: unify site in dark research system"
```

### Task 6: Complete responsive, interaction, and fallback verification

**Files:**
- Modify: `tests/site.spec.ts`
- Modify: `src/components/DenoiseField.astro`
- Modify: `src/components/ResearchHero.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add a touch/pointer interaction assertion**

Add a test that dispatches pointer movement and verifies the field records interaction:

```ts
test('denoise field responds to pointer input', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-denoise-field]');
  const box = await field.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.72, box!.y + box!.height * 0.5);
  await expect(field).toHaveAttribute('data-interacting', 'true');
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'responds to pointer'`

Expected: FAIL until the field exposes `data-interacting`.

- [ ] **Step 3: Implement interaction state and mobile density**

Set `data-interacting="true"` on pointer entry/move and return it to `false` after the trail dissipates. Cap initial density on `(max-width: 700px)` and use pointer events so touch and mouse share the same code path.

- [ ] **Step 4: Run all Playwright projects**

Run: `npm run test:e2e`

Expected: desktop Chrome, mobile WebKit, and desktop WebKit all pass with no horizontal overflow.

- [ ] **Step 5: Commit**

```bash
git add tests/site.spec.ts src/components/DenoiseField.astro src/components/ResearchHero.astro src/styles/global.css
git commit -m "test: verify responsive diffusion interactions"
```

### Task 7: Production, deployment-path, visual, and performance acceptance

**Files:**
- Modify only files required by evidence from verification failures.

- [ ] **Step 1: Run unit, type, and production build checks**

Run:

```bash
npm run test:run
npm run check
npm run build
```

Expected: all unit tests pass, Astro reports 0 errors/warnings/hints, and all static routes build.

- [ ] **Step 2: Verify both GitHub Pages paths**

Run:

```bash
BASE_PATH=/ SITE_URL=https://ant-llada.github.io npm run build
BASE_PATH=/ant-llada SITE_URL=https://ulov888.github.io npm run build
```

Expected: both builds complete, and project-path output references `/ant-llada/` for internal assets and links.

- [ ] **Step 3: Capture desktop and mobile screenshots**

Run the production preview and capture `/`, `/papers/`, and one detail page at 1440×1000 and 390×844. Inspect for hero height, right-offset field, compact featured strip, visible index, coherent supporting pages, clipped text, and horizontal overflow.

- [ ] **Step 4: Run Lighthouse**

Run: `npm run test:lighthouse`

Expected: configured representative URLs meet at least 90 for Performance, Accessibility, and SEO.

- [ ] **Step 5: Run repository hygiene checks**

Run:

```bash
git diff --check
git status --short --branch
```

Expected: no whitespace errors and only intentional committed redesign changes.

- [ ] **Step 6: Commit any evidence-driven corrections**

```bash
git add <specific-fixed-files>
git commit -m "fix: polish dark site acceptance findings"
```
