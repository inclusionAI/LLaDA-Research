# LLaDA Site Typography System

## Goal

Establish a consistent research-institution typography system across the homepage, archives, detail pages, About, and 404 pages. The system must make headings, explanations, metadata, entries, and long-form text immediately distinguishable without changing the site's dark visual identity or content structure.

## Typographic character

The site keeps its existing system sans-serif and monospace stacks. It does not load a network font. The sans-serif face carries titles, explanations, and prose; monospace is reserved for metadata, labels, dates, and technical readouts.

The hierarchy uses four coordinated signals:

1. size, with a meaningful step between adjacent levels;
2. weight, with titles slightly firmer than descriptions and prose;
3. color, with titles near the primary ink and supporting copy in a readable muted tone;
4. spacing, so labels, headings, descriptions, and entries form recognizable groups.

## Global type roles

Add shared CSS custom properties for the sans and monospace stacks and for the recurring metadata, small text, body, and large-body sizes. Components may retain fluid display sizes, but repeated roles must consume the shared tokens rather than introduce unrelated small values.

Minimum desktop targets:

- primary navigation and buttons: 12px;
- eyebrow and metadata: 11px;
- supporting descriptions and card summaries: 14–15px;
- long-form prose: 17px;
- section titles: 28–32px;
- archive card titles: at least 24px;
- detail-page summaries: at least 18px.

Mobile typography may scale down display headings, but body text and interactive labels must keep their readable minimums.

## Homepage hierarchy

The Research program statement remains the dominant heading below the hero. Its description becomes a large supporting line rather than small metadata.

Within each Models, Papers, and Blog column:

- the column title becomes a clear 28–32px section heading;
- the column description becomes 15px supporting text with a wider line height and stronger muted contrast;
- the lead entry title stays visibly below the column title but above compact entry titles;
- lead summaries use readable 14–15px body text;
- compact entry titles remain at least 16px;
- metadata and calls to action remain compact but no smaller than the shared label size.

The Research updates list follows the same system: metadata uses the monospace label role, while update titles use a distinct 16–19px editorial title role.

## Archives and detail pages

Archive introductions preserve their large display titles. Their explanatory text increases to a large-body role. Archive cards use a firmer title, 15–16px summary text, readable metadata, and appropriately sized actions and tags.

Detail pages use a 17px prose base with approximately 1.75 line height and a controlled reading width. The page summary is 18–22px. Prose headings, related-content titles, citations, resource links, and sidebar metadata follow the same hierarchy rather than reverting to undersized component-specific values.

About and 404 supporting paragraphs use the large-body role. Navigation, filters, tags, and buttons are raised to the global readable label floor.

## Scope and non-goals

This change does not alter copy, content selection, routes, color theme, page structure, or responsive breakpoints except where spacing must change to accommodate the new type scale. It does not add a typeface dependency or redesign cards.

## Verification

- Assert computed size relationships on the homepage: section title > lead title > compact title > description/metadata.
- Assert archive page introductions, card titles, summaries, and metadata meet their minimums.
- Assert detail summaries and prose meet their minimums.
- Assert navigation, buttons, and filters meet the readable label floor.
- Verify no text clipping or horizontal overflow at 1440×1000, 901×900, and 390×844.
- Inspect homepage, archive, detail, About, and 404 screenshots at desktop and mobile sizes.
- Run unit tests, Astro diagnostics, all Playwright projects, both deployment-path builds, Lighthouse, and repository hygiene checks.
