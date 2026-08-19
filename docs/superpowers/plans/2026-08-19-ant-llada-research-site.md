# Ant-LLaDA Research Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, English-first Astro research website that exposes a featured release plus immediately scannable Models, Papers, and Blog lists and deploys safely to GitHub Pages.

**Architecture:** Astro statically generates every public route from three MDX Content Collections. Pure TypeScript helpers own deployment URL resolution and homepage selection rules, while small Astro components own layout and presentation. GitHub Actions validates, builds, tests, and deploys the static output.

**Tech Stack:** Astro, MDX, TypeScript, Zod-backed Content Collections, Vitest, Playwright, CSS, GitHub Actions, GitHub Pages

---

## File structure

```text
astro.config.ts                         Astro integrations and deployment URL/base
package.json                            scripts and dependencies
playwright.config.ts                    browser acceptance test configuration
lighthouserc.json                       performance/accessibility/SEO budgets
tsconfig.json                           strict TypeScript configuration
.github/workflows/deploy.yml            Pages validation and deployment
public/favicon.svg                      LLaDA brand mark
src/content.config.ts                   schemas for models, papers, and blog
src/content/models/*.mdx                model/release entries
src/content/papers/*.mdx                publication entries
src/content/blog/*.mdx                  technical posts
src/lib/site-config.ts                  root/project Pages path resolver
src/lib/content.ts                      draft filtering, sorting, featured selection
src/layouts/BaseLayout.astro            document shell, SEO, navigation, footer
src/layouts/ContentLayout.astro         long-form article shell
src/components/FeaturedRelease.astro    compact featured-content block
src/components/ResearchColumn.astro     homepage list column
src/components/ContentCard.astro        reusable index entry
src/components/ResourceLinks.astro      conditional external links
src/components/DiffusionMark.astro      CSS/SVG brand artwork
src/components/ArchiveFilter.astro      local search and tag filtering
src/components/CitationCopy.astro       accessible citation-copy control
src/components/RelatedContent.astro     related entries by shared tags
src/styles/global.css                   tokens, typography, layout, accessibility
src/styles/content.css                  long-form MDX typography
src/pages/index.astro                   featured item and three-column index
src/pages/models/index.astro            model archive
src/pages/models/[id].astro             model detail pages
src/pages/papers/index.astro            paper archive
src/pages/papers/[id].astro             paper detail pages
src/pages/blog/index.astro              blog archive
src/pages/blog/[id].astro               blog detail pages
src/pages/about.astro                   project context and official links
src/pages/rss.xml.ts                    blog RSS feed
src/pages/404.astro                     branded recovery page
tests/site-config.test.ts               Pages path rules
tests/content.test.ts                   selection and sorting rules
tests/site.spec.ts                      rendered-site acceptance tests
```

### Task 1: Scaffold the Astro toolchain and deployment configuration

**Files:**
- Create: `package.json`
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/lib/site-config.ts`
- Test: `tests/site-config.test.ts`

- [ ] **Step 1: Initialize the package manifest and install dependencies**

Create `package.json` with these scripts, then run the install commands:

```json
{
  "name": "ant-llada-research-site",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "test:lighthouse": "lhci autorun"
  }
}
```

Run:

```bash
npm install astro @astrojs/mdx @astrojs/rss @astrojs/sitemap sharp
npm install --save-dev @astrojs/check typescript vitest @playwright/test @lhci/cli
```

Expected: `package-lock.json` exists and `npm ls --depth=0` exits successfully.

- [ ] **Step 2: Write the failing deployment-config test**

Create `tests/site-config.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { resolveDeploymentConfig } from '../src/lib/site-config';

