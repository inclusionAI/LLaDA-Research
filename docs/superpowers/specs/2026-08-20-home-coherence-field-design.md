# Homepage Coherence Field Design

## Objective

Replace the homepage hero's persistent background words and token lanes with a single, continuous particle field that briefly becomes ordered language. The effect must communicate fast parallel diffusion decoding and simultaneous token editing without looking like a separate interface panel.

The final image should feel like one field of generative matter gaining local order, forming language, editing itself, and returning to noise.

## Visual Principles

- Preserve the current research-institution composition, 55vh desktop hero, typography, links, updates shelf, and content below the hero.
- Use one visual material and one motion system across the full hero.
- Do not draw a card, full square outline, panel background, grid, status bar, progress bar, or editing ledger.
- The square is an implicit coherence volume defined by particle behavior, not a visible component.
- Avoid cyberpunk HUD styling, saturated glow, gaming-interface cues, and decorative spectacle without explanatory value.

## Composition

The full hero uses one canvas and one particle array. Ambient particles occupy the existing right-side field and retain the current interaction behavior.

On desktop, the coherence volume is centered near 78% of the hero width and 50% of its height. Its side length is `clamp(280px, 27vw, 390px)`. The field has a 32–48px transition zone so particles gradually gain and lose order as they cross its implicit boundary.

No complete edge is rendered. At most, one or two short 10–24px spectral edge fragments may appear briefly during phase changes. Particles must visibly cross the boundary so the region never reads as an overlaid object.

The existing broad, low-intensity right-side environmental glow remains. Its peak opacity must not exceed 0.065.

## Particle Material

The field preserves the density and depth of the production homepage. Desktop ambient density should remain within 5% of the current implementation. Mobile begins at 55–65% of desktop density and continues to use adaptive degradation for slow devices.

Particle types:

- 62% micro-rectangles, 0.35–1.15px
- 20% short flow-aligned strokes, 3–9px long and 0.35–0.55px wide
- 12% low-opacity mask fragments such as `[··]`, `░`, and `▧`
- 6% transient semantic fragments shown only while language is forming

Three depth layers vary size, opacity, drift speed, and focus. Most particles render with `source-over`; only a small core subset may use `lighter`.

Palette:

- Background: `#030303`
- Ambient particles: `#B8BDB6`
- Coherent core particles: `#E8EAE2`
- Spectral edge particles: `#9EADB3`
- Editing trace: `#C5CFA2`

The editing color is limited to roughly 3–5% of visible particles and never appears as a solid fill or large glow. Non-interactive ambient brightness increases approximately 20–25% over the current production field while retaining the black background.

## Motion and Decoding Sequence

The complete loop lasts approximately three seconds. The actual parallel decoding completes within 650ms.

1. `0–120ms`: ambient noise occupies the entire field.
2. `120–260ms`: particles inside the coherence volume simultaneously bend toward three horizontal semantic bands.
3. `260–650ms`: all tokens converge in parallel. The maximum stagger between token targets is 30ms.
4. `650–1100ms`: resolved text remains stable.
5. `1100–1260ms`: three editing positions simultaneously fragment by 8–16px.
6. `1260–1440ms`: replacement tokens simultaneously re-form.
7. `1440–2250ms`: the edited result remains stable.
8. `2250–3000ms`: semantic particles disperse back into the ambient field.

The animation must not use horizontal scanning, character-by-character illumination, sequential word reveal, or a long-running progress indicator. These patterns imply autoregressive generation and conflict with the parallel-decoding concept.

## Editing Behavior

Editing happens to the particle-formed words themselves. Old token shapes dissolve locally and the same material recomposes into replacement tokens. All three edits occur together.

During the edit, flow-aligned strokes across the coherence volume may change direction for 90–120ms to create a restrained phase impulse. A short mineral-green spectral trace marks the affected positions, while the words remain predominantly warm gray-white.

## Interaction

Pointer interaction continues to affect the complete field, including particles inside and outside the coherence volume. It preserves the existing halo, displacement, glyph transformation, trail settling, and `data-interacting` behavior.

Inside the coherence volume, interaction may increase clarity and refraction by 10–15%, but it must not interrupt, restart, or slow the automatic decoding cycle.

## Technical Architecture

`DenoiseField.astro` remains the hero visual component but is reworked around one canvas, one particle collection, and one animation loop.

Each particle gains:

- an ambient position and drift state;
- an optional semantic target sampled from an offscreen text mask;
- a phase weight controlling interpolation between ambient and semantic states;
- a material type and depth layer;
- a temporary editing displacement and spectral weight.

An offscreen, low-resolution canvas renders each semantic line. Opaque pixels are sampled into approximately 500–900 target points, subject to adaptive density. A square signed-distance function and smooth transition calculate coherence influence; CSS clipping or a second canvas must not define the region.

The existing `densityForFps` behavior remains, and device pixel ratio stays capped at 2.

## Responsive Behavior

- `≥960px`: 280–390px coherence volume near `(78%, 50%)`; three semantic bands.
- `700–959px`: volume no larger than 340px and slightly lower; three shorter semantic bands.
- `<700px`: volume `min(70vw, 280px)` in the lower-right portion of the hero; two shorter semantic bands. Ambient particles still fill the hero and are not cropped into a separate visual area.

Text masks use shorter phrases at narrower widths so individual tokens remain legible without increasing the hero height beyond current constraints.

## Reduced Motion

With `prefers-reduced-motion: reduce`, the same field is rendered as a static, partially coherent snapshot. It includes ambient particles crossing an implicit square region and a restrained mix of mask and resolved semantic fragments. It must not show a panel or explicit square outline.

## Accessibility and Performance

- The decorative field remains `aria-hidden="true"`.
- Hero copy and links preserve their current contrast and interaction behavior.
- The animation must pause when the document is hidden and resume without jumping phases.
- Resize rebuilds targets and particles without accumulating observers or animation loops.
- Adaptive density can reduce particle count but must preserve material ratios and the semantic sequence.

## Acceptance Criteria

- Only one visible canvas and one particle system create the hero effect.
- No persistent background words or token lanes remain.
- No independent square panel, full outline, grid, status bar, or progress bar exists.
- Ambient density remains within 5% of the current desktop implementation before adaptive degradation.
- The particle field includes micro-rectangles, strokes, mask fragments, and semantic fragments rather than uniform white points.
- All token targets reach the resolved phase within 650ms, with no more than 30ms stagger.
- Three editing locations fragment and re-form simultaneously.
- Pointer interaction and its settled state continue to work across the full field.
- Desktop and mobile hero height constraints continue to pass.
- Reduced-motion mode presents a deliberate static coherence state.
- The homepage retains its current content, typography, updates list, and research index.
