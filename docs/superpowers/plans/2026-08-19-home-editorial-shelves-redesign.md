# Homepage Editorial Shelves Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's bordered research table with an editorial three-column shelf and rewrite generic copy into concise LLaDA research language.

**Architecture:** Keep the current Astro content collections and homepage data flow. Make `ResearchColumn.astro` responsible for lead-versus-compact entry presentation, keep `index.astro` responsible for shelf composition and responsive gutters, and add an optional `shortTitle` content field for compact editorial surfaces such as Latest.

**Tech Stack:** Astro 7, TypeScript, scoped CSS, Vitest, Playwright, Lighthouse CI

---

### Task 1: Lock the editorial shelf contract in browser tests

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Write failing copy and hierarchy assertions**

Add a homepage test that expects the new Hero summary, `Latest`, `The work`, `Models. Papers. Notes.`, all three column descriptions, three `[data-research-column]` elements, one lead entry per column, and compact entries where data exists.

```ts
test('homepage presents an editorial research shelf', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('LLaDA turns masked noise into language through iterative, parallel denoising—an open alternative to left-to-right generation.')).toBeVisible();
  await expect(page.getByText('Latest', { exact: true })).toBeVisible();
  await expect(page.getByText('The work', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models. Papers. Notes.' })).toBeVisible();
  await expect(page.locator('[data-research-column]')).toHaveCount(3);
  await expect(page.locator('[data-entry-kind="lead"]')).toHaveCount(3);
  await expect(page.locator('[data-entry-kind="compact"]')).toHaveCount(4);
});
```

- [ ] **Step 2: Write failing line-removal assertions**

At 1280×900, assert that the second column and its first item have zero-width left/top borders. At 390×844, assert that the second column has a one-pixel top separator while entries still have no top border.

- [ ] **Step 3: Run the focused tests**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'editorial research shelf|research shelf uses whitespace'`

Expected: FAIL because the new copy, data attributes, and whitespace hierarchy do not exist.

- [ ] **Step 4: Commit the failing tests with the implementation task**

Do not commit red tests separately; include them in Task 2's green commit.

### Task 2: Implement the editorial homepage components

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/ResearchHero.astro`
- Modify: `src/components/FeaturedRelease.astro`
- Modify: `src/components/ResearchColumn.astro`
- Modify: `src/lib/content-schema.ts`
- Modify: `src/content/papers/llada-2-2.mdx`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Replace homepage framing copy and pass descriptions to columns**

Render `The work`, `Models. Papers. Notes.`, and `The LLaDA research program, in one view.` in `index.astro`. Pass an editorial `description` and CTA label into each `ResearchColumn`.

- [ ] **Step 2: Remove the grid framing CSS**

Use a three-column grid with `gap: clamp(2.75rem, 4.5vw, 4rem)` and no border. Add 72–96px breathing room above the shelf. On mobile, stack the columns and apply a single low-contrast top separator only to sibling columns.

- [ ] **Step 3: Give each column a lead and compact hierarchy**

Map entries with their index and emit:

```astro
<li data-entry-kind={index === 0 ? 'lead' : 'compact'}>
  <a class:list={['entry-link', { lead: index === 0, compact: index > 0 }]} ...>
```

Show the summary and decorative Mask-to-kind token only for the lead entry. Remove column indices, counts, item borders, CTA borders, fixed minimum heights, and forced bottom alignment.

- [ ] **Step 4: Rewrite Hero and Latest labels**

Use the approved Hero kicker and summary. Change `Featured / 01` to `Latest`, consume `shortTitle` when present, and retain compact desktop/mobile metadata rules.

- [ ] **Step 5: Add optional short titles to the content schema**

Add `shortTitle: z.string().min(1).optional()` to `commonSchema` and set LLaDA2.2's value to `LLaDA2.2 — Agentic diffusion through Levenshtein editing`.

- [ ] **Step 6: Run focused tests to verify green**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'editorial research shelf|research shelf uses whitespace'`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add tests/site.spec.ts src/pages/index.astro src/components/ResearchHero.astro src/components/FeaturedRelease.astro src/components/ResearchColumn.astro src/lib/content-schema.ts src/content/papers/llada-2-2.mdx
git commit -m "feat: replace research grid with editorial shelves"
```

### Task 3: Rewrite content summaries

**Files:**
- Modify: `src/content/models/llada-2-x.mdx`
- Modify: `src/content/models/llada-2-0-uni.mdx`
- Modify: `src/content/papers/llada-2-0.mdx`
- Modify: `src/content/papers/llada-2-1.mdx`
- Modify: `src/content/papers/llada-2-2.mdx`
- Modify: `src/content/blog/welcome-to-llada-research.mdx`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Add failing content assertions**

Assert that the homepage contains `An open family of diffusion language models, from scalable text generation to agentic editing.` and the Blog title `A Home for LLaDA Research`.

- [ ] **Step 2: Run the assertion and verify red**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'homepage content uses contribution-first copy'`

Expected: FAIL with the old summaries and Blog title.

- [ ] **Step 3: Replace frontmatter titles and summaries**

Use the exact contribution-first copy approved in the design spec. Keep paper titles, dates, tags, citations, URLs, and article body facts unchanged.

- [ ] **Step 4: Run the focused assertion and verify green**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'homepage content uses contribution-first copy'`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/site.spec.ts src/content
git commit -m "content: sharpen homepage research copy"
```

### Task 4: Visual and production acceptance

**Files:**
- Modify only files required by evidence from verification failures.

- [ ] **Step 1: Run unit, type, and browser tests**

```bash
npm run test:run
npm run check
npm run test:e2e
```

Expected: all unit tests pass, Astro reports zero diagnostics, and all applicable Playwright projects pass.

- [ ] **Step 2: Verify both deployment paths**

```bash
BASE_PATH=/ SITE_URL=https://ant-llada.github.io npm run build
BASE_PATH=/ant-llada SITE_URL=https://ulov888.github.io npm run build
```

Expected: both builds complete and project-path links use `/ant-llada/`.

- [ ] **Step 3: Capture and inspect desktop/mobile screenshots**

Inspect the homepage at 1440×1000 and 390×844. Verify that the shelf reads as three editorial groups, Blog ends naturally, no desktop vertical dividers remain, mobile separators are subtle, copy is readable, and no horizontal overflow occurs.

- [ ] **Step 4: Run Lighthouse and hygiene checks**

```bash
BASE_PATH=/ SITE_URL=http://127.0.0.1:4321 npm run build
npm run test:lighthouse
git diff --check
git status --short --branch
```

Expected: Performance, Accessibility, SEO, color contrast, and label matching assertions pass; the worktree contains only intentional changes.
