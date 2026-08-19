# Homepage Readable Type Scale

## Goal

Improve homepage legibility without changing the approved editorial shelf layout or making the interface feel oversized.

## Type scale

- Body and summaries: 13–16px depending on viewport and role.
- Metadata, token labels, Latest metadata, and CTAs: no smaller than 11px.
- Column descriptions: 13px with generous line height.
- Lead titles: 21–24px.
- Compact titles: 15–17px.
- Column titles: 22–24px.
- Hero summary: 15–17px; Hero CTAs: 12px.
- Section description: 14px.

The display headline remains unchanged because it is already legible and visually dominant.

## Layout constraints

- Preserve the three-column desktop shelf and stacked mobile layout.
- Keep the Latest strip at exactly 47px.
- Prevent lead summaries from clipping at the 901px narrow-desktop boundary.
- Preserve current whitespace hierarchy and avoid adding borders or cards.

## Accessibility and verification

- Verify computed font sizes at desktop and mobile widths.
- Verify no horizontal overflow.
- Verify lead summaries remain fully visible at 901px.
- Run unit, Astro, dual-base build, Playwright, and Lighthouse checks.
