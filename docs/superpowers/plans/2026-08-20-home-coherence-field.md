# Homepage Coherence Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's fixed token lanes with one dense particle field that locally and rapidly converges into language, performs simultaneous edits, and disperses without displaying a separate panel.

**Architecture:** Extend `src/lib/particle-field.ts` with deterministic, testable phase, material, and coherence helpers. Rebuild `DenoiseField.astro` around one visible canvas and one particle array; use an offscreen text-mask canvas only for sampling semantic target points. Preserve the existing pointer interaction, adaptive density, reduced-motion state, and hero layout.

**Tech Stack:** Astro, TypeScript, Canvas 2D, Vitest, Playwright

---

## File Structure

- Modify `src/lib/particle-field.ts`: define the coherence timeline, smooth signed-distance weighting, and deterministic particle material allocation.
- Modify `tests/particle-field.test.ts`: unit-test timing, material ratios, and implicit square transition behavior.
- Modify `src/components/DenoiseField.astro`: render the single-canvas particle field, semantic masks, simultaneous editing, interaction, and static reduced-motion state.
- Modify `tests/site.spec.ts`: assert the one-canvas DOM contract, removal of persistent token lanes, fast parallel state metadata, interaction, and reduced-motion behavior.

### Task 1: Define the coherence-field model

**Files:**
- Modify: `tests/particle-field.test.ts`
- Modify: `src/lib/particle-field.ts`

- [ ] **Step 1: Write failing unit tests for the timeline**

Add imports for `coherencePhaseAt` and assert exact phase boundaries at 0, 120, 260, 650, 1100, 1260, 1440, 2250, and 3000 milliseconds. Assert that decode progress reaches `1` at 650ms and that all three edit positions share the same edit progress.

- [ ] **Step 2: Run the timeline tests and verify RED**

Run: `npm test -- tests/particle-field.test.ts`

Expected: FAIL because `coherencePhaseAt` is not exported.

- [ ] **Step 3: Implement the minimal timeline helper**

Define:

```ts
export type CoherencePhaseName = 'noise' | 'align' | 'decode' | 'hold' | 'fragment' | 'reform' | 'resolved' | 'disperse';

export function coherencePhaseAt(elapsedMs: number): {
  name: CoherencePhaseName;
  coherence: number;
  decode: number;
  edit: number;
  disperse: number;
};
```

Normalize elapsed time to the 3000ms loop and use smooth interpolation inside each documented interval.

- [ ] **Step 4: Run the timeline tests and verify GREEN**

Run: `npm test -- tests/particle-field.test.ts`

Expected: all particle-field tests pass.

- [ ] **Step 5: Write failing unit tests for materials and coherence weighting**

Add imports for `materialForIndex` and `coherenceWeight`. Assert a 100-particle deterministic distribution of 62 dots, 20 strokes, 12 masks, and 6 semantic particles. Assert that the signed-distance transition returns `1` at the center, approximately `0.5` at the implicit edge, and `0` outside the feathered region.

- [ ] **Step 6: Run the new tests and verify RED**

Run: `npm test -- tests/particle-field.test.ts`

Expected: FAIL because `materialForIndex` and `coherenceWeight` are not exported.

- [ ] **Step 7: Implement the minimal helpers**

Define:

```ts
export type ParticleMaterial = 'micro' | 'stroke' | 'mask' | 'semantic';
export function materialForIndex(index: number): ParticleMaterial;
export function coherenceWeight(x: number, y: number, centerX: number, centerY: number, side: number, feather: number): number;
```

Use `index % 100` for stable material allocation and a square signed-distance calculation followed by smoothstep across `feather` pixels.

- [ ] **Step 8: Run all unit tests and commit**

Run: `npm test`

Expected: all Vitest tests pass.

Commit:

```bash
git add src/lib/particle-field.ts tests/particle-field.test.ts
git commit -m "feat: model coherence field phases"
```

### Task 2: Lock the single-field DOM and accessibility contract

**Files:**
- Modify: `tests/site.spec.ts`
- Modify: `src/components/DenoiseField.astro`

- [ ] **Step 1: Write failing Playwright assertions**

Update the homepage visual tests to require:

```ts
await expect(field.locator('canvas')).toHaveCount(1);
await expect(field.locator('[data-token-lane]')).toHaveCount(0);
await expect(field.locator('[data-static-token-field]')).toHaveCount(0);
await expect(field).toHaveAttribute('data-visual-system', 'coherence-field');
await expect(field).toHaveAttribute('data-decode-window-ms', '650');
await expect(field).toHaveAttribute('data-edit-mode', 'simultaneous');
```

For reduced motion, require `data-motion="reduced"` and `data-coherence-state="partial"` on the same field instead of a separate static token layer.

- [ ] **Step 2: Run the focused browser tests and verify RED**

Run: `npx playwright test tests/site.spec.ts --grep "denoise field|parallel|single coherence" --project=chromium`

Expected: FAIL because the production component still renders token lanes and a static token field.

- [ ] **Step 3: Replace the component markup with the single-field contract**

Keep one `<canvas>` inside `[data-denoise-field]`. Add the three data attributes above and a compact bottom readout reading `MASK / TOKEN` and `PARALLEL DIFFUSION / EDITING`. Remove `.static-token-field`, `.token-lanes`, all fixed background words, and their CSS.

- [ ] **Step 4: Implement a deliberate reduced-motion snapshot**

When motion is reduced, render the one canvas once with ambient micro particles, strokes, mask fragments, and a partially resolved semantic mask. Set `data-motion="reduced"` and `data-coherence-state="partial"` without starting `requestAnimationFrame`.

- [ ] **Step 5: Run the focused browser tests and commit**

