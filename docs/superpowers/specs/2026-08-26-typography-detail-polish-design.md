# Typography and Detail Polish

## Context and goals

Refine the existing light academic editorial system without changing navigation, content, color direction, or page structure. The site should render with the same type character on every operating system, separate display/editorial/interface/technical roles clearly, and use a disciplined 8px rhythm.

## Design tokens and foundations

- Self-host three Latin font roles: Inter Variable for interface and body copy, Source Serif 4 Variable for editorial headings, and IBM Plex Mono Variable for metadata and scientific notation.
- Keep metadata at 12px minimum and interface labels at 13px minimum.
- Reduce uppercase metadata tracking from `0.08em` to `0.055em`; use `0.02em` for technical readouts.
- Use `-0.022em` for editorial titles and `-0.042em` only for hero display type.
- Use optical sizing and common ligatures for the serif and sans roles; use tabular lining numerals for dates and technical metadata.
- Preserve the 8px spacing scale. Replace nearby off-grid values only in the components touched by this pass.

## Component-level rules

- Hero and page titles retain their current scale but receive the self-hosted serif, calmer tracking, and slightly more open line height.
- Body, summaries, navigation, buttons, and filters use the self-hosted sans with consistent weight and line height.
- Eyebrows, metadata, dates, citations, and token diagrams use the self-hosted mono. Uppercase labels use the shared metadata tracking; mixed-case technical output uses the tighter technical tracking.
- Archive token diagrams keep the two-column prompt/output layout established in `b3532b3`.
- Model and paper names wrap at natural word and punctuation boundaries; cards must not split arbitrary characters.
- Mobile decorative archive bands may grow to 80px for wrapped titles and must keep all notation inside their bounds.

## Accessibility requirements and testable acceptance criteria

- Body copy remains at least 16px, metadata at least 12px, and controls retain 44px targets.
- All three self-hosted font families must appear as loaded `FontFace` entries and as the first computed family for their assigned roles.
- Body line height must remain between 1.55 and 1.7; uppercase tracking must not exceed `0.065em`.
- No horizontal overflow from 320px through 1440px.
- Existing contrast, focus, reduced-motion, and semantic tests must continue to pass.

## Content and tone standards with examples

- Preserve official names exactly: `LLaDA MoE v2`, `LLaDA2.0-Uni`, and `LLaDA-MoE 7B-A1B`.
- Keep concise academic labels such as `Research archive`, `Technical report`, and `Released`; do not add promotional adjectives.

## Anti-patterns and prohibited implementations

- Do not depend on locally installed Inter or platform-specific Georgia metrics.
- Do not add remote Google Fonts requests, synthetic bold/italic faces, arbitrary component-local type sizes, tracking above `0.065em`, or decorative per-character title styling.
- Do not change the approved ivory/sage palette, information architecture, content scope, or hero animation.

## QA checklist

- [ ] Self-hosted font files load from the same origin.
- [ ] Serif, sans, and mono roles resolve consistently on desktop and mobile.
- [ ] Metadata tracking, title tracking, and line heights match tokens.
- [ ] Homepage, archives, detail pages, About, and 404 retain hierarchy and do not overflow.
- [ ] Unit tests, Astro diagnostics, both builds, Playwright, Lighthouse, and `git diff --check` pass.
