# Homepage Readable Type Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase homepage supporting text to a clearly readable scale while preserving the approved editorial layout and exact 47px Latest strip.

**Architecture:** Keep all markup and content unchanged. Adjust scoped typography in `ResearchHero`, `FeaturedRelease`, `ResearchColumn`, and the homepage section lead; protect the new scale with computed-style and overflow assertions in Playwright.

**Tech Stack:** Astro scoped CSS, TypeScript, Playwright, Vitest, Lighthouse CI

---

### Task 1: Lock readable computed sizes

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Add a failing desktop typography test**

At 1440×1000, assert that the Hero summary is at least 15px, Hero CTAs at least 12px, shelf description at least 14px, column descriptions and lead summaries at least 13px, metadata and column CTAs at least 11px, lead titles at least 21px, and compact titles at least 15px.

- [ ] **Step 2: Add mobile and layout guards**

At 390×844, assert column descriptions and summaries remain at least 13px, the Latest strip remains 47px, and the page has no horizontal overflow. At 901×900, assert every lead summary has `scrollHeight <= clientHeight + 1`.

- [ ] **Step 3: Verify the test fails for the current small sizes**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'homepage supporting type is readable'`

Expected: FAIL because metadata, descriptions, summaries, and CTAs are below the new minimums.

### Task 2: Apply the readable scale

**Files:**
- Modify: `src/components/ResearchHero.astro`
- Modify: `src/components/FeaturedRelease.astro`
- Modify: `src/components/ResearchColumn.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Increase Hero supporting text**

Set the Hero summary to `clamp(0.94rem, 1.25vw, 1.06rem)`, CTA text to `0.75rem`, and kicker to `0.68rem`.

- [ ] **Step 2: Increase Latest text without changing its height**

Set metadata to `0.68rem`, title to `0.8rem`, and arrow to `0.85rem`. Keep the wrapper border box and internal link dimensions unchanged so the rendered height remains 47px.

- [ ] **Step 3: Increase shelf hierarchy**

Set column titles to `1.45rem`, descriptions and lead summaries to `0.82rem`, metadata and token labels to `0.68rem`, lead titles to `clamp(1.32rem, 1.65vw, 1.5rem)`, compact titles to `clamp(0.95rem, 1.12vw, 1.06rem)`, and CTAs to `0.72rem`. Adjust vertical gaps only as needed to prevent crowding.

- [ ] **Step 4: Increase section lead copy**

Set the section eyebrow to `0.68rem` and description to `0.88rem`; retain the existing display heading scale.

- [ ] **Step 5: Verify focused behavior**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'homepage supporting type is readable|lead summaries remain intact|featured strip'`

Expected: all focused tests pass.

- [ ] **Step 6: Commit**

```bash
git add tests/site.spec.ts src/components/ResearchHero.astro src/components/FeaturedRelease.astro src/components/ResearchColumn.astro src/pages/index.astro
git commit -m "style: improve homepage type readability"
```

### Task 3: Full acceptance

**Files:**
- Modify only files required by verification evidence.

- [ ] **Step 1: Run code and browser checks**

```bash
npm run test:run
npm run check
npm run test:e2e
```

- [ ] **Step 2: Verify both deployment paths**

```bash
BASE_PATH=/ SITE_URL=https://ant-llada.github.io npm run build
BASE_PATH=/ant-llada SITE_URL=https://ulov888.github.io npm run build
```

- [ ] **Step 3: Run Lighthouse and repository checks**

```bash
BASE_PATH=/ SITE_URL=http://127.0.0.1:4321 npm run build
npm run test:lighthouse
git diff --check
git status --short --branch
```

- [ ] **Step 4: Capture desktop and mobile screenshots**

Capture 1440×1000 and 390×844 full-page screenshots and inspect text legibility, wrapping, hierarchy, and overflow before starting the final local preview.
