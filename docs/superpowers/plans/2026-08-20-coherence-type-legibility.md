# Coherence Type Legibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the particle-formed language recognizable without turning it into ordinary overlay text, and add a restrained pointer-driven semantic disturbance.

**Architecture:** Add pure typography and skeleton-opacity helpers to `particle-field.ts`, then use them inside the existing single-canvas field. Reduce semantic copy to two lines, sample larger masks, draw a low-opacity same-canvas glyph skeleton during stable phases, and give semantic particles a bounded tangential pointer offset that settles in roughly 180ms.

**Tech Stack:** Astro, TypeScript, Canvas 2D, Vitest, Playwright

---

### Task 1: Define legible semantic typography

**Files:**
- Modify: `tests/particle-field.test.ts`
- Modify: `src/lib/particle-field.ts`

- [ ] Add failing tests for `semanticFontSize(side, mobile)` requiring 18–20px desktop and 14–16px mobile values.
- [ ] Add failing tests for `semanticSkeletonOpacity(decode, edit, disperse, pointerProximity)` requiring no early skeleton, a base maximum of 0.24, a pointer-adjusted maximum below 0.28, and dissolution during editing/dispersal.
- [ ] Run `npm run test:run -- tests/particle-field.test.ts` and confirm both helpers are missing.
- [ ] Implement the two pure helpers with clamped interpolation.
- [ ] Re-run the focused tests and commit `feat: model legible semantic typography`.

### Task 2: Replace fragmented semantic copy with two-line masks

**Files:**
- Modify: `tests/site.spec.ts`
- Modify: `src/components/DenoiseField.astro`

- [ ] Add failing browser assertions for two semantic lines, copy `LANGUAGE FORMS / TOKENS RESOLVE`, desktop font size at least 18px, mobile font size at least 14px, one visible canvas, and no DOM semantic-text overlay.
- [ ] Run the focused Playwright test and confirm the current three-line 10–14px implementation fails.
- [ ] Replace desktop/mobile phrase arrays with the shared two-line initial and edited copy.
- [ ] Use `semanticFontSize` for mask sampling and keep both lines inside the implicit coherence region.
- [ ] Re-run the focused test and commit `style: clarify particle-formed language`.

### Task 3: Add same-canvas skeletal glyph support

**Files:**
- Modify: `tests/site.spec.ts`
- Modify: `src/components/DenoiseField.astro`

- [ ] Add failing assertions for `data-skeleton-max-opacity="0.28"`, `data-skeleton-surface="canvas"`, and resolved skeleton activity.
- [ ] Run the focused test and verify RED.
- [ ] Draw the current semantic words directly into the existing visible canvas using `semanticSkeletonOpacity`; use warm gray, no background, no border, and no second visible canvas.
- [ ] Fade the skeleton in late in decoding, fragment edited words, switch to replacement copy, and disperse it with the particles.
- [ ] Reduce ambient opacity locally using radial/coherence weighting rather than a rectangular clearing.
- [ ] Re-run focused tests and commit `feat: reconnect semantic particle strokes`.

### Task 4: Add bounded pointer-driven semantic motion

**Files:**
- Modify: `tests/site.spec.ts`
- Modify: `src/components/DenoiseField.astro`

- [ ] Add a failing pointer test that moves over the coherence center and requires semantic proximity state, a bounded displacement no greater than 8px, and a return-to-rest state within 500ms after leaving.
- [ ] Run the focused test and verify RED.
- [ ] Add per-particle semantic offsets; apply a tangential impulse only near letter targets, clamp displacement to 8px, and decay offsets with an approximately 180ms time constant.
- [ ] Increase skeleton opacity by at most 12% relative while the pointer is near semantic targets, without restarting the automatic phase clock.
- [ ] Re-run focused tests and commit `feat: add semantic pointer perturbation`.

### Task 5: Visual tuning and verification

**Files:**
- Modify: `src/components/DenoiseField.astro`
- Modify: `tests/site.spec.ts`

- [ ] Capture desktop resolved/editing frames and a mobile resolved frame from port 4321.
- [ ] Confirm the text reads as intentional English from normal viewing distance, remains visibly particle-formed, and does not resemble a DOM overlay or separate panel.
- [ ] Run `npm run test:run`, `npm run check`, `npm run build`, `npx playwright test`, `npm run test:lighthouse`, the `/ant-llada` build, and `git diff --check`.
- [ ] Commit final tuning as `style: refine coherence type legibility`, merge to `main`, and restart the port 4321 preview.
