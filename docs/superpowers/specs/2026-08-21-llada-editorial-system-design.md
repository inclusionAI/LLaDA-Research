# LLaDA Research Editorial Design System

## Context and goals

The site must read as one coherent academic publication rather than a collection of independently styled blocks. The visual system keeps the approved light ivory-and-sage direction, formalizes typography and spacing, and makes hierarchy obvious from the homepage through archives and detail pages. Content scope represents research in which InclusionAI participated; it is not limited to work solely published by InclusionAI.

Success means:

- Models, Publications, and Notes use the same grid, type roles, spacing rhythm, and interaction language.
- A section title, an item title, metadata, summary copy, and utility text are distinguishable without relying on color alone.
- Model names such as `LLaDA2.0-Uni`, `LLaDA-MoE 7B-A1B`, and `LLaDA MoE v2` remain visually intact and consistently rendered.
- The model archive contains six concrete model or checkpoint entries: it removes the umbrella `LLaDA2.X` entry and adds the `LLaDA MoE v2` research preview.
- The system meets WCAG 2.2 AA, supports keyboard and reduced-motion use, and avoids horizontal overflow from 320px upward.

## Design tokens and foundations

### Color

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Canvas | `--color-canvas` | `#F7F8F3` | Page background |
| Ink | `--color-ink` | `#24312B` | Headlines and primary copy |
| Muted ink | `--color-muted` | `#68756E` | Secondary copy and metadata |
| Accent | `--color-accent` | `#527A68` | Active controls and focus |
| Rule | `--color-rule` | `#D8E0D8` | Dividers and inactive borders |
| Surface | `--color-surface` | `#EEF3ED` | Quiet diagrams and footer |

Legacy aliases remain during migration, but new component rules must use semantic tokens. No gradients, shadows, translucent cards, or dark theme surfaces are introduced.

### Typography

- Display and editorial headings use the existing serif stack; interface copy uses the sans stack; metadata and scientific notation use the mono stack.
- The system exposes fixed roles rather than component-local sizes:
  - `--text-meta: 0.75rem / 1rem`, mono 500, `0.08em` tracking only when uppercase.
  - `--text-label: 0.8125rem / 1.25rem`, sans 600.
  - `--text-small: 0.875rem / 1.375rem`, sans 400.
  - `--text-body: 1rem / 1.625rem`, sans 400.
  - `--text-reading: clamp(1.0625rem, 1.15vw, 1.125rem) / 1.75`, sans 400 for long-form prose.
  - `--text-lead: clamp(1.0625rem, 1.4vw, 1.25rem) / 1.75`, sans 400.
  - `--text-title-sm: clamp(1.125rem, 1.5vw, 1.25rem) / 1.3`, serif 500.
  - `--text-title-md: clamp(1.5rem, 2.4vw, 2rem) / 1.15`, serif 500.
  - `--text-section: clamp(2rem, 3.2vw, 2.75rem) / 1.05`, serif 500.
  - `--text-page: clamp(3rem, 7vw, 6rem) / 0.96`, serif 400.
  - `--text-hero: clamp(3.75rem, 7.5vw, 7.25rem) / 0.88`, serif 400.
- Body copy has normal letter spacing. Editorial titles use `-0.035em`; the hero may use `-0.055em`. Uppercase metadata never exceeds `0.1em`.
- Model and paper names use lining numerals and no artificial case conversion. Names may wrap only at natural spaces or punctuation; no per-character styling is allowed.

### Spacing and layout

- The layout follows an 8px baseline with `--space-1` through `--space-12` representing 8px to 96px. A 4px micro-step is allowed only for icon/text optical alignment.
- The main shell remains capped at 82rem and uses 24px desktop gutters, 12px mobile gutters.
- Section boundaries use rules and whitespace, not floating cards. Vertical section padding uses 48–96px desktop and 40–64px mobile.
- Archive rows align artwork, metadata, title, summary, resources, and tags to a stable two-column grid. The text column owns hierarchy; artwork is supporting evidence.
- Homepage keeps the current order: integrated hero field, two selected publications, then three program links.

## Component-level rules

### Global navigation and actions

- Navigation, buttons, filter chips, and menu controls have a minimum 44px touch target.
- Default state uses muted ink; hover and focus use ink or accent. `:focus-visible` always has a 2px accent outline with at least 3px offset.
- Active filters use accent background and canvas text; disabled controls, when present, use 45% opacity and no pointer events.

### Hero

- The diffusion field remains integrated into the page background and retains pointer interaction.
- Copy occupies at most 48% on desktop and remains above the field with guaranteed ink/muted contrast.
- Kicker uses metadata styling, title uses hero styling, summary uses lead styling, and CTA uses label styling. Reduced-motion mode stops transitions without hiding meaning.

