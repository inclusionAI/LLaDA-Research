# Academic Journal Redesign Design

## Objective

Transform the LLaDA research website from a dense dark technology showcase into a calm, light academic publication portal. Reduce homepage congestion, publish only InclusionAI-owned research, and retain the diffusion particle field as a quiet secondary signature rather than the dominant visual.

## Approved Direction

The selected direction is **Contemporary Journal**:

- ivory background and ink-green typography;
- sage green as the only primary accent;
- restrained serif display headings with clean sans-serif body copy;
- rules and whitespace instead of cards, shadows, panels, or large color blocks;
- official black LLaDA wordmark on light surfaces;
- a faint gray-green semantic particle field on the right side of the hero.

## Content Boundary

Public model and paper archives contain only work officially released by InclusionAI.

Models retained:

- LLaDA2.0
- LLaDA2.1
- LLaDA2.2
- LLaDA2.X
- LLaDA2.0-Uni
- LLaDA-MoE 7B-A1B

LLaDA MoE v2 remains a paper result until an official model/checkpoint URL is available. Remove iLLaDA, LLaDA-8B, LLaDA 1.5, their papers, routes, and test expectations.

Each public model and paper receives an explicit `publisher: "InclusionAI"` field. Collection schemas reject absent or different publisher values so future third-party work cannot enter the public archive accidentally.

## Homepage Information Architecture

The homepage contains three layers only:

1. Hero: one research proposition, short supporting sentence, and one primary research link.
2. Selected work: two official outcomes—LLaDA2.2 for language/agents and LLaDA2.0-Uni for multimodal research.
3. Program navigation: Models, Publications, and Notes as three quiet text-led entry points.

Remove the four-entry Research Updates grid and the long three-column lists from the homepage. Full lists remain on archive pages.

## Visual System

- Page: `#F7F8F3`
- Primary ink: `#24312B`
- Secondary ink: `#68756E`
- Sage accent: `#527A68`
- Lines: `#D8E0D8`
- Soft surface: `#EEF3ED`

Use Georgia as the available system serif for display headings and Inter/Helvetica/system sans-serif for navigation and body text. Do not fetch webfonts. The header uses the official black SVG wordmark. Interactive states use underlines, color, and slight translation rather than shadows.

## Particle Field

Keep the one-canvas architecture, timing, parallel resolution, editing, responsive bounds, reduced-motion state, and pointer behavior. Replace the black canvas clearing and white/blue particles with transparent ivory clearing, low-opacity sage/gray particles, and dark sage semantic strokes. Remove spotlight glow and dark radial background. The field should remain legible but subordinate to the hero copy.

## Supporting Pages

Models, Publications, Notes, About, detail pages, and the 404 page adopt the same light publication system. Archive cards remain flat rows separated by rules. Tags and resource actions use quiet outlined treatments. Rename user-facing `Papers` navigation to `Publications`; route paths remain `/papers/` for compatibility.

## Responsive Behavior

Desktop hero remains split between copy and semantic field. Mobile stacks visually through overlap: copy first, particle field fades into the right/lower background without obscuring links. Homepage selected work becomes one column. No horizontal overflow at 320px.

## Acceptance Criteria

- Homepage no longer shows Research Updates or expanded model/paper/blog lists.
- Exactly two selected official outcomes appear on the homepage.
- Only six official model routes and six official publication routes are generated.
- iLLaDA, LLaDA-8B, and LLaDA 1.5 routes return 404.
- All public model and paper content validates as InclusionAI-owned.
- Body and primary surfaces use a light palette; the official black wordmark is visible.
- Particle field remains one canvas and uses the light sage palette.
- Desktop, mobile, reduced motion, GitHub project-base builds, accessibility contrast, tests, and Lighthouse pass.