describe('resolveDeploymentConfig', () => {
  it('uses a repository base path for a project Pages site', () => {
    expect(resolveDeploymentConfig('Ulov888/ant-llada')).toEqual({
      site: 'https://ulov888.github.io',
      base: '/ant-llada',
    });
  });

  it('uses the root path for an organization Pages repository', () => {
    expect(resolveDeploymentConfig('ant-llada/ant-llada.github.io')).toEqual({
      site: 'https://ant-llada.github.io',
      base: '/',
    });
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `npm run test:run -- tests/site-config.test.ts`

Expected: FAIL because `src/lib/site-config.ts` does not exist.

- [ ] **Step 4: Implement deployment configuration**

Create `src/lib/site-config.ts`:

```ts
export interface DeploymentConfig {
  site: string;
  base: string;
}

export function resolveDeploymentConfig(repository = 'Ulov888/ant-llada'): DeploymentConfig {
  const [rawOwner = 'Ulov888', rawRepo = 'ant-llada'] = repository.split('/');
  const owner = rawOwner.toLowerCase();
  const repo = rawRepo || 'ant-llada';
  const rootRepository = `${owner}.github.io`;

  return {
    site: `https://${owner}.github.io`,
    base: repo.toLowerCase() === rootRepository ? '/' : `/${repo}`,
  };
}
```

Create `astro.config.ts`:

```ts
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { resolveDeploymentConfig } from './src/lib/site-config';

export default defineConfig(({ command }) => {
  const deployed = resolveDeploymentConfig(process.env.GITHUB_REPOSITORY);
  const local = { site: 'http://localhost:4321', base: '/' };
  const target = command === 'dev' ? local : deployed;

  return {
    output: 'static',
    site: process.env.SITE_URL ?? target.site,
    base: process.env.BASE_PATH ?? target.base,
    integrations: [mdx(), sitemap()],
  };
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Create `src/env.d.ts`:

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 5: Run configuration tests and checks**

Run: `npm run test:run -- tests/site-config.test.ts && npm run check`

Expected: both tests pass; Astro check reports no errors.

- [ ] **Step 6: Commit the scaffold**

```bash
git add package.json package-lock.json astro.config.ts tsconfig.json src/env.d.ts src/lib/site-config.ts tests/site-config.test.ts
git commit -m "build: scaffold Astro site"
```

### Task 2: Define content collections and homepage selection rules

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/content.ts`
- Test: `tests/content.test.ts`

- [ ] **Step 1: Write failing content-selection tests**

Create `tests/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { selectFeatured, sortPublished } from '../src/lib/content';

const entry = (id: string, date: string, featured = false, draft = false) => ({
  id,
  data: { title: id, date: new Date(date), featured, draft },
});

describe('content selection', () => {
  it('filters drafts and sorts newest first', () => {
    const result = sortPublished([
      entry('old', '2026-01-01'),
      entry('draft', '2026-12-01', false, true),
      entry('new', '2026-08-01'),
    ]);
    expect(result.map(({ id }) => id)).toEqual(['new', 'old']);
  });

  it('selects the newest featured entry', () => {
    const result = selectFeatured([
      entry('latest', '2026-08-01'),
      entry('featured-old', '2026-05-01', true),
      entry('featured-new', '2026-07-01', true),
    ]);
    expect(result?.id).toBe('featured-new');
  });

  it('falls back to the newest published entry', () => {
    expect(selectFeatured([
      entry('old', '2026-01-01'),
      entry('new', '2026-08-01'),
    ])?.id).toBe('new');
  });

  it('warns when several entries are featured', () => {
    const warnings: string[] = [];
    selectFeatured([
      entry('featured-old', '2026-05-01', true),
      entry('featured-new', '2026-07-01', true),
    ], (message) => warnings.push(message));
    expect(warnings).toEqual(['Multiple featured entries found; using featured-new.']);
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run: `npm run test:run -- tests/content.test.ts`

Expected: FAIL because `src/lib/content.ts` does not exist.

- [ ] **Step 3: Implement the pure selection helpers**

Create `src/lib/content.ts`:

```ts
export interface DatedEntry {
  id: string;
  data: {
    title: string;
    date: Date;
    featured?: boolean;
    draft?: boolean;
  };
}

export function sortPublished<T extends DatedEntry>(entries: T[]): T[] {
  return entries
    .filter(({ data }) => !data.draft)
    .toSorted((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function selectFeatured<T extends DatedEntry>(
  entries: T[],
  warn: (message: string) => void = console.warn,
): T | undefined {
  const published = sortPublished(entries);
  const featured = published.filter(({ data }) => data.featured);
  if (featured.length > 1) {
    warn(`Multiple featured entries found; using ${featured[0].id}.`);
  }
  return featured[0] ?? published[0];
}
```

- [ ] **Step 4: Define strict collection schemas**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const resourceLinks = z.object({
  project: z.string().url().optional(),
  paper: z.string().url().optional(),
  pdf: z.string().url().optional(),
  code: z.string().url().optional(),
  model: z.string().url().optional(),
  modelscope: z.string().url().optional(),
}).default({});

const common = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  authors: z.array(z.string()).default([]),
});

const models = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/models' }),
  schema: common.extend({
    family: z.string(),
    modality: z.string(),
    status: z.enum(['released', 'preview', 'archived']).default('released'),
    license: z.string().optional(),
    links: resourceLinks,
  }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/papers' }),
  schema: common.extend({
    venue: z.string().optional(),
    citation: z.string().optional(),
    links: resourceLinks,
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: common.extend({
    category: z.enum(['Release', 'Research', 'Engineering', 'Perspective']),
    readingTime: z.string().optional(),
    links: resourceLinks,
  }),
});

export const collections = { models, papers, blog };
```

- [ ] **Step 5: Run tests and schema checks**

Run: `npm run test:run -- tests/content.test.ts && npm run check`

Expected: all tests pass; collection config type-checks.

- [ ] **Step 6: Commit the content foundation**

```bash
git add src/content.config.ts src/lib/content.ts tests/content.test.ts
git commit -m "feat: define research content collections"
```

### Task 3: Add verified initial LLaDA content

**Files:**
- Create: `src/content/models/llada-2-x.mdx`
- Create: `src/content/models/llada-2-0-uni.mdx`
- Create: `src/content/papers/llada-2-2.mdx`
- Create: `src/content/papers/llada-2-1.mdx`
- Create: `src/content/papers/llada-2-0.mdx`
- Create: `src/content/papers/llada-2-0-uni.mdx`
- Create: `src/content/blog/welcome-to-llada-research.mdx`

- [ ] **Step 1: Add the LLaDA2.X model entry**

Use this frontmatter in `src/content/models/llada-2-x.mdx` and follow it with concise prose sourced from the official repository:

```mdx
---
title: "LLaDA2.X"
date: 2026-07-01
summary: "A series of large diffusion language models spanning LLaDA2.0, LLaDA2.1, LLaDA2.2, and future releases."
tags: ["language", "diffusion", "open-source"]
featured: false
draft: false
family: "LLaDA 2.x"
modality: "Language"
status: "released"
license: "Apache-2.0"
links:
  project: "https://github.com/inclusionAI/LLaDA2.X"
  paper: "https://github.com/inclusionAI/LLaDA2.X/blob/main/LLaDA2_2_tech_report.pdf"
  code: "https://github.com/inclusionAI/LLaDA2.X"
  model: "https://huggingface.co/collections/inclusionAI/llada22"
---

LLaDA2.X is InclusionAI's open family of large diffusion language models. The series scales diffusion language modeling and explores faster generation through token-editing and Levenshtein-editing approaches.
```

- [ ] **Step 2: Add the LLaDA2.0-Uni model entry**

Create `src/content/models/llada-2-0-uni.mdx` with verified official links:

```mdx
---
title: "LLaDA2.0-Uni"
date: 2026-04-23
summary: "A unified diffusion large language model for multimodal understanding, image generation, and editing."
tags: ["multimodal", "understanding", "generation"]
featured: false
draft: false
family: "LLaDA 2.x"
modality: "Multimodal"
status: "released"
links:
  project: "https://github.com/inclusionAI/LLaDA2.0-Uni"
  paper: "https://arxiv.org/abs/2604.20796"
  code: "https://github.com/inclusionAI/LLaDA2.0-Uni"
  model: "https://huggingface.co/inclusionAI/LLaDA2.0-Uni"
  modelscope: "https://www.modelscope.cn/models/inclusionAI/LLaDA2.0-Uni"
---

LLaDA2.0-Uni combines multimodal understanding and generation in a unified discrete diffusion framework. It supports image understanding, text-to-image generation, image editing, and interleaved reasoning.
```

- [ ] **Step 3: Add publication entries**

Create four paper MDX files using these verified titles and URLs:

```yaml
# llada-2-2.mdx
title: "LLaDA2.2: Enabling Agentic Diffusion Language Models via Levenshtein Editing"
date: 2026-07-01
summary: "LLaDA2.2 advances agentic diffusion language modeling through Levenshtein editing."
tags: ["agentic", "language", "diffusion"]
featured: true
draft: false
venue: "Technical Report"
links:
  project: "https://github.com/inclusionAI/LLaDA2.X"
  paper: "https://github.com/inclusionAI/LLaDA2.X/blob/main/LLaDA2_2_tech_report.pdf"
  code: "https://github.com/inclusionAI/LLaDA2.X"
  model: "https://huggingface.co/collections/inclusionAI/llada22"
```

```yaml
# llada-2-1.mdx
title: "LLaDA2.1: Speeding Up Text Diffusion via Token Editing"
date: 2026-02-10
summary: "A token-editing approach for faster text diffusion."
tags: ["language", "acceleration", "token-editing"]
featured: false
draft: false
venue: "arXiv"
links:
  paper: "https://arxiv.org/abs/2602.08676"
  project: "https://github.com/inclusionAI/LLaDA2.X"
  model: "https://huggingface.co/collections/inclusionAI/llada21"
```

```yaml
# llada-2-0.mdx
title: "LLaDA2.0: Scaling Up Diffusion Language Models to 100B"
date: 2025-12-17
summary: "The LLaDA2.0 family scales discrete diffusion language models to the 100-billion-parameter level."
tags: ["language", "scaling", "moe"]
featured: false
draft: false
venue: "arXiv"
links:
  paper: "https://arxiv.org/abs/2512.15745"
  project: "https://github.com/inclusionAI/LLaDA2.X"
  model: "https://huggingface.co/collections/inclusionAI/llada20"
```

```yaml
# llada-2-0-uni.mdx
title: "LLaDA2.0-Uni: Unifying Multimodal Understanding and Generation with Diffusion Large Language Model"
date: 2026-04-23
summary: "A unified multimodal diffusion model for understanding, generation, editing, and interleaved reasoning."
tags: ["multimodal", "generation", "understanding"]
featured: false
draft: false
venue: "arXiv"
links:
  paper: "https://arxiv.org/abs/2604.20796"
  project: "https://github.com/inclusionAI/LLaDA2.0-Uni"
  code: "https://github.com/inclusionAI/LLaDA2.0-Uni"
  model: "https://huggingface.co/inclusionAI/LLaDA2.0-Uni"
```

Each file must wrap the shown YAML between `---` markers and add one factual summary paragraph below it.

- [ ] **Step 4: Add one launch blog post**

Create `src/content/blog/welcome-to-llada-research.mdx`:

```mdx
---
title: "Welcome to the LLaDA Research Index"
date: 2026-08-19
summary: "A new home for LLaDA models, papers, release notes, and technical perspectives."
tags: ["announcement"]
featured: false
draft: false
category: "Release"
readingTime: "2 min read"
links:
  project: "https://github.com/inclusionAI/LLaDA2.X"
---

This site brings together the LLaDA model family, publications, and technical updates in one continuously maintained research index.

Future notes will cover new releases, implementation details, and perspectives on diffusion language modeling.
```

- [ ] **Step 5: Validate all content**

Run: `npm run check && npm run test:run`

Expected: schemas load every entry and all unit tests pass.

- [ ] **Step 6: Commit initial research content**

```bash
git add src/content
git commit -m "content: add initial LLaDA research entries"
```

### Task 4: Build the visual system and global layouts

**Files:**
- Create: `public/favicon.svg`
- Create: `src/styles/global.css`
- Create: `src/styles/content.css`
- Create: `src/components/DiffusionMark.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/ContentLayout.astro`

- [ ] **Step 1: Create the brand token and global style sheet**

Define these root tokens at the top of `src/styles/global.css`, then implement the navigation, container, buttons, focus states, mobile menu, footer, and reduced-motion rules with the same tokens:

```css
:root {
  --ink: #12203d;
  --muted: #66738a;
  --paper: #f6f8fc;
  --surface: #ffffff;
  --line: #dce3ee;
  --accent: #315cff;
  --accent-soft: #e8edff;
  --night: #101a37;
  --radius-sm: 0.75rem;
  --radius-md: 1.25rem;
  --shadow: 0 1.5rem 4rem rgba(25, 45, 85, 0.11);
  --container: 76rem;
}

* { box-sizing: border-box; }
html { color-scheme: light; scroll-behavior: smooth; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
a { color: inherit; text-decoration: none; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 2: Create the document shell**

Implement `src/layouts/BaseLayout.astro` with this public interface:

```astro
---
import '../styles/global.css';
interface Props {
  title?: string;
  description?: string;
  image?: string;
}
const {
  title = 'LLaDA — Diffusion Language Models',
  description = 'Models, papers, and technical notes from the LLaDA research family.',
  image,
} = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const base = import.meta.env.BASE_URL;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href={`${import.meta.env.BASE_URL}favicon.svg`} />
    <link rel="alternate" type="application/rss+xml" title="LLaDA Blog" href={`${import.meta.env.BASE_URL}rss.xml`} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={new URL(image, Astro.site)} />}
    <title>{title}</title>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <a class="brand" href={base} aria-label="LLaDA home"><span aria-hidden="true">●</span> LLaDA</a>
      <nav aria-label="Primary navigation">
        <a href={`${base}models/`}>Models</a>
        <a href={`${base}papers/`}>Papers</a>
        <a href={`${base}blog/`}>Blog</a>
        <a href={`${base}about/`}>About</a>
        <a class="button button-dark" href="https://github.com/inclusionAI/LLaDA2.X" target="_blank" rel="noreferrer">GitHub ↗</a>
      </nav>
    </header>
    <main id="main-content"><slot /></main>
    <footer class="site-footer">
      <strong>LLaDA</strong>
      <nav aria-label="Research links">
        <a href="https://github.com/inclusionAI" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://huggingface.co/inclusionAI" target="_blank" rel="noreferrer">Hugging Face</a>
        <a href="https://www.modelscope.cn/organization/inclusionAI" target="_blank" rel="noreferrer">ModelScope</a>
        <a href="https://www.inclusion-ai.org/" target="_blank" rel="noreferrer">InclusionAI</a>
      </nav>
      <small>© 2026 InclusionAI</small>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Create the long-form layout and artwork**

`ContentLayout.astro` accepts `title`, `summary`, `date`, `tags`, and optional `authors`, wraps `<slot />` in `.prose`, and imports `content.css`. `DiffusionMark.astro` renders an accessible decorative SVG with `aria-hidden="true"`; the artwork uses only CSS variables and vector gradients, so no unlicensed bitmap is required.

- [ ] **Step 4: Add the favicon**

Create `public/favicon.svg` as a cobalt circle intersected by three navy diffusion rings. Include `role="img"` and `<title>LLaDA</title>`.

- [ ] **Step 5: Run type and build checks**

Run: `npm run check && npm run build`

Expected: static output builds without missing-layout or asset errors.

- [ ] **Step 6: Commit the visual foundation**

```bash
git add public src/layouts src/styles src/components/DiffusionMark.astro
git commit -m "feat: add LLaDA visual system"
```

### Task 5: Implement the content-first homepage

**Files:**
- Create: `src/components/FeaturedRelease.astro`
- Create: `src/components/ResearchColumn.astro`
- Create: `src/components/ResourceLinks.astro`
- Create: `src/pages/index.astro`
- Modify: `tests/content.test.ts`

- [ ] **Step 1: Add a failing mixed-collection featured test**

Extend `tests/content.test.ts` with a case that combines model, paper, and blog-shaped entries, marks an older paper featured, and expects `selectFeatured` to return it while each `sortPublished` call preserves per-collection ordering.

```ts
it('selects a featured entry across collection types', () => {
  const entries = [
    entry('model', '2026-08-01'),
    entry('paper', '2026-07-01', true),
    entry('post', '2026-08-19'),
  ];
  expect(selectFeatured(entries)?.id).toBe('paper');
});
```

- [ ] **Step 2: Run the targeted test**

Run: `npm run test:run -- tests/content.test.ts`

Expected: PASS with the existing deterministic helper; this locks the cross-collection requirement before UI work.

- [ ] **Step 3: Implement homepage components**

`ResourceLinks.astro` accepts the `links` object and renders only defined links in the order Project, Paper, Code, Model, ModelScope. External anchors use `target="_blank"` and `rel="noreferrer"`.

`FeaturedRelease.astro` accepts one normalized entry with `kind`, `id`, `data.title`, `data.summary`, `data.date`, and `data.links`. It renders a compact two-column release block and no viewport-height sizing. When `data.cover` is absent, it renders `DiffusionMark`; when a cover is present, it renders a dimensioned, lazy-loaded image.

`ResearchColumn.astro` accepts `title`, `href`, and up to three normalized entries. It renders an accessible heading, a chronological list, metadata, and a “View all” link.

- [ ] **Step 4: Compose the homepage**

Implement `src/pages/index.astro` with this data flow:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import FeaturedRelease from '../components/FeaturedRelease.astro';
import ResearchColumn from '../components/ResearchColumn.astro';
import { selectFeatured, sortPublished } from '../lib/content';

const [models, papers, posts] = await Promise.all([
  getCollection('models'),
  getCollection('papers'),
  getCollection('blog'),
]);
const publishedModels = sortPublished(models);
const publishedPapers = sortPublished(papers);
const publishedPosts = sortPublished(posts);
const featured = selectFeatured([
  ...publishedModels.map((entry) => ({ ...entry, kind: 'model' as const })),
  ...publishedPapers.map((entry) => ({ ...entry, kind: 'paper' as const })),
  ...publishedPosts.map((entry) => ({ ...entry, kind: 'blog' as const })),
]);
---
<BaseLayout>
  {featured && <FeaturedRelease entry={featured} />}
  <section class="research-index" aria-labelledby="research-index-title">
    <header><p class="eyebrow">Research index</p><h1 id="research-index-title">Explore LLaDA research</h1></header>
    <div class="research-grid">
      <ResearchColumn kind="model" title="Models" href="models/" entries={publishedModels.slice(0, 3)} />
      <ResearchColumn kind="paper" title="Papers" href="papers/" entries={publishedPapers.slice(0, 3)} />
      <ResearchColumn kind="blog" title="Blog" href="blog/" entries={publishedPosts.slice(0, 3)} />
    </div>
  </section>
</BaseLayout>
```

Use URL helpers based on `import.meta.env.BASE_URL` inside components so links work on both Pages deployment forms.

- [ ] **Step 5: Verify homepage output**

Run: `npm run test:run && npm run build`

Expected: build output contains the featured LLaDA2.2 release and all three homepage list headings.

- [ ] **Step 6: Commit the homepage**

```bash
git add src/components src/pages/index.astro tests/content.test.ts
git commit -m "feat: add content-first research homepage"
```

### Task 6: Build archive and detail routes

**Files:**
- Create: `src/components/ContentCard.astro`
- Create: `src/components/ArchiveFilter.astro`
- Create: `src/components/CitationCopy.astro`
- Create: `src/components/RelatedContent.astro`
- Create: `src/pages/models/index.astro`
- Create: `src/pages/models/[id].astro`
- Create: `src/pages/papers/index.astro`
- Create: `src/pages/papers/[id].astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[id].astro`
- Create: `src/pages/about.astro`

- [ ] **Step 1: Implement a reusable archive entry**

`ContentCard.astro` accepts `href`, `title`, `summary`, `date`, `tags`, and optional `meta` and `cover`. It uses `<article>`, a single heading link, a semantic `<time datetime>`, and a tag list. Missing covers render `DiffusionMark`, preserving a stable artwork aspect ratio without a broken image.

- [ ] **Step 2: Implement the three archive pages**

Each archive loads its collection, calls `sortPublished`, and renders a page title plus `ContentCard` list. Model cards include modality/status, paper cards include venue/resource links, and blog cards include category/reading time.

Add `ArchiveFilter.astro` above each list. It renders a search input and tag buttons with `data-filter-card`, `data-title`, and `data-tags` attributes. Its inline module script lowercases the query and selected tag, toggles the `hidden` attribute on non-matching cards, updates a live result count, and exposes a “Clear filters” button. With JavaScript disabled, every entry remains visible.

Use this filter predicate inside the module script:

```ts
const matches = (title: string, tags: string[], query: string, tag: string) => {
  const matchesQuery = !query || `${title} ${tags.join(' ')}`.toLowerCase().includes(query.toLowerCase());
  const matchesTag = !tag || tags.includes(tag);
  return matchesQuery && matchesTag;
};
```

- [ ] **Step 3: Implement static detail routes**

Each `[id].astro` exports `getStaticPaths()` from the corresponding non-draft collection and renders the entry body:

```astro
---
import { getCollection, render } from 'astro:content';
import ContentLayout from '../../layouts/ContentLayout.astro';

export async function getStaticPaths() {
  const entries = (await getCollection('blog')).filter(({ data }) => !data.draft);
  return entries.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<ContentLayout {...entry.data}>
  <Content />
</ContentLayout>
```

Use the same pattern with each route's collection type. Model and paper details render `ResourceLinks` above the MDX body.

Create `CitationCopy.astro` for paper entries with citation text. It renders a `<pre>` plus a button whose click handler calls `navigator.clipboard.writeText(citation)`, changes its label to “Copied,” and restores “Copy citation” after two seconds. The button is omitted when citation is absent.

Create `RelatedContent.astro` with `currentId`, `entries`, and `tags` props. It excludes the current entry, ranks candidates by shared-tag count and then date, and renders the first three. Model, paper, and blog detail routes pass entries from all three published collections so related research can cross content types.

- [ ] **Step 4: Implement the About page**

The page states that LLaDA is a diffusion language model family developed by InclusionAI at Ant Group and links to the verified organization, GitHub repositories, Hugging Face collections, and ModelScope listing. Do not add unverified team-member or performance claims.

- [ ] **Step 5: Verify every route builds**

Run: `npm run check && npm run build`

Expected: `dist/models`, `dist/papers`, `dist/blog`, and `dist/about` exist, with detail pages for every non-draft entry.

- [ ] **Step 6: Commit archives and details**

```bash
git add src/components/ContentCard.astro src/components/ArchiveFilter.astro src/components/CitationCopy.astro src/components/RelatedContent.astro src/pages/models src/pages/papers src/pages/blog src/pages/about.astro
git commit -m "feat: add research archives and detail pages"
```

### Task 7: Add feeds, 404 handling, and GitHub Pages deployment

**Files:**
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/404.astro`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Implement the RSS feed**

Create `src/pages/rss.xml.ts`:

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { sortPublished } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = sortPublished(await getCollection('blog'));
  return rss({
    title: 'LLaDA Research Blog',
    description: 'Release notes and technical perspectives from LLaDA research.',
    site: context.site!,
    items: posts.map(({ id, data }) => ({
      title: data.title,
      description: data.summary,
      pubDate: data.date,
      link: `${import.meta.env.BASE_URL}blog/${id}/`,
    })),
  });
}
```

- [ ] **Step 2: Implement branded 404 recovery**

Create `src/pages/404.astro` using `BaseLayout`. It contains “Page not found,” a one-sentence explanation, and links to Home, Models, Papers, and Blog. Use no client script.

- [ ] **Step 3: Implement the deployment workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:run
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Verify production build artifacts**

Run: `GITHUB_REPOSITORY=Ulov888/ant-llada npm run build && test -f dist/404.html && test -f dist/rss.xml && test -f dist/sitemap-index.xml`

Expected: command exits zero and all three files exist.

- [ ] **Step 5: Commit publishing support**

```bash
git add src/pages/rss.xml.ts src/pages/404.astro .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages publishing"
```

### Task 8: Add browser acceptance tests and perform visual QA

**Files:**
- Create: `playwright.config.ts`
- Create: `lighthouserc.json`
- Create: `tests/site.spec.ts`
- Modify: `src/styles/global.css`
- Modify: page/component files only when visual QA reveals a specific issue

- [ ] **Step 1: Configure Playwright against the built preview**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  webServer: {
    command: 'BASE_PATH=/ SITE_URL=http://127.0.0.1:4321 npm run build && npm run preview -- --host 127.0.0.1',
    port: 4321,
    reuseExistingServer: true,
  },
  use: { baseURL: 'http://127.0.0.1:4321' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

- [ ] **Step 2: Write the acceptance tests before final polish**

Create `tests/site.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('homepage exposes featured, models, papers, and blog content', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByText(/featured/i).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Papers' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
});

test('primary content routes are reachable', async ({ page }) => {
  for (const path of ['/models/', '/papers/', '/blog/', '/about/']) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBeTruthy();
    await expect(page.locator('h1')).toBeVisible();
  }
});

test('mobile homepage does not overflow horizontally', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('archive filters content without hiding the no-JavaScript source list', async ({ page }) => {
  await page.goto('/papers/');
  const cards = page.locator('[data-filter-card]');
  const total = await cards.count();
  await page.getByRole('searchbox').fill('multimodal');
  await expect(cards.filter({ visible: true })).not.toHaveCount(total);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(cards).toHaveCount(total);
});

test('404 page offers recovery links', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
});
```

- [ ] **Step 3: Run tests to expose unfinished behavior**

Run: `npx playwright install chromium webkit && npm run test:e2e`

Expected: tests identify any route, heading, visibility, or mobile-overflow mismatch that remains.

- [ ] **Step 4: Perform visual QA and fix concrete issues**

Inspect desktop and mobile screenshots of Home, one paper detail, one blog detail, and 404. Fix only observed issues in spacing, type scale, focus visibility, overflow, contrast, and reduced-motion behavior. Ensure the featured block remains compact and all three research columns are visible near the top of the desktop page.

Create `lighthouserc.json` with explicit category budgets:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

- [ ] **Step 5: Run the complete verification suite**

Run:

```bash
npm run test:run
npm run check
npm run build
npm run test:e2e
npm run test:lighthouse
git diff --check
```

Expected: every command exits zero; unit and browser tests pass; Astro reports no errors; Git reports no whitespace errors.

- [ ] **Step 6: Commit acceptance coverage and final polish**

```bash
git add playwright.config.ts lighthouserc.json tests/site.spec.ts src
git commit -m "test: verify LLaDA research site experience"
```

### Task 9: Final release review

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document local authoring and publishing**

Create `README.md` with commands for `npm install`, `npm run dev`, `npm run test:run`, `npm run build`, and `npm run test:e2e`. Document the three content directories, required frontmatter, `featured` and `draft` behavior, and GitHub Pages repository settings.

- [ ] **Step 2: Verify repository state and last production build**

Run:

```bash
npm ci
npm run test:run
npm run check
npm run build
npm run test:e2e
git status --short
```

Expected: all commands pass and the worktree contains only the intended README change before committing.

- [ ] **Step 3: Commit release documentation**

```bash
git add README.md
git commit -m "docs: add site authoring guide"
```

- [ ] **Step 4: Stop the brainstorming companion**

Run:

```bash
/Users/liulin/.agents/skills/brainstorming/scripts/stop-server.sh /Users/liulin/workspace/docs/website/.superpowers/brainstorm/73635-1787118767
```

Expected: the companion server stops; `.superpowers/` remains ignored by Git.
