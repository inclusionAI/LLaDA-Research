# Homepage Research Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's single Latest strip with an automatic four-entry research-updates list and give the research index an institutional editorial introduction.

**Architecture:** Keep selection in `src/pages/index.astro`, where the three sorted content collections and model status are available. Render the selected union through a focused `ResearchUpdates.astro` component; remove the obsolete single-entry component only after its replacement passes the homepage contract.

**Tech Stack:** Astro, TypeScript, Astro content collections, Playwright

---

### Task 1: Lock the homepage editorial contract

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Replace single-feature assertions with update-list assertions**

Update the homepage tests to require `[data-research-updates]`, four `[data-update-entry]` links, two entries labeled `Paper`, one `Model`, and one `Note`. Assert the model entry is `LLaDA2.2`, the note is `A Home for LLaDA Research`, and no visible `Latest` label remains.

- [ ] **Step 2: Assert institutional research-index copy**

Require `Research program`, the heading `Diffusion language models, from foundations to scale.`, and `Models, papers, and technical notes across the LLaDA research program.` Remove expectations for `The work`, `Models. Papers. Notes.`, and the old description.

- [ ] **Step 3: Assert responsive list geometry**

At 1440px, assert the first two update entries share a row and form two columns. At 390px, assert all four entries form four vertically ordered rows and the document has no horizontal overflow.

- [ ] **Step 4: Verify red**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'homepage presents|homepage supporting|editorial research shelf|research updates'`

Expected: FAIL because the page still renders one `Latest` entry and the old research-index copy.

### Task 2: Build the automatic research-updates list

**Files:**
- Create: `src/components/ResearchUpdates.astro`
- Modify: `src/pages/index.astro`
- Delete: `src/components/FeaturedRelease.astro`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Select the editorial mix**

In `src/pages/index.astro`, construct four typed entries in this order:

```ts
const researchUpdates = [
  ...publishedPapers.slice(0, 2).map((entry) => ({ ...entry, kind: 'paper' as const })),
  ...publishedModels.filter(({ data }) => data.status === 'released').slice(0, 1)
    .map((entry) => ({ ...entry, kind: 'model' as const })),
  ...publishedPosts.slice(0, 1).map((entry) => ({ ...entry, kind: 'blog' as const })),
];
```

Replace `FeaturedRelease` with `ResearchUpdates entries={researchUpdates}`.

- [ ] **Step 2: Implement the list component**

Create `ResearchUpdates.astro` with an `entries` prop, a `Research updates` heading, and one base-path-safe link per entry. Map `paper` to `Paper`, `model` to `Model`, and `blog` to `Note`; display `shortTitle ?? title`, a formatted date, and `↗`.

Use a two-column grid above 700px and a one-column grid at or below 700px. Give each link `data-update-entry`, preserve visible focus styles, allow titles to wrap, and keep dividers within the existing dark visual language.

- [ ] **Step 3: Rewrite the research-index introduction**

Set the eyebrow, heading, and description to the exact approved copy from the design spec. Keep all three research columns unchanged.

- [ ] **Step 4: Remove the obsolete component**

Delete `src/components/FeaturedRelease.astro` after confirming no imports or tests reference its old data attributes.

- [ ] **Step 5: Verify green**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'homepage presents|homepage supporting|editorial research shelf|research updates'`

Expected: all focused tests pass.

- [ ] **Step 6: Commit**

```bash
git add tests/site.spec.ts src/pages/index.astro src/components/ResearchUpdates.astro src/components/FeaturedRelease.astro
git commit -m "feat: add homepage research updates"
```

### Task 3: Production acceptance and local preview

**Files:**
- Modify only files required by verification evidence.

- [ ] **Step 1: Run project verification**

```bash
npm run test:run
npm run check
npm run test:e2e
```

- [ ] **Step 2: Verify deployment builds**

```bash
BASE_PATH=/ SITE_URL=https://ant-llada.github.io npm run build
BASE_PATH=/ant-llada SITE_URL=https://ulov888.github.io npm run build
```

- [ ] **Step 3: Inspect desktop and mobile screenshots**

Capture `/` at 1440×1000 and 390×844. Verify the 2×2/four-row layout, natural title wrapping, visible type/date labels, keyboard focus, and absence of horizontal overflow.

- [ ] **Step 4: Run Lighthouse and hygiene checks**

```bash
BASE_PATH=/ SITE_URL=http://127.0.0.1:4321 npm run build
npm run test:lighthouse
git diff --check
git status --short --branch
```

- [ ] **Step 5: Restart local preview**

Serve the fresh root-path `dist` on `http://127.0.0.1:4321` and verify `/` returns HTTP 200.
