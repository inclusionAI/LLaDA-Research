export type TokenStage = 'noise' | 'mask' | 'partial' | 'resolved';
export type CoherencePhaseName =
  | 'noise'
  | 'align'
  | 'decode'
  | 'hold'
  | 'fragment'
  | 'reform'
  | 'resolved'
  | 'disperse';

export type CoherencePhase = {
  name: CoherencePhaseName;
  coherence: number;
  decode: number;
  edit: number;
  replacement: number;
  disperse: number;
};
export type ParticleMaterial = 'micro' | 'stroke' | 'mask' | 'semantic';

const smoothstep = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
};

const progress = (value: number, start: number, end: number) => (
  smoothstep((value - start) / (end - start))
);

export function densityForFps(fps: number, current: number): number {
  const target = fps < 32 ? 0.55 : fps < 48 ? 0.78 : 1;
  return Math.min(current, target);
}

export function tokenStageForInfluence(influence: number): TokenStage {
  if (influence >= 0.78) return 'resolved';
  if (influence >= 0.52) return 'partial';
  if (influence >= 0.24) return 'mask';
  return 'noise';
}

export function coherencePhaseAt(elapsedMs: number): CoherencePhase {
  const elapsed = ((elapsedMs % 3000) + 3000) % 3000;
  const name: CoherencePhaseName = elapsed < 120
    ? 'noise'
    : elapsed < 260
      ? 'align'
      : elapsed < 650
        ? 'decode'
        : elapsed < 1100
          ? 'hold'
          : elapsed < 1260
            ? 'fragment'
            : elapsed < 1440
              ? 'reform'
              : elapsed < 2250
                ? 'resolved'
                : 'disperse';

  const coherence = elapsed < 120
    ? 0
    : elapsed < 260
      ? progress(elapsed, 120, 260) * 0.45
      : elapsed < 650
        ? 0.45 + progress(elapsed, 260, 650) * 0.55
        : elapsed < 2250
          ? 1
          : 1 - progress(elapsed, 2250, 3000);
  const decode = elapsed < 260
    ? 0
    : elapsed < 650
      ? progress(elapsed, 260, 650)
      : elapsed < 2250
        ? 1
        : 1 - progress(elapsed, 2250, 3000);
  const edit = elapsed < 1100
    ? 0
    : elapsed < 1260
      ? progress(elapsed, 1100, 1260)
      : elapsed < 1440
        ? 1 - progress(elapsed, 1260, 1440)
        : 0;
  const replacement = elapsed < 1260 ? 0 : progress(elapsed, 1260, 1440);
  const disperse = elapsed < 2250 ? 0 : progress(elapsed, 2250, 3000);

  return { name, coherence, decode, edit, replacement, disperse };
}

export function materialForIndex(index: number): ParticleMaterial {
  const slot = ((index % 100) + 100) % 100;
  if (slot < 62) return 'micro';
  if (slot < 82) return 'stroke';
  if (slot < 94) return 'mask';
  return 'semantic';
}

export function coherenceWeight(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  side: number,
  feather: number,
): number {
  const halfSide = side / 2;
  const signedDistance = Math.max(Math.abs(x - centerX), Math.abs(y - centerY)) - halfSide;
  if (feather <= 0) return signedDistance <= 0 ? 1 : 0;
  return 1 - smoothstep((signedDistance + feather) / (feather * 2));
}

export function resolveParticlePosition(
  ambient: { x: number; y: number },
  semantic: { x: number; y: number },
  coherence: number,
): { x: number; y: number } {
  const blend = Math.max(0, Math.min(1, coherence));
  return {
    x: ambient.x + (semantic.x - ambient.x) * blend,
    y: ambient.y + (semantic.y - ambient.y) * blend,
  };
}