Run: `npx playwright test tests/site.spec.ts --grep "denoise field|parallel|single coherence" --project=chromium`

Expected: focused tests pass.

Commit:

```bash
git add src/components/DenoiseField.astro tests/site.spec.ts
git commit -m "refactor: unify homepage particle field"
```

### Task 3: Implement the dense multi-material ambient field

**Files:**
- Modify: `src/components/DenoiseField.astro`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Write a failing runtime instrumentation test**

Require the desktop field to report all four materials through `data-materials="micro stroke mask semantic"`, an initial density basis of `165`, and one active animation loop. Assert that moving and leaving the pointer still changes `data-interacting` from `true` back to `false`.

- [ ] **Step 2: Run the test and verify RED**

Run: `npx playwright test tests/site.spec.ts --grep "multi-material|pointer input" --project=chromium`

Expected: FAIL because material and density metadata are not present.

- [ ] **Step 3: Implement the ambient particle system**

Create particles at approximately `(width * height) / 165 * density`, allocating material with `materialForIndex`. Preserve three depth layers and use:

- micro rectangles for the majority;
- flow-aligned strokes rotated to velocity;
- sparsely drawn mask fragments;
- semantic fragments only when coherence is active.

Use warm gray-white plus restrained cool-gray spectral variation. Increase idle opacity by roughly 20–25% from the previous field. Keep the existing pointer halo, displacement, settling timer, and FPS-based adaptive density.

- [ ] **Step 4: Run focused browser and unit tests and verify GREEN**

Run:

```bash
npm test
npx playwright test tests/site.spec.ts --grep "multi-material|pointer input" --project=chromium
```

Expected: all selected tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/DenoiseField.astro tests/site.spec.ts
git commit -m "feat: restore layered particle material"
```

### Task 4: Implement semantic convergence and simultaneous editing

**Files:**
- Modify: `src/components/DenoiseField.astro`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Write a failing animation-state test**

Require `data-coherence-state` to enter `resolved` within 900ms after a fresh loop, `data-edit-count="3"`, and `data-edit-mode="simultaneous"`. Assert that no visible element has a full rectangular border around the coherence region.

- [ ] **Step 2: Run the test and verify RED**

Run: `npx playwright test tests/site.spec.ts --grep "parallel semantic convergence" --project=chromium`

Expected: FAIL because semantic convergence is not implemented.

- [ ] **Step 3: Build offscreen semantic targets**

Create one detached canvas in memory, render three short semantic lines in the site monospace type, sample opaque pixels, and assign approximately 500–900 existing particles to target points. At mobile widths render two shorter lines. Do not append the sampling canvas to the DOM.

- [ ] **Step 4: Interpolate one particle system through the timeline**

Use `coherencePhaseAt` and `coherenceWeight` to blend ambient and semantic targets. During decode, all target particles converge within the same 390ms interval and use no more than 30ms of deterministic per-token jitter. During editing, three token groups simultaneously disperse 8–16px and reform from replacement masks.

- [ ] **Step 5: Add restrained phase cues**

During the 90–120ms editing impulse, rotate stroke particles locally and give only affected particles a short `#C5CFA2` spectral trace. Permit no filled token backgrounds, large glow, scanning line, or progress indicator. Allow at most two short edge-refraction fragments generated from particles during phase transitions.

- [ ] **Step 6: Expose state for testing and preserve visibility behavior**

Update `data-coherence-state` as phases change, set `data-edit-count="3"`, pause the loop on `document.visibilitychange`, and resume from current elapsed time without creating another loop.

- [ ] **Step 7: Run focused browser tests and verify GREEN**

Run: `npx playwright test tests/site.spec.ts --grep "parallel semantic convergence" --project=chromium`

Expected: the state reaches resolved in the required window and all assertions pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/DenoiseField.astro tests/site.spec.ts
git commit -m "feat: animate parallel semantic coherence"
```

### Task 5: Responsive tuning and full verification

**Files:**
- Modify: `src/components/DenoiseField.astro`
- Modify: `tests/site.spec.ts`

- [ ] **Step 1: Add responsive geometry assertions**

At desktop, tablet, and mobile widths, assert that the field remains full-hero, the hero retains its existing height limits, horizontal overflow is absent, and metadata reports three semantic lines above 700px and two below 700px.

- [ ] **Step 2: Run responsive tests and verify RED**

Run: `npx playwright test tests/site.spec.ts --grep "coherence field responds" --project=chromium`

Expected: FAIL until responsive semantic-line metadata and geometry are implemented.

- [ ] **Step 3: Tune coherence geometry by breakpoint**

Use 280–390px near `(78%, 50%)` at desktop, no more than 340px and slightly lower at tablet sizes, and `min(70vw, 280px)` in the lower-right with two lines on mobile. Keep ambient particles across the entire hero.

- [ ] **Step 4: Run focused responsive tests and verify GREEN**

Run: `npx playwright test tests/site.spec.ts --grep "coherence field responds" --project=chromium`

Expected: responsive tests pass.

- [ ] **Step 5: Run complete automated verification**

Run:

```bash
npm test
npm run check
npm run build
npx playwright test
npm run test:lighthouse
git diff --check
```

Expected: Vitest, Astro checks, builds, Playwright, Lighthouse, and whitespace validation all pass.

- [ ] **Step 6: Review rendered desktop and mobile screenshots**

Capture 1440×1000 and 390×844 screenshots from `http://127.0.0.1:4321/`. Verify that the implicit region reads as a local ordering of the same field, the surrounding effect retains density and material variety, the decode feels simultaneous, hero copy remains readable, and no explicit panel is visible.

- [ ] **Step 7: Commit final visual tuning**

```bash
git add src/components/DenoiseField.astro tests/site.spec.ts
git commit -m "style: refine homepage coherence field"
```
