import { describe, expect, it } from 'vitest';
import {
  coherenceWeight,
  coherencePhaseAt,
  densityForFps,
  materialForIndex,
  tokenStageForInfluence,
} from '../src/lib/particle-field';

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
});
