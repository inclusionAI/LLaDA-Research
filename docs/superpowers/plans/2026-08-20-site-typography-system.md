# Site Typography System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a coherent, readable research-institution typography hierarchy across every public page type.

**Architecture:** Define repeated font families and text-role sizes as global CSS custom properties, then migrate component-scoped rules to those roles. Preserve existing markup and content flow; use Playwright computed-style assertions to lock semantic size relationships rather than exact browser screenshots alone.

**Tech Stack:** Astro, CSS custom properties, TypeScript, Playwright, Lighthouse

---

### Task 1: Lock typography relationships

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Add homepage hierarchy assertions**

Add a test that reads computed font sizes from the first research column. Require its section title to be at least 28px, description at least 15px, lead title at least 21px, compact title at least 16px, and lead summary at least 14px. Require the section title to be larger than the lead title and the lead title to be larger than the compact title.

- [ ] **Step 2: Add archive hierarchy assertions**

Visit `/models/` at 1440px and require the page introduction description to be at least 16px, the first card title at least 24px, its summary at least 15px, and its metadata at least 11px.

- [ ] **Step 3: Add detail and interface assertions**

Visit `/models/llada-2-2/` and require the content summary to be at least 18px and prose to be at least 17px. Require desktop navigation, archive filter buttons, and primary buttons to be at least 12px.

- [ ] **Step 4: Verify red**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'typography hierarchy'`

Expected: FAIL on the current 13px column descriptions, 14px archive summaries, 16px prose, and 11px navigation.

### Task 2: Define and apply global type roles

**Files:**
- Modify: `src/styles/global.css`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Add global typography tokens**

Define `--font-sans`, `--font-mono`, `--type-meta`, `--type-label`, `--type-small`, `--type-body`, and `--type-body-lg` in `:root`. Use the font tokens in `body`, metadata utilities, and recurring controls.

- [ ] **Step 2: Raise interface readability floors**

Apply the label role to desktop navigation, footer links, buttons, tags, eyebrows, and resource-panel metadata. Preserve uppercase/monospace treatment only for metadata roles.

- [ ] **Step 3: Verify interface assertions**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'typography hierarchy'`

Expected: interface assertions pass; component hierarchy assertions remain red until Task 3.

### Task 3: Rebuild homepage and archive hierarchy

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/ResearchColumn.astro`
- Modify: `src/components/ResearchUpdates.astro`
- Modify: `src/components/ContentCard.astro`
- Modify: `src/components/ArchiveFilter.astro`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Separate homepage section roles**

Increase research-column titles to a fluid 28–32px range, descriptions to the body role, lead titles to 22–27px, compact titles to 16–18px, and lead summaries to 14–15px. Adjust header and entry spacing so the larger type does not crowd adjacent content.

- [ ] **Step 2: Refine the updates and program statement**

Raise update titles to 16–19px and the program description to the large-body role. Keep metadata compact and monospace.

- [ ] **Step 3: Refine archives**

Raise archive introduction descriptions, card titles, summaries, metadata, actions, filters, and tags to their global roles. Maintain natural long-title wrapping and compact mobile art.

- [ ] **Step 4: Verify homepage and archive assertions**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'typography hierarchy|homepage supporting|lead summaries'`

Expected: all selected tests pass.

### Task 4: Refine long-form and supporting pages

**Files:**
- Modify: `src/styles/content.css`
- Modify: `src/components/RelatedContent.astro`
- Modify: `src/components/ResourceLinks.astro`
- Modify: `src/components/CitationCopy.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/404.astro`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Raise long-form reading sizes**

Set detail summaries to the large-body range, prose to 17px with approximately 1.78 line height, and prose subheadings to a clear but restrained scale. Keep code blocks compact without dropping below 13px.

- [ ] **Step 2: Align supporting components**

Raise related-content titles and descriptions, resource links, citation labels, About paragraphs, and 404 supporting copy to their matching text roles.

- [ ] **Step 3: Verify detail assertions**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'typography hierarchy|supporting pages'`

Expected: all selected tests pass.

- [ ] **Step 4: Commit implementation**

```bash
git add src tests/site.spec.ts
git commit -m "style: establish site typography hierarchy"
```

### Task 5: Production acceptance and preview

**Files:**
- Modify only files required by verification evidence.

- [ ] **Step 1: Run the complete suite**

```bash
npm run test:run
npm run check
npm run test:e2e
```

- [ ] **Step 2: Verify both deployment builds**

```bash
BASE_PATH=/ SITE_URL=https://ant-llada.github.io npm run build
BASE_PATH=/ant-llada SITE_URL=https://ulov888.github.io npm run build
```

- [ ] **Step 3: Inspect representative screenshots**

Capture homepage, `/models/`, `/models/llada-2-2/`, `/about/`, and `/404.html` at 1440×1000 and 390×844. Verify hierarchy, long-title wrapping, reading density, card alignment, and horizontal overflow.

- [ ] **Step 4: Run Lighthouse and hygiene checks**

```bash
BASE_PATH=/ SITE_URL=http://127.0.0.1:4321 npm run build
npm run test:lighthouse
git diff --check
git status --short --branch
```

- [ ] **Step 5: Restart preview**

Serve the final root-path build at `http://127.0.0.1:4321` and verify the homepage, archive, and detail routes return HTTP 200.
