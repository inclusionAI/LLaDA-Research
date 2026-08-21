# LLaDA Research Editorial System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved light academic direction into a consistent, accessible design system while correcting the model catalog and research-participation metadata.

**Architecture:** Semantic tokens in `global.css` define every reusable type, spacing, color, and interaction role. Existing Astro components consume those tokens without changing the homepage information architecture. Astro content schemas validate InclusionAI participation explicitly, while unit and browser tests protect both content scope and visual hierarchy.

**Tech Stack:** Astro 7, TypeScript, Astro Content Collections, CSS, Vitest, Playwright, Lighthouse

---

### Task 1: Correct research ownership and model catalog

**Files:**
- Modify: `src/lib/content-schema.ts`
- Modify: `src/content/models/*.mdx`
- Modify: `src/content/papers/*.mdx`
- Delete: `src/content/models/llada-2-x.mdx`
- Create: `src/content/models/llada-moe-v2.mdx`
- Modify: `tests/content-schema.test.ts`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Write failing schema and archive tests**

Require a non-empty `participants` array containing `InclusionAI`, expect six model cards containing `LLaDA MoE v2` but not `LLaDA2.X`, require the preview route, and move the removed umbrella route into the 404 assertions.

- [ ] **Step 2: Run tests and verify the intended failures**

Run: `npm run test:run -- tests/content-schema.test.ts`

Expected: failures because `participants` is not yet part of the schema.

- [ ] **Step 3: Implement the validated metadata and content migration**

Use this shared validation:

```ts
const participantsSchema = z.array(z.string().min(1)).min(1).refine(
  (participants) => participants.includes('InclusionAI'),
  { message: 'Research entries must include InclusionAI participation.' },
);
```

