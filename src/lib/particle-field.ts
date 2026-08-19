export type TokenStage = 'noise' | 'mask' | 'partial' | 'resolved';

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
