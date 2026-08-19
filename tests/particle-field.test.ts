import { describe, expect, it } from 'vitest';
import { densityForFps, tokenStageForInfluence } from '../src/lib/particle-field';

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