Replace `publisher` with `participants` in research frontmatter. Add `LLaDA MoE v2` as a `preview` model with only `https://arxiv.org/abs/2608.03457`; remove `llada-2-x.mdx`.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm run test:run -- tests/content-schema.test.ts tests/content.test.ts`

Expected: all focused tests pass.

Commit: `fix: align research catalog with participation policy`

### Task 2: Establish semantic design tokens

**Files:**
- Modify: `src/styles/global.css`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Add failing browser assertions for the system contract**

Add computed-style assertions equivalent to:

```ts
expect(Number.parseFloat(await body.evaluate((node) => getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
expect(titleSize).toBeGreaterThan(summarySize);
expect(metaSize).toBeGreaterThanOrEqual(12);
expect(filterHeight).toBeGreaterThanOrEqual(44);
```

- [ ] **Step 2: Run the targeted browser test and verify failure**

Run: `npx playwright test tests/site.spec.ts --grep "editorial type roles|touch targets" --project=desktop`

Expected: failure on the current small metadata and control sizes.

- [ ] **Step 3: Add semantic color, typography, spacing, and motion tokens**

Define the roles specified in `docs/superpowers/specs/2026-08-21-llada-editorial-system-design.md`, preserve temporary color aliases, and set robust global defaults for headings, text, focus, and reduced motion.

- [ ] **Step 4: Run the focused browser test and commit**

Run: `npx playwright test tests/site.spec.ts --grep "editorial type roles|touch targets" --project=desktop`

Expected: all selected tests pass.

Commit: `style: establish llada editorial design tokens`

### Task 3: Normalize homepage hierarchy and rhythm

**Files:**
- Modify: `src/components/ResearchHero.astro`
- Modify: `src/components/SelectedWork.astro`
- Modify: `src/components/ProgramNav.astro`
- Modify: `src/components/ResearchColumn.astro`
- Modify: `src/components/ResearchUpdates.astro`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Add failing homepage hierarchy tests**

Measure section, item, and supporting-copy computed styles and assert descending size, distinct weight/line-height, aligned desktop rows, and no mobile overflow.

- [ ] **Step 2: Run the homepage tests and verify failure**

Run: `npx playwright test tests/site.spec.ts --grep "homepage editorial hierarchy" --project=desktop`

Expected: failure because current local values do not resolve to the new roles.

- [ ] **Step 3: Migrate homepage components to the system**

Use semantic tokens for the hero kicker/title/lead/action, Selected Work label/heading/items, and Program Navigation section/title/descriptions. Preserve the integrated diffusion field, page order, two selected works, three program links, and reduced-motion behavior.

- [ ] **Step 4: Verify desktop and mobile homepage behavior and commit**

Run: `npx playwright test tests/site.spec.ts --grep "homepage editorial hierarchy|program navigation|mobile homepage"`

Expected: all selected tests pass in configured projects.

Commit: `style: unify homepage editorial hierarchy`

### Task 4: Normalize archives and filters

**Files:**
- Modify: `src/components/ContentCard.astro`
- Modify: `src/components/ArchiveFilter.astro`
- Modify: `src/components/ResourceLinks.astro`
- Modify: `src/pages/models/index.astro`
- Modify: `src/pages/papers/index.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Add failing alignment and responsive tests**

Assert archive card title-to-metadata hierarchy, 44px filter targets, matching row gutters, compact artwork no smaller than 64px, natural model-name wrapping, and no overflow at 320px and 390px.

- [ ] **Step 2: Run the archive tests and verify failure**

Run: `npx playwright test tests/site.spec.ts --grep "archive editorial hierarchy|mobile archive"`

Expected: failure on current typography, target size, or compact artwork height.

- [ ] **Step 3: Migrate archive components**

Replace sub-12px token art, arbitrary title clamps, spacing, and tracking with semantic roles. Keep flat ruled rows, make search and filters share the grid baseline, and preserve current filtering behavior and accessible names.

- [ ] **Step 4: Verify archive behavior and commit**

Run: `npx playwright test tests/site.spec.ts --grep "archive editorial hierarchy|archive filters|mobile archive|token artwork"`

Expected: all selected tests pass.

Commit: `style: align archive typography and controls`

### Task 5: Normalize detail typography and supporting components

**Files:**
- Modify: `src/styles/content.css`
- Modify: `src/layouts/ContentLayout.astro`
- Modify: `src/components/CitationCopy.astro`
- Modify: `src/components/RelatedContent.astro`
- Modify: `src/components/ResourceLinks.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/404.astro`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Add failing detail-page hierarchy tests**

Assert page title, summary, prose, metadata, related content, and controls map to descending semantic roles and retain contrast and reading measure at desktop/mobile sizes.

- [ ] **Step 2: Run the detail tests and verify failure**

Run: `npx playwright test tests/site.spec.ts --grep "detail editorial hierarchy" --project=desktop`

Expected: failure because detail components still use arbitrary local values.

- [ ] **Step 3: Migrate detail and supporting styles**

Use design-system type and space tokens, preserve the 42–44rem reading measure, keep the aside responsive, and ensure all standalone pages use the same page-title role.

- [ ] **Step 4: Verify detail behavior and commit**

Run: `npx playwright test tests/site.spec.ts --grep "detail editorial hierarchy|related research|citation|supporting pages"`

Expected: all selected tests pass.

Commit: `style: unify research detail typography`

### Task 6: Visual QA, accessibility, and release verification

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/content.css`
- Modify: `src/components/ContentCard.astro`
- Modify: `src/components/ArchiveFilter.astro`
- Modify: `src/components/ResearchHero.astro`
- Modify: `src/components/SelectedWork.astro`
- Modify: `src/components/ProgramNav.astro`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Render and inspect representative screenshots**

Capture `/`, `/models/`, `/papers/`, `/papers/llada-moe-v2/`, `/blog/`, and `/about/` at 1440×1000 and 390×844. Check hierarchy, baselines, natural wrapping, field integration, contrast, and overflow against the spec.

- [ ] **Step 2: Add a failing regression test for every material issue found**

Run each new focused assertion and confirm it fails for the observed issue before changing production CSS or Astro markup.

- [ ] **Step 3: Apply minimal fixes and re-run focused tests**

Expected: every new regression test passes and screenshots match the approved light academic direction.

- [ ] **Step 4: Run complete verification**

Run:

```bash
npm run test:run
npm run check
npm run build
GITHUB_REPOSITORY=inclusionAI/LLaDA-Research npm run build
npm run test:e2e
npm run test:lighthouse
git diff --check
```

Expected: zero unit failures, zero Astro diagnostics, successful root and project-base builds, all non-skipped Playwright tests passing, Lighthouse thresholds passing, and no whitespace errors.

- [ ] **Step 5: Request independent design and code review, resolve findings, and commit**

Review against the design spec and the full diff. Fix all critical and important findings, rerun affected checks, then commit as `style: complete llada editorial system`.
