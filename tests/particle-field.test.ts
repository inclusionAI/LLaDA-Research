import { describe, expect, it } from 'vitest';
import {
  clampSemanticOffset,
  coherenceWeight,
  coherencePhaseAt,
  decaySemanticOffset,
  densityForFps,
  materialForIndex,
  resolveParticlePosition,
  semanticSkeletonLayers,
  semanticFontSize,
  semanticSkeletonOpacity,
  sourceAlphaForCompositedOpacity,
  tokenStageForInfluence,
} from '../src/lib/particle-field';

describe('semantic pointer motion', () => {
  it('clamps semantic displacement by vector length', () => {
    const clamped = clampSemanticOffset({ x: 6, y: 8 }, 8);
    expect(clamped.x).toBeCloseTo(4.8, 5);
    expect(clamped.y).toBeCloseTo(6.4, 5);
    expect(Math.hypot(clamped.x, clamped.y)).toBe(8);
    expect(clampSemanticOffset({ x: 3, y: 4 }, 8)).toEqual({ x: 3, y: 4 });
  });

  it('decays offsets exponentially with a 180ms time constant', () => {
    expect(decaySemanticOffset({ x: 8, y: -4 }, 180)).toEqual({
      x: expect.closeTo(8 / Math.E, 5),
      y: expect.closeTo(-4 / Math.E, 5),
    });
    expect(Math.hypot(...Object.values(decaySemanticOffset({ x: 8, y: 0 }, 500)))).toBeLessThan(0.5);
  });
});

describe('densityForFps', () => {
  it('keeps full density for smooth animation and degrades for slow devices', () => {
    expect(densityForFps(60, 1)).toBe(1);
    expect(densityForFps(42, 1)).toBe(0.78);
    expect(densityForFps(25, 1)).toBe(0.55);
  });

  it('never increases density above the current adaptive value', () => {
    expect(densityForFps(60, 0.55)).toBe(0.55);
  });
});

describe('tokenStageForInfluence', () => {
  it('progresses from noise to mask to partial and resolved token', () => {
    expect(tokenStageForInfluence(0.1)).toBe('noise');
    expect(tokenStageForInfluence(0.35)).toBe('mask');
    expect(tokenStageForInfluence(0.62)).toBe('partial');
    expect(tokenStageForInfluence(0.9)).toBe('resolved');
  });
});

describe('coherencePhaseAt', () => {
  it('follows the three-second coherence and editing sequence', () => {
    expect(coherencePhaseAt(0).name).toBe('noise');
    expect(coherencePhaseAt(120).name).toBe('align');
    expect(coherencePhaseAt(260).name).toBe('decode');
    expect(coherencePhaseAt(650).name).toBe('hold');
    expect(coherencePhaseAt(1100).name).toBe('fragment');
    expect(coherencePhaseAt(1260).name).toBe('reform');
    expect(coherencePhaseAt(1440).name).toBe('resolved');
    expect(coherencePhaseAt(2250).name).toBe('disperse');
    expect(coherencePhaseAt(3000).name).toBe('noise');
  });

  it('finishes parallel decoding by 650ms and shares one edit impulse', () => {
    expect(coherencePhaseAt(260).decode).toBe(0);
    expect(coherencePhaseAt(650).decode).toBe(1);

    const editProgress = coherencePhaseAt(1180).edit;
    expect(editProgress).toBeGreaterThan(0);
    expect([0, 1, 2].map(() => coherencePhaseAt(1180).edit)).toEqual([
      editProgress,
      editProgress,
      editProgress,
    ]);
  });

  it('keeps replacement targets resolved after the edit finishes', () => {
    expect(coherencePhaseAt(1259).replacement).toBe(0);
    expect(coherencePhaseAt(1350).replacement).toBeGreaterThan(0);
    expect(coherencePhaseAt(1440).replacement).toBe(1);
    expect(coherencePhaseAt(2200).replacement).toBe(1);
  });
});

describe('coherence field material', () => {
  it('uses a stable mix of micro particles, strokes, masks, and semantic fragments', () => {
    const materials = Array.from({ length: 100 }, (_, index) => materialForIndex(index));

    expect(materials.filter((material) => material === 'micro')).toHaveLength(62);
    expect(materials.filter((material) => material === 'stroke')).toHaveLength(20);
    expect(materials.filter((material) => material === 'mask')).toHaveLength(12);
    expect(materials.filter((material) => material === 'semantic')).toHaveLength(6);
  });

  it('feathers an implicit square instead of drawing a hard panel edge', () => {
    expect(coherenceWeight(50, 50, 50, 50, 40, 10)).toBe(1);
    expect(coherenceWeight(70, 50, 50, 50, 40, 10)).toBeCloseTo(0.5, 5);
    expect(coherenceWeight(81, 50, 50, 50, 40, 10)).toBe(0);
  });

  it('places resolved particles directly on their semantic targets', () => {
    expect(resolveParticlePosition(
      { x: 12, y: 18 },
      { x: 80, y: 64 },
      1,
    )).toEqual({ x: 80, y: 64 });
    expect(resolveParticlePosition(
      { x: 12, y: 18 },
      { x: 80, y: 64 },
      0.5,
    )).toEqual({ x: 46, y: 41 });
  });
});

describe('semantic typography', () => {
  it('uses readable mask sizes on desktop and mobile coherence regions', () => {
    expect(semanticFontSize(280, false)).toBe(18);
    expect(semanticFontSize(390, false)).toBe(20);
    expect(semanticFontSize(200, true)).toBe(14);
    expect(semanticFontSize(280, true)).toBe(16);
  });

  it('reveals a restrained skeleton late in decoding and dissolves it during edits', () => {
    expect(semanticSkeletonOpacity(0.3, 0, 0, 0)).toBe(0);
    expect(semanticSkeletonOpacity(1, 0, 0, 0)).toBe(0.24);
    expect(semanticSkeletonOpacity(1, 0, 0, 1)).toBeCloseTo(0.2688, 4);
    expect(semanticSkeletonOpacity(1, 1, 0, 1)).toBe(0);
    expect(semanticSkeletonOpacity(1, 0, 1, 1)).toBe(0);
    expect(semanticSkeletonOpacity(1, 0, 0, 1)).toBeLessThanOrEqual(0.28);
  });

  it('compensates source alpha so retained canvas trails converge to the requested opacity', () => {
    const targetOpacity = 0.28;
    const trailRetention = 0.8;
    const sourceOpacity = sourceAlphaForCompositedOpacity(targetOpacity, trailRetention);
    let compositedOpacity = 0;

    for (let frame = 0; frame < 240; frame += 1) {
      compositedOpacity = sourceOpacity + compositedOpacity * trailRetention * (1 - sourceOpacity);
    }

    expect(sourceOpacity).toBeCloseTo(0.07216, 4);
    expect(compositedOpacity).toBeCloseTo(targetOpacity, 4);
    expect(compositedOpacity).toBeLessThanOrEqual(0.28);
  });

  it('crossfades changed glyphs without switching unchanged token opacity', () => {
    expect(semanticSkeletonLayers(0.24, 0.25, true)).toEqual({
      initial: 0.18,
      replacement: 0.06,
    });
    expect(semanticSkeletonLayers(0.24, 0.75, true)).toEqual({
      initial: 0.06,
      replacement: 0.18,
    });
    expect(semanticSkeletonLayers(0.24, 0.5, false)).toEqual({
      initial: 0.24,
      replacement: 0,
    });
  });
});
