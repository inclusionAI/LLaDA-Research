# LLaDA Dark Research Website Redesign

## Purpose

Redesign the existing Astro research site into a distinctive, cinematic LLaDA publication hub. The result should have the restraint and precision of a top-tier AI laboratory website while retaining immediate access to models, papers, and blog posts.

The design may learn from Moonshot's use of darkness, negative space, restrained typography, and responsive light, but it must not reproduce Moonshot's moon, halo, wordmark treatment, composition, or branded motion. LLaDA's identity comes from parallel diffusion decoding: masked noise resolves into readable language in multiple places at once.

## Approved direction

- Use an immersive black theme across the complete site.
- Keep the homepage hero near 55 viewport-height units rather than full-screen.
- Place the high-energy visual field between 60% and 72% of the desktop width, leaving stable negative space for copy on the left.
- Use `Language, diffused.` as the homepage statement, with a short explanatory line beneath it.
- Render one compact, 47-pixel featured-content strip directly below the hero.
- Follow immediately with a border-based, three-column Models, Papers, and Blog index.
- Avoid white cards, blue gradients, glass-heavy surfaces, oversized round corners, and generic AI-starfield imagery.

## Visual system

The palette is near-black, warm white, and neutral gray with only a trace of cool light inside the interactive field. Content contrast remains WCAG AA compliant even though decorative chrome is deliberately subdued.

Typography is clean and quiet. Display text uses medium or regular weight rather than bold marketing typography. Labels, dates, states, and technical metadata use a monospaced face. Headings use tight but readable tracking, and body text retains comfortable line height.

Surfaces are defined through one-pixel rules, spacing, and tonal differences rather than floating cards. Corners stay small. Hover effects use light, position, and line changes instead of large elevation shadows.

## Header and navigation

The desktop header is approximately 64 pixels high. It contains the LLaDA identity on the left and Models, Papers, Blog, About, and GitHub links on the right. Its background is transparent or nearly black and becomes slightly more opaque while scrolling.

Navigation text is low contrast at rest and warm white on hover or focus. GitHub is a normal text link with an external arrow rather than a prominent pill button. The mobile menu follows the same visual language and remains fully keyboard accessible.

## Homepage hero

The hero occupies approximately 55vh on desktop, excluding the header and featured strip. The title and explanation sit on the left, with enough negative space that decorative particles never reduce legibility. The interactive field has greater visual energy toward the right.

The hero must not contain a large content card. It contains only:

- the LLaDA statement;
- one concise explanation of diffusion language modeling;
- optional understated links to the latest model and paper;
- the interactive Mask-to-Token field.

The bottom of a typical desktop viewport should reveal the research-index heading or column titles. This makes it clear that the site is a research archive rather than a product landing page.

## Mask-to-Token field

The field is a custom Canvas component, not an image or video. Its static silhouette is an offset, boundaryless parallel decoding field rather than a circle, moon, planet, or halo.

Particles represent four visual states:

1. Low-energy noise and small square fragments.
2. Masked states such as `[MASK]`, `[ · ]`, and quiet block glyphs.
3. Partial subword or letter states such as `La`, `DA`, `tion`, and `∇x`.
4. Resolved LLaDA and language tokens in the local high-energy area.

Pointer interaction follows a deliberate sequence lasting roughly 700–1200 milliseconds:

1. nearby particles bend and attach to the pointer field;
2. mask glyphs become visible;
3. several positions decode in parallel into letters and subword tokens;
4. a restrained energy trail dissipates after the pointer moves away.

The field is low-luminance and slowly breathing at rest. Only a limited number of tokens may reach full brightness simultaneously. Fast pointer movement produces a clearer trail, but the effect must settle rather than continuously flash.

The Canvas measures frame rate and reduces particle density when sustained performance drops. Mobile uses fewer particles and shorter trails while retaining touch-local decoding. `prefers-reduced-motion` replaces animation with a deliberately composed static `[MASK] → token` field rather than an accidental frozen frame.

The meaningful title, explanation, and links remain normal HTML. The Canvas is decorative and hidden from assistive technology.

## Featured strip

The featured module is a full-width editorial transition approximately 47 pixels high, bounded by low-contrast top and bottom rules. The row is entirely clickable and contains:

- `FEATURED / 01` at the left;
- the content title and kind in the middle;
- date and a directional arrow at the right.

