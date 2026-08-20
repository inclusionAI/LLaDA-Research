# LLaDA Family Catalog Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the main LLaDA text-model lineage and its primary papers to the complete Models and Papers archives without making the homepage a full catalog.

**Architecture:** Preserve the existing Astro content collections and dynamic detail routes. Add one MDX entry per research/model family, group Base/Instruct/CAP checkpoints inside the body of that family page, and rely on the existing newest-first selection to keep the homepage concise.

**Tech Stack:** Astro content collections, MDX, Zod schemas, Vitest, Playwright, Lighthouse CI

---

### Task 1: Lock the expanded catalog contract

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Add failing archive count and lineage assertions**

Add a test that expects 10 model cards and 9 paper cards, then checks these model headings: `LLaDA-8B`, `LLaDA 1.5`, `LLaDA-MoE 7B-A1B`, `LLaDA2.0`, `LLaDA2.1`, `iLLaDA-8B`, `LLaDA2.2`, `LLaDA MoE v2`, `LLaDA2.X`, and `LLaDA2.0-Uni`.

Check these paper headings: `Large Language Diffusion Models`, `LLaDA 1.5: Variance-Reduced Preference Optimization for Large Language Diffusion Models`, `LLaDA-MoE: A Sparse MoE Diffusion Language Model`, `Improved Large Language Diffusion Models`, and `LLaDA MoE v2: Scaling Mixture-of-Experts Diffusion Language Models`.

- [ ] **Step 2: Add failing internal route assertions**

Visit and require successful responses for:

```ts
const modelRoutes = [
  '/models/llada-8b/',
  '/models/llada-1-5/',
  '/models/llada-moe-7b-a1b/',
  '/models/llada-2-0/',
  '/models/llada-2-1/',
  '/models/illada-8b/',
  '/models/llada-2-2/',
  '/models/llada-moe-v2/',
];
const paperRoutes = [
  '/papers/large-language-diffusion-models/',
  '/papers/llada-1-5/',
  '/papers/llada-moe/',
  '/papers/improved-large-language-diffusion-models/',
  '/papers/llada-moe-v2/',
];
```

- [ ] **Step 3: Verify red**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'complete llada lineage|expanded llada detail routes'`

Expected: FAIL because the archive counts, headings, and routes do not yet exist.

### Task 2: Add the missing model families

**Files:**
- Create: `src/content/models/llada-8b.mdx`
- Create: `src/content/models/llada-1-5.mdx`
- Create: `src/content/models/llada-moe-7b-a1b.mdx`
- Create: `src/content/models/llada-2-0.mdx`
- Create: `src/content/models/llada-2-1.mdx`
- Create: `src/content/models/illada-8b.mdx`
- Create: `src/content/models/llada-2-2.mdx`
- Create: `src/content/models/llada-moe-v2.mdx`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Create entries with exact catalog metadata**

Use this manifest as the source of frontmatter values:

| ID | Title | Date | Family | Status | Summary |
|---|---|---:|---|---|---|
| `llada-8b` | LLaDA-8B | 2025-02-14 | LLaDA 1.x | released | The original dense 8B diffusion language model, released in Base and Instruct checkpoints. |
| `llada-1-5` | LLaDA 1.5 | 2025-05-25 | LLaDA 1.x | released | Variance-reduced preference optimization improves math, code, instruction following, and alignment. |
| `llada-moe-7b-a1b` | LLaDA-MoE 7B-A1B | 2025-09-11 | LLaDA MoE | released | A sparse diffusion language model with 7B total capacity and about 1.4B active parameters. |
| `llada-2-0` | LLaDA2.0 | 2025-12-10 | LLaDA 2.x | released | The mini and flash MoE family scales diffusion language modeling from 16B to 100B parameters. |
| `llada-2-1` | LLaDA2.1 | 2026-02-09 | LLaDA 2.x | released | Joint Mask-to-Token and Token-to-Token editing accelerates 16B and 100B diffusion models. |
| `illada-8b` | iLLaDA-8B | 2026-06-24 | LLaDA 1.x | released | Improved Base and Instruct checkpoints raise benchmark quality and generation efficiency. |
| `llada-2-2` | LLaDA2.2 | 2026-07-01 | LLaDA 2.x | released | A flash checkpoint for agentic diffusion generation through Levenshtein editing. |
| `llada-moe-v2` | LLaDA MoE v2 | 2026-08-04 | LLaDA MoE | preview | A 30B-A3B model that establishes practical scaling laws for MoE diffusion language models. |

Every entry uses `modality: "Language"`, `draft: false`, and appropriate tags. Add `license: "MIT"` only to LLaDA-8B, `license: "Apache-2.0"` to iLLaDA and LLaDA2.x entries, and omit an unverified license elsewhere.

- [ ] **Step 2: Add exact primary links**

Use these primary URLs:

```text
Original repository: https://github.com/ML-GSAI/LLaDA
Original paper: https://arxiv.org/abs/2502.09992
LLaDA-8B Base: https://huggingface.co/GSAI-ML/LLaDA-8B-Base
LLaDA-8B Instruct: https://huggingface.co/GSAI-ML/LLaDA-8B-Instruct
LLaDA 1.5 repository: https://github.com/ML-GSAI/LLaDA-1.5
LLaDA 1.5 paper: https://arxiv.org/abs/2505.19223
LLaDA 1.5 model: https://huggingface.co/GSAI-ML/LLaDA-1.5
LLaDA-MoE paper: https://arxiv.org/abs/2509.24389
LLaDA-MoE Base: https://huggingface.co/inclusionAI/LLaDA-MoE-7B-A1B-Base
LLaDA-MoE Instruct: https://huggingface.co/inclusionAI/LLaDA-MoE-7B-A1B-Instruct
LLaDA2.X repository: https://github.com/inclusionAI/LLaDA2.X
LLaDA2.0 paper: https://arxiv.org/abs/2512.15745
LLaDA2.0 collection: https://huggingface.co/collections/inclusionAI/llada20
LLaDA2.1 paper: https://arxiv.org/abs/2602.08676
LLaDA2.1 collection: https://huggingface.co/collections/inclusionAI/llada21
iLLaDA paper: https://arxiv.org/abs/2606.25331
iLLaDA Base: https://huggingface.co/GSAI-ML/iLLaDA-8B-Base
iLLaDA Instruct: https://huggingface.co/GSAI-ML/iLLaDA-8B-Instruct
LLaDA2.2 report: https://github.com/inclusionAI/LLaDA2.X/blob/main/LLaDA2_2_tech_report.pdf
LLaDA2.2 model: https://huggingface.co/inclusionAI/LLaDA2.2-flash
LLaDA MoE v2 paper: https://arxiv.org/abs/2608.03457
```

Place one representative checkpoint in `links.model` and list every sibling checkpoint as a Markdown link in the body. The MoE v2 page has only `links.paper` and `status: preview`.

- [ ] **Step 3: Explain variants without unsupported claims**

Each body contains two or three short paragraphs: the method contribution, the confirmed parameter/activation scale, and a `Checkpoints` list where weights exist. Explicitly distinguish LLaDA-MoE 7B-A1B from the separate LLaDA2.0 16B/100B MoE family.

- [ ] **Step 4: Verify model archive and routes**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'complete llada lineage|expanded llada detail routes'`