### Selected work

- Section label uses metadata styling, section heading uses section styling, publication titles use title-medium styling, and summaries use body styling.
- Desktop rows follow metadata/content/action columns. At narrow widths metadata becomes one line above full-width copy.
- The whole row is linked; hover and focus change the arrow and title without moving text vertically.

### Program navigation

- `Models`, `Publications`, and `Notes` are section-level entry names, while descriptions are supporting text. Their hierarchy must not equal archive item titles.
- Desktop uses three equal columns sharing rules; mobile uses three full-width rows. Each link is at least 72px tall.

### Archive filters

- Search label uses metadata styling, input uses body styling, and chips use labels.
- Search and topic controls align to one baseline on desktop and stack at 900px. Every chip is at least 44px tall.
- Empty results retain the filter controls and announce `0 entries` through the existing live region.

### Archive rows

- Archive title uses title-medium styling and is always larger than metadata, tags, summaries, and resource actions.
- Generated token artwork uses metadata sizing no smaller than 12px. Decorative output is hidden from assistive technology; the link retains a useful accessible name.
- Desktop uses a 28% artwork / 72% copy split. At 650px the artwork becomes a compact 64px band and copy takes the full row.
- Hover/focus may strengthen rules and color; no shadow, scale, or raised-card effect.

### Content details

- Page title uses page styling, summary uses lead styling, metadata uses metadata styling, and prose uses body/lead styling with a 42–44rem reading measure.
- Prose headings, code, blockquotes, citations, resource links, and related entries use the same global roles and spacing tokens.
- Sticky aside becomes static before it would squeeze the reading column.

## Content and ownership standards

- Model and paper entries require `participants`, a non-empty organization list that must include `InclusionAI`. This expresses participation without falsely claiming sole publication ownership.
- UI descriptions use “research with InclusionAI participation” where provenance needs explanation. They must not say that every listed item was solely released or published by InclusionAI.
- `LLaDA2.X` is an umbrella program/repository and must not appear as a model card or model detail route.
- `LLaDA MoE v2` appears in Models as a `preview` with its verified arXiv paper link only. The site must not invent code, checkpoint, or project links.
- Paper and model titles preserve source naming, including punctuation and version suffixes.

## Accessibility requirements

- Text and interactive controls must meet WCAG AA contrast; body text is at least 16px and metadata at least 12px.
- All pointer interactions are available from keyboard, and focus is never communicated only through motion.
- Interactive targets are at least 44 by 44 CSS pixels unless an inline text link is part of prose.
- Pages expose one visible `h1`; headings descend in a logical order.
- Layout does not overflow horizontally at 320, 390, 768, 1024, or 1440px.
- Motion is suppressed under `prefers-reduced-motion: reduce` while content remains present.

## Anti-patterns and prohibited implementations

- Do not add one-off `font-size`, `line-height`, or `letter-spacing` values when a defined type role fits.
- Do not use metadata typography for names or headings, or heading typography for utility controls.
- Do not use `LLaDA2.X` as if it were a released model.
- Do not imply sole InclusionAI ownership for collaborative work.
- Do not introduce dark panels, glass effects, shadows, large corner radii, gradient decoration, or disconnected hero blocks.
- Do not shrink mobile metadata below 12px or use low-contrast gray to manufacture hierarchy.

## Migration guidance

1. Add semantic color, type, line-height, tracking, spacing, and motion tokens in `global.css`; keep aliases until all components migrate.
2. Replace component-local values in shared navigation, homepage sections, archives, and detail content with the new roles.
3. Migrate model and paper frontmatter from `publisher` to validated `participants`.
4. Remove the `LLaDA2.X` model entry and add the `LLaDA MoE v2` preview entry.
5. Update unit and browser tests to enforce the content policy, hierarchy ratios, touch targets, and responsive alignment.

## QA checklist

- [ ] All model and paper frontmatter includes `participants` with `InclusionAI`.
- [ ] Models contains exactly six entries, including `LLaDA MoE v2` and excluding `LLaDA2.X`.
- [ ] MoE v2 exposes only a verified paper resource.
- [ ] Section headings, item headings, summaries, metadata, and utilities resolve to distinct documented roles.
- [ ] No archive or homepage component introduces undocumented type sizes or tracking.
- [ ] Filters, navigation controls, and card actions meet 44px touch targets.
- [ ] Desktop and mobile screenshots show aligned rules, baselines, and gutters without overflow.
- [ ] Keyboard focus, reduced motion, contrast, Astro checks, unit tests, Playwright tests, root build, and GitHub project-base build pass.
