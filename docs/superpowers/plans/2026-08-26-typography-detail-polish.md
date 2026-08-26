# Typography and Detail Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the academic editorial typography consistent across platforms and tighten recurring spacing and tracking details.

**Architecture:** Load three self-hosted type families in the base layout, expose their roles and metrics through global CSS tokens, and let existing components inherit those roles. Add computed-style and loaded-font browser assertions before changing production code, then visually verify representative desktop and mobile routes.

**Tech Stack:** Astro, Fontsource, CSS custom properties, Playwright, Lighthouse

---

### Task 1: Lock the typography contract

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] Add a Playwright test that requires loaded Inter Variable, Source Serif 4 Variable, and IBM Plex Mono font faces.
- [ ] Assert body, headings, and metadata resolve to the correct first font family.
- [ ] Assert metadata tracking is at most `0.065em`, body leading is between 1.55 and 1.7, and headings use a distinct serif role.
- [ ] Run the focused test and verify it fails because the current build has no self-hosted font faces and uses `0.08em` metadata tracking.

### Task 2: Introduce self-hosted type foundations

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

- [ ] Install Fontsource packages for Inter Variable, Source Serif 4 Variable, and IBM Plex Mono.
- [ ] Import only the required Latin variable font CSS from `BaseLayout.astro`.
- [ ] Update family, tracking, leading, weight, optical-sizing, ligature, and numeric tokens in `global.css`.
- [ ] Run the focused Playwright test and verify it passes.

### Task 3: Normalize component details

**Files:**
- Modify: `src/components/ContentCard.astro`
- Modify: `src/components/ResearchColumn.astro`
- Modify: `src/styles/content.css`

- [ ] Route technical notation through the technical tracking token.
- [ ] Replace touched off-grid margins with the nearest 8px token.
- [ ] Keep natural title wrapping and validate all archive entries at 1440px, 390px, and 320px.

### Task 4: Verify and deploy

**Files:**
- Modify only files required by verification evidence.

- [ ] Run `npm run test:run`, `npm run check`, root and GitHub Pages builds, and `npm run test:e2e`.
- [ ] Capture homepage, Models, Publications, and a detail page at desktop and mobile sizes.
- [ ] Run `npm run test:lighthouse` and `git diff --check`.
- [ ] Commit, push GitHub `main` and Alipay `master`, and confirm GitHub Pages serves the new font assets.