Expected: model assertions pass; paper assertions remain red until Task 3.

- [ ] **Step 5: Commit**

```bash
git add src/content/models tests/site.spec.ts
git commit -m "content: add llada language model lineage"
```

### Task 3: Add missing primary papers and correct dates

**Files:**
- Create: `src/content/papers/large-language-diffusion-models.mdx`
- Create: `src/content/papers/llada-1-5.mdx`
- Create: `src/content/papers/llada-moe.mdx`
- Create: `src/content/papers/improved-large-language-diffusion-models.mdx`
- Create: `src/content/papers/llada-moe-v2.mdx`
- Modify: `src/content/papers/llada-2-0.mdx`
- Modify: `src/content/papers/llada-2-1.mdx`
- Test: `tests/site.spec.ts`

- [ ] **Step 1: Add the five paper entries**

Use exact titles, dates, and summaries:

| ID | Title | Date | Summary |
|---|---|---:|---|
| `large-language-diffusion-models` | Large Language Diffusion Models | 2025-02-14 | Introduces LLaDA-8B and shows that masked diffusion can support scalable language modeling and instruction following. |
| `llada-1-5` | LLaDA 1.5: Variance-Reduced Preference Optimization for Large Language Diffusion Models | 2025-05-25 | Introduces VRPO to reduce gradient variance when aligning masked diffusion language models with preferences. |
| `llada-moe` | LLaDA-MoE: A Sparse MoE Diffusion Language Model | 2025-09-29 | Trains a sparse 7B-A1B diffusion language model from scratch on approximately 20T tokens. |
| `improved-large-language-diffusion-models` | Improved Large Language Diffusion Models | 2026-06-24 | Introduces iLLaDA-8B with improved benchmark performance and generation efficiency. |
| `llada-moe-v2` | LLaDA MoE v2: Scaling Mixture-of-Experts Diffusion Language Models | 2026-08-04 | Derives scaling principles for MoE diffusion language models and trains a 30B-A3B model. |

Every paper uses `venue: "arXiv"`, `draft: false`, `featured: false`, language/MoE/alignment tags as appropriate, and the exact arXiv links from Task 2. Link code and representative models only where a primary URL was verified.

- [ ] **Step 2: Correct existing first-submission dates**

Change LLaDA2.0 from `2025-12-17` to `2025-12-10`, and LLaDA2.1 from `2026-02-10` to `2026-02-09`. Do not alter their titles, citations, or factual bodies.

- [ ] **Step 3: Verify all catalog assertions turn green**

Run: `npx playwright test tests/site.spec.ts --project=desktop -g 'complete llada lineage|expanded llada detail routes|archive filters'`

Expected: all focused assertions pass, including 10 model cards, 9 paper cards, routes, and search filtering.

- [ ] **Step 4: Commit**

```bash
git add src/content/papers tests/site.spec.ts
git commit -m "content: add primary llada papers"
```

### Task 4: Production acceptance

**Files:**
- Modify only files required by verification evidence.

- [ ] **Step 1: Run unit, schema, and browser checks**

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

- [ ] **Step 3: Inspect desktop and mobile archive screenshots**

Capture `/models/` and `/papers/` at 1440×1000 and 390×844. Verify scanning density, long-title wrapping, card art, filter behavior, and absence of horizontal overflow.

- [ ] **Step 4: Run Lighthouse and hygiene checks**

```bash
BASE_PATH=/ SITE_URL=http://127.0.0.1:4321 npm run build
npm run test:lighthouse
git diff --check
git status --short --branch
```

Expected: all configured category and audit assertions pass; worktree is clean and no remote push occurs.