Hover moves the title only 4–6 pixels and brightens the arrow. It does not change the whole row to a bright background. On narrow screens the kind or date may collapse, but the title and link remain visible.

Featured-content selection continues to use the existing deterministic content rules: newest explicitly featured published entry, otherwise newest published entry.

## Research index

The homepage index begins immediately after the featured strip. Models, Papers, and Blog use a shared baseline grid and appear as three desktop columns separated by vertical rules. They are not enclosed in individual cards.

Each column keeps information appropriate to its content:

- Models emphasize version, modality, release date, and concise capability summary.
- Papers emphasize venue, date, and concise research contribution.
- Blog emphasizes category, publication date, estimated reading time when available, and summary.

Column titles are approximately 18–22 pixels. Entry titles remain the strongest element, metadata is monospaced and muted, and summaries are clamped to two lines. Hover brightens the title and advances a small arrow. Each column ends with a quiet link to its full archive.

On mobile the columns stack in Models, Papers, Blog order. The first entry of every section remains easy to reach without excessive decorative space.

## Archive, detail, and supporting pages

Models, Papers, Blog, About, 404, search/filter controls, related-content modules, citation controls, and the footer adopt the same dark visual system.

Archive pages retain their current content and filtering behavior but replace floating pale cards with ruled lists. Detail pages use a focused reading column, dark code and citation surfaces, quiet tags, and strong heading rhythm. Related content uses divided rows rather than cards. The footer remains compact and black, separated from page content by a rule rather than a contrasting block.

Existing functionality remains intact:

- Astro and MDX content collections;
- local draft preview and production draft exclusion;
- query and tag filtering;
- citation copy controls;
- related-content recommendations;
- RSS, sitemap, canonical metadata, and branded 404;
- GitHub Pages root-path and project-path deployments.

## Responsive behavior

Desktop uses the offset particle composition and three-column index. Tablet reduces hero copy width, particle count, and column spacing. Mobile uses a shorter but still expressive hero, fewer tokens, touch-local decoding, a compact featured row, and a single-column content index.

The mobile design must not depend on hover. Navigation, feature links, filters, and citation controls must have visible focus and pressed states. No viewport may scroll horizontally.

## Component boundaries

- `DenoiseField` owns Canvas lifecycle, density adaptation, pointer/touch behavior, and motion preferences. It receives no content-collection data.
- `ResearchHero` owns semantic hero copy and positions `DenoiseField`.
- `FeaturedRelease` becomes the compact editorial strip and continues to receive one selected entry.
- `ResearchColumn` renders kind-specific metadata while retaining one shared entry structure.
- `BaseLayout` owns the global dark navigation, footer, metadata, and page background.
- Archive and content layouts own page-specific spacing and ruled-list styling.

This separation keeps the particle implementation replaceable without coupling it to publishing logic.

## Failure and fallback behavior

- If Canvas initialization fails, render the static Mask-to-Token composition.
- If JavaScript is disabled, all text, navigation, featured content, and research entries remain available.
- Missing featured content omits the strip without leaving empty height.
- Missing optional metadata or links does not render empty labels or controls.
- Low frame rate lowers particle density gradually and never removes meaningful content.
- Reduced-motion mode avoids continuous motion and pointer trails.

## Verification and acceptance

The redesign is accepted when:

- the hero is approximately 55vh and is not a full-screen marketing block;
- the featured row remains compact and the research-index heading or column titles are visible near the initial desktop fold;
- the field visibly progresses from noise and masks to parallel readable tokens under pointer interaction;
- the visual silhouette does not resemble a moon, planet, or Moonshot branding;
- Models, Papers, and Blog are visible as ruled lists on the homepage;
- all supporting pages use the same dark visual system;
- mobile navigation and touch decoding work without horizontal overflow;
- reduced-motion and no-JavaScript fallbacks remain coherent;
- existing content, filtering, citation, RSS, sitemap, and deployment tests remain green;
- representative Chrome and WebKit E2E tests pass;
- representative Lighthouse Performance, Accessibility, and SEO scores remain at least 90;
- production builds succeed for both `/` and `/ant-llada/` base paths.

## Out of scope

- Copying Moonshot's moon, halo, artwork, word treatment, or source code.
- Adding hosted model inference or a prompt box.
- Replacing the Markdown/MDX publishing workflow.
- Introducing a heavy WebGL framework when Canvas 2D meets the visual and performance requirements.
