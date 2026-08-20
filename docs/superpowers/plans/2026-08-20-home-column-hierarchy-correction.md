# Homepage Column Hierarchy Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an unmistakable visual hierarchy between homepage research-column headings and lead content titles.

**Architecture:** Keep the existing `ResearchColumn` markup and content flow. Strengthen the section/content boundary through a ratio-based Playwright assertion and focused CSS changes to title scale, spacing, and divider treatment.

**Tech Stack:** Astro, CSS, Playwright

---

### Task 1: Lock the hierarchy ratio

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] Add assertions that the desktop column-heading size is at least 1.5 times the lead-title size, its font weight is no greater than the lead-title weight, and `.column-header` has a visible bottom border.
- [ ] Run `npx playwright test tests/site.spec.ts --project=desktop -g 'typography hierarchy'` and verify it fails because the current ratio is approximately 1.29 and there is no divider.

### Task 2: Strengthen the research-column hierarchy

**Files:**
- Modify: `src/components/ResearchColumn.astro`
- Test: `tests/site.spec.ts`

- [ ] Set the column heading to a fluid 36–40px size and weight 500.
- [ ] Set the lead title to a fluid 21–23px size and weight 520; retain compact titles at 16–18px.
- [ ] Add a subtle bottom divider and approximately 1.6rem of bottom padding to `.column-header`, followed by approximately 1rem of separation before the list.
- [ ] Run the focused desktop, 901px, and mobile homepage tests and verify hierarchy, summary visibility, and overflow.
- [ ] Commit with `style: strengthen homepage column hierarchy`.

### Task 3: Verify and redeploy

**Files:**
- Modify only files required by verification evidence.

- [ ] Run `npm run test:run`, `npm run check`, and `npm run test:e2e`.
- [ ] Build both deployment paths and run Lighthouse.
- [ ] Inspect homepage screenshots at 1440×1000, 901×900, and 390×844.
- [ ] Restart the root-path preview on `http://127.0.0.1:4321` and verify HTTP 200.
