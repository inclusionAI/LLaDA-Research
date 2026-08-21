# Academic Journal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a light academic-journal redesign with a reduced homepage and an InclusionAI-only research archive.

**Architecture:** Enforce official ownership in Astro content schemas, delete non-official content at the source, replace the homepage composition with two small purpose-built sections, and retheme shared layout/components through semantic CSS variables. Preserve the single-canvas particle engine while swapping its render palette and clearing behavior for the light theme.

**Tech Stack:** Astro 7, TypeScript, MDX content collections, Canvas 2D, Vitest, Playwright, Lighthouse

---

### Task 1: Enforce the official InclusionAI archive

**Files:**
- Modify: `src/lib/content-schema.ts`
- Modify: `tests/content-schema.test.ts`
- Delete: `src/content/models/illada-8b.mdx`
- Delete: `src/content/models/llada-8b.mdx`
- Delete: `src/content/models/llada-1-5.mdx`
- Delete: `src/content/models/llada-moe-v2.mdx`
- Delete: `src/content/papers/improved-large-language-diffusion-models.mdx`
- Delete: `src/content/papers/large-language-diffusion-models.mdx`
- Delete: `src/content/papers/llada-1-5.mdx`
- Modify: remaining `src/content/models/*.mdx` and `src/content/papers/*.mdx`
- Modify: `tests/site.spec.ts`

- [ ] Add failing schema tests requiring `publisher: "InclusionAI"` for models and papers:

```ts
expect(modelSchema.safeParse({ ...officialModel, publisher: 'Other Lab' }).success).toBe(false);
expect(paperSchema.safeParse({ ...officialPaper, publisher: 'InclusionAI' }).success).toBe(true);
```

- [ ] Add failing browser assertions for six model entries, six paper entries, and 404 responses for `/models/illada-8b/`, `/models/llada-8b/`, and `/models/llada-1-5/`.
- [ ] Run focused Vitest and Playwright tests and confirm RED.
- [ ] Extend model and paper schemas with `publisher: z.literal('InclusionAI')`, add the field to retained content, delete excluded content and stale expectations.
- [ ] Re-run focused tests and commit `content: limit archive to InclusionAI research`.

### Task 2: Replace the dense homepage composition

**Files:**
- Create: `src/components/SelectedWork.astro`
- Create: `src/components/ProgramNav.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/ResearchHero.astro`
- Modify: `tests/site.spec.ts`

- [ ] Add failing browser assertions that the homepage has no `[data-research-updates]`, no `[data-research-column]`, exactly two `[data-selected-work]` links, and three `[data-program-link]` links.
- [ ] Confirm the assertions fail against the current four-update and three-column homepage.
- [ ] Implement `SelectedWork` as two flat publication rows using official LLaDA2.2 and LLaDA2.0-Uni entries.
- [ ] Implement `ProgramNav` with Models, Publications, and Notes links and concise descriptions.
- [ ] Rewrite the hero proposition to “Language takes shape.” and reduce it to one CTA while keeping the canvas field.
- [ ] Run focused tests and commit `feat: simplify academic research homepage`.

### Task 3: Apply the Contemporary Journal visual system

**Files:**
- Add: `public/llada-logo-black.svg`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `src/components/ContentCard.astro`
- Modify: `src/components/ArchiveFilter.astro`
- Modify: `src/styles/content.css`
- Modify: `src/pages/index.astro`
- Modify: `tests/site.spec.ts`

- [ ] Add failing browser assertions for `rgb(247, 248, 243)` body background, dark primary text, black wordmark asset, light mobile menu, and flat zero-shadow archive rows.
- [ ] Confirm RED against the dark variables and white wordmark.
- [ ] Add the official black self-contained SVG and change header/footer asset references using `withBase`.
- [ ] Replace global tokens with ivory/ink/sage values, set `color-scheme: light`, apply Georgia display headings, and remove dark panels/shadows.
- [ ] Adapt archives, filters, detail typography, buttons, footer, mobile navigation, and focus states to the new variables.
- [ ] Capture desktop/mobile screenshots, refine spacing and contrast, then commit `style: adopt contemporary academic journal theme`.

### Task 4: Retheme the semantic particle field

**Files:**
- Modify: `src/components/DenoiseField.astro`
- Modify: `tests/site.spec.ts`

- [ ] Add failing assertions for `data-field-theme="sage-light"`, transparent/light canvas surface, one canvas, and preserved interaction metadata.
- [ ] Confirm RED.
- [ ] Replace dark clearing with ivory trail clearing, map ambient particles to gray-green/sage, semantic particles to dark sage, and remove the white pointer spotlight.
- [ ] Reduce ambient opacity while preserving resolved word legibility, pointer tangents, 650ms parallel convergence, reduced motion, adaptive density, and one RAF.
- [ ] Capture resolved/editing/pointer frames on desktop and a mobile frame, tune until the effect reads as quiet research texture.
- [ ] Commit `style: retheme diffusion field for light surfaces`.

### Task 5: Verify, merge, deploy, and publish

**Files:**
- Modify only if verification exposes defects.

- [ ] Run `npm run test:run` and require zero failures.
- [ ] Run `npm run check` and require zero diagnostics.
- [ ] Run root and `GITHUB_REPOSITORY=inclusionAI/LLaDA-Research npm run build`; verify 404, RSS, sitemap, black logo, and project-prefixed assets.
- [ ] Run all Playwright projects and Lighthouse assertions.
- [ ] Run `git diff --check`, request final design/code review, and fix all Critical/Important findings.
- [ ] Merge to `main`, verify again on the merged tree, restart port 4321, push `main` to `inclusion-github` and `alipay`, and verify both remote SHAs.

