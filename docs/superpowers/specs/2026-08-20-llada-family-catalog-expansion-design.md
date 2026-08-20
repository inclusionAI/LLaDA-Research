# LLaDA Family Catalog Expansion

## Goal

Expand the site from a small LLaDA 2.x sample into a source-backed catalog of the main text-language lineage, while retaining LLaDA2.0-Uni as the current unified multimodal branch.

## Source policy

Only first-party or primary sources may support catalog entries:

- arXiv papers and technical reports;
- official GitHub repositories under `ML-GSAI` and `inclusionAI`;
- official Hugging Face checkpoints under `GSAI-ML` and `inclusionAI`;
- the official LLaDA2.X repository and model collections.

Community fine-tunes, unrelated projects also named LLaDA, and third-party acceleration papers are outside this catalog expansion.

## Catalog structure

Checkpoint variants that share one method and paper belong to one model page. For example, LLaDA-8B Base and Instruct share one page, and LLaDA2.0 mini, flash, and CAP variants share one page. This avoids turning the archive into a list of nearly identical checkpoints.

### Model entries

1. **LLaDA-8B** — Base and Instruct; the original dense 8B masked diffusion language model trained from scratch.
2. **LLaDA 1.5** — the VRPO-aligned successor to LLaDA-8B-Instruct.
3. **LLaDA-MoE 7B-A1B** — Base and Instruct; a sparse MoE model with 7B total capacity and about 1.4B active parameters.
4. **LLaDA2.0** — mini 16B, flash 100B, and Confidence-Aware Parallel variants.
5. **LLaDA2.1** — mini and flash models using joint Mask-to-Token and Token-to-Token editing.
6. **iLLaDA-8B** — Base and Instruct; an improved dense LLaDA line with better benchmark performance and generation efficiency.
7. **LLaDA2.2** — the flash checkpoint for agentic diffusion with Levenshtein editing.
8. **LLaDA MoE v2** — the 30B-A3B scaling study model; mark as preview until a primary public checkpoint URL is verified.
9. **LLaDA2.X** — retain the existing umbrella series page.
10. **LLaDA2.0-Uni** — retain the current unified multimodal model page.

### Paper entries

1. **Large Language Diffusion Models** — arXiv:2502.09992.
2. **LLaDA 1.5: Variance-Reduced Preference Optimization for Large Language Diffusion Models** — arXiv:2505.19223.
3. **LLaDA-MoE: A Sparse MoE Diffusion Language Model** — arXiv:2509.24389.
4. **LLaDA2.0: Scaling Up Diffusion Language Models to 100B** — retain and correct its first arXiv date to 2025-12-10.
5. **LLaDA2.1: Speeding Up Text Diffusion via Token Editing** — retain and correct its first arXiv date to 2026-02-09.
6. **Improved Large Language Diffusion Models** — iLLaDA, arXiv:2606.25331.
7. **LLaDA2.2 Technical Report** — retain the repository technical report.
8. **LLaDA MoE v2: Scaling Mixture-of-Experts Diffusion Language Models** — arXiv:2608.03457.
9. **LLaDA2.0-Uni** — retain the unified multimodal paper.

## Entry content

Each model page must include:

- what changed relative to the preceding line;
- checkpoint variants and parameter/activation scale when confirmed;
- the official paper, repository, and weight links that are available;
- a concise distinction from similarly named LLaDA branches.

Each paper page must include:

- the primary contribution;
- the model or checkpoint family it introduces;
- the arXiv identifier and primary links;
- a concise citation when author metadata is already verified.

No page should invent benchmark claims, licenses, checkpoint availability, or release status. `LLaDA MoE v2` remains `preview` without a verified public checkpoint.

## Homepage and archive behavior

- The homepage remains an editorial preview, not a complete catalog. It continues to show only the newest three model entries and newest four papers.
- `/models/` and `/papers/` become the complete catalog and remain sorted newest first.
- Existing search/filter behavior must include every new entry and its tags.
- The visual system remains unchanged; this task adds content, not cards, tabs, or navigation sections.

## Verification

- Assert expected model and paper counts from source files and rendered archives.
- Assert the main lineage entries and corrected dates are present.
- Assert every new internal detail route returns successfully.
- Assert external URLs use HTTPS and no draft entry appears in production.
- Run unit tests, Astro diagnostics, both GitHub Pages builds, all Playwright projects, Lighthouse, and repository hygiene checks.
