# Coherence Type Legibility Design

## Objective

Make the semantic phase of the homepage coherence field read as deliberately incomplete language rather than garbled characters. Preserve the single particle system, implicit coherence region, fast parallel convergence, simultaneous editing, pointer interaction, and current homepage layout.

## Root Cause

The current desktop animation renders three long lines containing approximately 82 letters at a 10–14px mask size. At most 900 particles are assigned across those glyphs, leaving too few particles per letter to preserve recognizable strokes. The low-resolution masks are then drawn over a dense ambient field, further weakening the letterforms.

Increasing brightness alone would make the noise harsher without restoring typographic structure.

## Semantic Content

Use two short lines on desktop and mobile:

- Initial: `LANGUAGE FORMS` / `TOKENS RESOLVE`
- Edited: `LANGUAGE ADAPTS` / `TOKENS EDIT`

The two editing positions change simultaneously. The wording remains technical and institutional rather than explanatory UI copy.

## Typography

- Desktop mask size: 18–20px, selected responsively from coherence-region width.
- Mobile mask size: 14–16px.
- Medium monospace weight with modest tracking so adjacent particle clusters remain distinct.
- Two lines use generous vertical separation and remain inside the implicit coherence region.
- At the resolved phase, each letter must retain a recognizable silhouette at normal viewing distance.

## Particle and Glyph Treatment

The effect remains one visible canvas and one particle array.

Particle targets continue to be sampled from the text masks, but the stable phases also draw a low-opacity skeletal version of the same glyph mask directly into the same canvas. This is not a DOM overlay or separate component.

The skeletal glyph layer:

- uses the same warm-gray palette as the semantic particles;
- reaches no more than 22–28% opacity during stable phases;
- begins appearing only after parallel decoding is substantially complete;
- dissolves during fragment and disperse phases;
- switches to the replacement text during editing;
- never uses a filled background, outline box, glow card, or independent UI surface.

Semantic particles remain brighter than the skeleton and continue to define the material character of the words. The skeleton only reconnects missing strokes.

## Timing

The existing three-second sequence and 650ms parallel decoding window remain unchanged.

- During noise and early alignment, no complete glyph skeleton is visible.
- From approximately 450–650ms, the skeleton fades in as all letters resolve together.
- During simultaneous editing, affected word skeletons fragment with their particles.
- The edited skeleton stabilizes with the new particle targets.
- Both particles and skeleton disperse together at the end of the loop.

No character-by-character reveal, scan line, typing cursor, or sequential word illumination is introduced.

## Background Separation

Ambient particles within the immediate letter area reduce opacity slightly during stable semantic phases. The reduction must be gradual and local, computed from the same coherence field rather than painted as a rectangular clearing.

This improves legibility without creating a dark card or visible boundary.

## Pointer Interaction

Pointer input continues to act on the same physical field and gains a semantic response near the coherence region.

- As the pointer approaches the resolved letterforms, skeletal glyph opacity may increase by no more than 12% relative to its automatic state.
- Nearby semantic particles briefly flow tangentially along letter strokes, suggesting that the language structure is being resampled.
- A fast pointer pass may displace the nearest word by 4–8px before all affected particles return in parallel within approximately 180ms.
- Pointer input must not restart, pause, or slow the automatic decoding and editing sequence.
- No hover box, spotlight circle, cursor label, scanning line, or sequential character response is shown.
- When the pointer leaves, the field returns to the default deliberately incomplete but recognizable state.

## Responsive Behavior

- Desktop and tablet show the same two-line semantic structure.
- Mobile uses the same phrases at the shorter font range and places the semantic region below the summary and links.
- Both lines remain fully inside the canvas at all tested viewport sizes.

## Reduced Motion

The static reduced-motion state uses the same two-line content and partially resolved skeleton. It must clearly read as language in formation rather than random fragments.

## Acceptance Criteria

- The stable semantic phase reads as two intentional English lines rather than scrambled fragments.
- Desktop glyph-mask size is at least 18px; mobile is at least 14px.
- Only one visible canvas remains in the field.
- No DOM text overlay, panel, border, grid, or rectangular clearing is introduced.
- The glyph skeleton never exceeds 28% opacity.
- Parallel decoding still reaches its resolved state within 650ms.
- Both editing words change simultaneously.
- Pointer proximity subtly sharpens and perturbs the semantic words without restarting the sequence.
- Ambient particle density and the current hero composition remain intact.
- Pointer interaction, adaptive density, reduced motion, and responsive hero constraints continue to pass.
