# LLaDA Homepage Research Updates

## Goal

Replace the single-item `Latest` strip with a compact, automatically maintained research-updates list, and rewrite the research-index introduction in an institutional voice rather than addressing the visitor.

## Editorial structure

The update list contains four entries selected automatically from published content:

1. the two newest papers;
2. the newest released model, excluding models whose status is `preview`;
3. the newest blog post.

Items remain grouped by this editorial mix rather than merged into one chronological feed. This keeps papers prominent while guaranteeing representation for a released model and a technical update.

## Research updates component

Replace the current `FeaturedRelease` single-entry strip with a `ResearchUpdates` component that accepts four typed entries. The section uses the visible heading `Research updates` and exposes the same label as its accessible name.

Each entry displays:

- content type (`Paper`, `Model`, or `Note`);
- title, using `shortTitle` when provided;
- publication date;
- a directional arrow.

Desktop uses a compact two-column by two-row grid. Mobile collapses to four stacked rows. Dividers, typography, hover/focus motion, and color remain within the existing dark visual system. Titles may wrap naturally; no horizontal scrolling or clipped identifying text is allowed.

## Research index copy

Replace the current introduction with:

- Eyebrow: `Research program`
- Heading: `Diffusion language models, from foundations to scale.`
- Description: `Models, papers, and technical notes across the LLaDA research program.`

The Models, Papers, and Blog columns and their existing entry counts remain unchanged.

## Data and fallback behavior

The homepage derives entries from the existing sorted, production-visible content collections. Drafts remain excluded in production. The released-model selector skips `preview` entries and selects the newest remaining model.

If a content category has fewer entries than requested, the component renders the available entries without placeholders or invented content. Links continue to use the deployment base path helper.

## Verification

- Assert four update entries with the expected mix: two papers, one released model, and one note.
- Assert the preview model does not occupy the model update slot.
- Assert the new institutional research-index copy and absence of `Latest`.
- Verify desktop 2×2 and mobile four-row layouts, readable wrapping, keyboard focus, and no horizontal overflow.
- Run unit tests, Astro diagnostics, all Playwright projects, both deployment-path builds, Lighthouse, and repository hygiene checks.
