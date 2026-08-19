# Ant-LLaDA Research Website Design

## Purpose

Build an English-first website for the LLaDA 2.x research family. The site will act as the official content index for models, papers, and technical blog posts. It will be statically generated, easy to maintain through Markdown/MDX, visually polished, and deployable to GitHub Pages.

The first release covers LLaDA2.X and LLaDA2.0-Uni while leaving room for future models and publications.

## Product principles

- Put research content before marketing copy.
- Show models, papers, and blog posts directly on the homepage.
- Make new content publishable by adding one MDX file and pushing to GitHub.
- Keep motion restrained, purposeful, and compatible with reduced-motion preferences.
- Preserve fast loading, mobile usability, accessibility, and strong search metadata.

## Information architecture

The primary navigation contains:

- Home
- Models
- Papers
- Blog
- About
- GitHub

The homepage contains, in order:

1. A compact global navigation bar.
2. One featured-content area for the latest release or a manually pinned item.
3. A three-column research index showing Models, Papers, and Blog entries at the same time.
4. A compact footer containing GitHub, Hugging Face, ModelScope, contact, and organization links.

The featured area must not become a full-screen marketing hero. On desktop, the featured item and the first entries in all three content lists should be visible with minimal scrolling. On mobile, the three columns stack in the order Models, Papers, Blog.

## Visual direction

Use a refined open-science style rather than a conventional AI landing page.

- Bright, precise base palette with deep navy text and a restrained cobalt accent.
- Generous but not wasteful spacing.
- Clear typographic hierarchy optimized for scanning lists.
- A bespoke diffusion-inspired graphic system for featured covers and empty image states.
- Subtle grid, glow, hover, and scroll-reveal effects.
- No oversized hero, excessive glass cards, or motion that competes with the content.
- Complete responsive behavior and a reduced-motion mode.

The approved content structure is represented by the visual-companion mockup `featured-index-layout.html`. That file validates hierarchy only; it is not the final visual ceiling.

## Technical architecture

Use Astro with Content Collections and MDX. Astro generates all public pages as static HTML. Small client-side scripts or isolated components may provide filtering, search, and motion, but the primary content must remain usable without JavaScript.

The build flow is:

```text
MDX content
  -> Astro Content Collections
  -> generated homepage, indexes, and detail pages
  -> production validation and build
  -> GitHub Actions
  -> GitHub Pages
```

The configuration must support both deployment forms:

- Development repository path: `https://ulov888.github.io/ant-llada/`
- Future organization root: `https://ant-llada.github.io/`

Site URLs and asset paths must derive from Astro configuration rather than being hard-coded.

## Content model

Content lives in three collections:

```text
src/content/models/
src/content/papers/
src/content/blog/
```

All collections require:

- `title`
- `date`
- `summary`
- `slug` or filename-derived slug
- `tags`
- `draft`

They may also contain:

- `cover`
- `featured`
- `authors`
- `updatedDate`

Paper entries may additionally contain:

- arXiv or publication URL
- PDF URL
- code URL
- model URL
- project URL
- venue
- citation text or BibTeX

Model entries may additionally contain:

- model family and modality
- checkpoint links
- documentation links
- license
- release status

Blog entries render long-form MDX with headings, code blocks, figures, citations, and related-content links.

## Homepage selection rules

- Prefer a non-draft entry marked `featured: true`.
- If several entries are featured, show the newest and emit a build warning.
- If no entry is featured, show the newest non-draft item across models, papers, and blog posts.
- Sort every homepage list by date descending.
- Do not render buttons for optional external links that are absent.
- Each column ends with a link to its complete index.

## Publishing workflow

An author copies the appropriate MDX template, fills in frontmatter and body content, previews locally, and opens a GitHub change. A push to the publishing branch triggers validation, production build, and Pages deployment.

Draft entries remain available in local development but are excluded from production pages, feeds, search indexes, and sitemaps.

## Pages and components

Reusable components include:

- Global navigation and mobile menu
- Featured content module
- Model, paper, and blog list entries
- Content metadata and tag chips
- External resource links
- Diffusion-inspired cover artwork and fallback cover
- Related-content module
- Citation copy control
- Footer
- Branded empty, error, and 404 states

Generated routes include:

- `/`
- `/models/` and `/models/[slug]/`
- `/papers/` and `/papers/[slug]/`
- `/blog/` and `/blog/[slug]/`
- `/about/`
- `/404.html`
- RSS feed and XML sitemap

## Failure handling

- Missing required frontmatter fails the build with a file-specific validation error.
- Missing covers use a consistent generated LLaDA fallback instead of breaking layout.
- Multiple featured entries produce a warning and resolve deterministically to the newest entry.
- Missing optional resource links hide their buttons.
- Unknown content routes render a branded 404 page with homepage and search links.
- A failed deployment must not replace the last successful live deployment.

## Accessibility and performance

- Use semantic landmarks and heading order.
- Ensure full keyboard navigation and visible focus states.
- Meet WCAG AA color contrast for text and controls.
- Honor `prefers-reduced-motion` and avoid motion-dependent meaning.
- Reserve image dimensions to prevent layout shifts.
- Prefer static HTML and CSS; load client JavaScript only where it adds clear value.
- Optimize and responsively serve local images.

## Verification and acceptance

Before release, verify:

- Content schema validation and production draft exclusion.
- Featured selection, per-collection sorting, filtering, and optional-link behavior.
- Homepage, indexes, detail pages, RSS, sitemap, and 404 generation.
- Internal-link integrity and expected external-resource URLs.
- Responsive rendering at representative phone, tablet, and desktop widths.
- Keyboard navigation, focus states, contrast, and reduced-motion behavior.
- Chrome and Safari rendering.
- Both GitHub Pages base-path configurations.
- A clean production build and local preview of the generated output.
- Lighthouse scores of at least 90 for Performance, Accessibility, and SEO on representative pages.

## Initial content source

Use public, official LLaDA repositories and project materials for the initial models, papers, links, and imagery. Do not invent research claims or performance numbers. Preserve source attribution and confirm externally hosted asset licenses before copying them into the site repository.

## Out of scope for the first release

- User accounts or a content-management backend
- Model inference hosted by the website
- Comments, payments, or other server-side workflows
- Automatic cross-posting from third-party writing platforms
- Localization beyond the English-first content structure
