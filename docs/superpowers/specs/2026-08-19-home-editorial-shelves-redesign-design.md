# LLaDA Homepage Editorial Shelves Redesign

## Goal

Replace the homepage's database-like research grid with an editorial three-column shelf while preserving immediate access to Models, Papers, and Blog. Rewrite generic placeholder copy into concise, technically grounded LLaDA language.

## Visual hierarchy

The homepage has three layers:

1. The Hero establishes the LLaDA identity through the Mask-to-Token diffusion field.
2. A compact Latest strip signals the newest release.
3. An editorial shelf exposes Models, Papers, and Notes in one view.

The content area must feel like a research publication, not a bordered dashboard.

## Copy

### Hero

- Kicker: `LLaDA / Diffusion Language Models`
- Title: `Language, diffused.`
- Summary: `LLaDA turns masked noise into language through iterative, parallel denoising—an open alternative to left-to-right generation.`
- CTAs: `Explore the models` and `Read the papers`

### Latest

- Label: `Latest`
- Use a concise, release-specific title rather than the full paper title.
- Retain type and date on desktop; show only label, short title, and arrow on mobile.

### Research shelf

- Eyebrow: `The work`
- Heading: `Models. Papers. Notes.`
- Description: `The LLaDA research program, in one view.`
- Column descriptions:
  - Models: `Open checkpoints for language and multimodal generation.`
  - Papers: `Methods for scaling, accelerating, and extending diffusion language models.`
  - Blog: `Release notes, implementation details, and research perspectives.`
- CTAs: `Explore all models`, `Browse all papers`, and `Read all notes`.

Content frontmatter summaries must state the contribution directly and avoid empty phrases such as “new home,” “future releases,” or “official project.”

## Desktop layout

- Leave 72–96px between Latest and the research shelf.
- Present the shelf heading as an editorial lead-in, without a bottom border.
- Use three equal columns separated by 48–64px gutters and no vertical rules.
- Do not force equal column height.
- Remove column numbers and entry counts.
- Each column has a title, one-sentence description, one lead entry, compact secondary entries, and a CTA immediately after its content.
- The lead entry shows metadata, a 19–22px title, and a two-line summary.
- Secondary entries show metadata, a 14–16px title, and no long summary.
- Do not draw borders between entries or above CTAs.

## Mobile layout

- Stack the three columns vertically without horizontal scrolling.
- Use 64–80px between columns.
- Retain one low-contrast separator only between columns.
- Keep the lead summary and compact secondary entries.
- CTAs follow each column's content rather than aligning to an artificial bottom edge.

## Interaction

- Hero remains the only particle-heavy area.
- Entry hover brightens and shifts the title up to 3px, moves the arrow 2px, and introduces a very subtle local radial highlight.
- Lead entries include a small token marker that crossfades from `[MASK]` to `[MODEL]`, `[PAPER]`, or `[NOTE]` on hover.
- Latest hover moves only its arrow and may show a faint left-to-right scan.
- Reduced-motion mode keeps all content static.

## Lines

Retain only the header divider, the Latest strip's top and bottom rules, mobile separators between columns, and short CTA hover underlines. Remove the Hero bottom rule, research heading rule, research grid bottom rule, desktop column dividers, entry rules, CTA top rules, and all card frames.

## Responsive and accessibility requirements

- Models, Papers, and Blog remain visible in the initial homepage content flow.
- Mobile layouts must not overflow horizontally.
- Text contrast remains WCAG AA compliant.
- Token animation is decorative and must not disturb link accessible names.
- Existing reduced-motion behavior remains intact.

## Verification

- Add Playwright assertions that desktop shelves have no vertical or item rules, lead and secondary entries expose distinct classes, and mobile columns retain separators without overflow.
- Run unit tests, Astro check, root and `/ant-llada` builds, all Playwright projects, Lighthouse assertions, and visual screenshots at desktop and mobile sizes.
