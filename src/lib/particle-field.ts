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
export type VectorOffset = { x: number; y: number };

const smoothstep = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
};

const progress = (value: number, start: number, end: number) => (
  smoothstep((value - start) / (end - start))
);

export function normalizedPointerSpeed(
  distancePx: number,
  elapsedMs: number,
  referenceFrameMs = 1000 / 60,
): number {
  const distance = Number.isFinite(distancePx) ? Math.max(0, distancePx) : 0;
  if (distance === 0) return 0;
  const reference = Number.isFinite(referenceFrameMs) && referenceFrameMs > 0
    ? referenceFrameMs
    : 1000 / 60;
  const elapsed = Number.isFinite(elapsedMs) && elapsedMs > 0 ? elapsedMs : reference;
  return distance * reference / elapsed;
}

export function clampSemanticOffset(offset: VectorOffset, maximum = 8): VectorOffset {
  const distance = Math.hypot(offset.x, offset.y);
  const limit = Math.max(0, maximum);
  if (distance <= limit || distance === 0) return offset;
  const scale = limit / distance;
  return { x: offset.x * scale, y: offset.y * scale };
}

export function decaySemanticOffset(
  offset: VectorOffset,
  elapsedMs: number,
  timeConstantMs = 180,
): VectorOffset {
  const decay = semanticOffsetDecayFactor(elapsedMs, timeConstantMs);
  return { x: offset.x * decay, y: offset.y * decay };
}

export function semanticOffsetDecayFactor(elapsedMs: number, timeConstantMs = 180): number {
  return Math.exp(-Math.max(0, elapsedMs) / Math.max(1, timeConstantMs));
}

export function strokeTangentAt(
  alpha: ArrayLike<number>,
  width: number,
  height: number,
  x: number,
  y: number,
): VectorOffset {
  const sample = (sampleX: number, sampleY: number) => {
    if (sampleX < 0 || sampleX >= width || sampleY < 0 || sampleY >= height) return 0;
    return alpha[sampleY * width + sampleX] || 0;
  };
  let gradientX = 0;
  let gradientY = 0;
  for (let radius = 1; radius <= 2; radius += 1) {
    gradientX += (sample(x + radius, y) - sample(x - radius, y)) / radius;
    gradientY += (sample(x, y + radius) - sample(x, y - radius)) / radius;
  }
  const gradientLength = Math.hypot(gradientX, gradientY);
  if (gradientLength > 1) {
    return { x: -gradientY / gradientLength, y: gradientX / gradientLength };
  }

  let covarianceXX = 0;
  let covarianceXY = 0;
  let covarianceYY = 0;
  let weightTotal = 0;
  const neighborhoodRadius = 4;
  for (let offsetY = -neighborhoodRadius; offsetY <= neighborhoodRadius; offsetY += 1) {
    for (let offsetX = -neighborhoodRadius; offsetX <= neighborhoodRadius; offsetX += 1) {
      const weight = sample(x + offsetX, y + offsetY) / 255;
      if (weight <= 0) continue;
      covarianceXX += weight * offsetX * offsetX;
      covarianceXY += weight * offsetX * offsetY;
      covarianceYY += weight * offsetY * offsetY;
      weightTotal += weight;
    }
  }
  if (weightTotal > 1) {
    const angle = 0.5 * Math.atan2(2 * covarianceXY, covarianceXX - covarianceYY);
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }
  return { x: 1, y: 0 };
}

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

export function semanticFontSize(side: number, mobile: boolean): number {
  if (mobile) return Math.max(14, Math.min(16, Math.round(side * 0.057)));
  return Math.max(18, Math.min(20, Math.round(side * 0.052)));
}

export function semanticSkeletonOpacity(
  decode: number,
  edit: number,
  disperse: number,
  pointerProximity: number,
): number {
  const reveal = smoothstep((decode - 0.45) / 0.55);
  const stability = Math.max(0, 1 - edit) * Math.max(0, 1 - disperse);
  const pointerBoost = 1 + Math.max(0, Math.min(1, pointerProximity)) * 0.12;
  return Math.min(0.28, 0.24 * reveal * stability * pointerBoost);
}

export function sourceAlphaForCompositedOpacity(
  compositedOpacity: number,
  trailRetention: number,
): number {
  const target = Math.max(0, Math.min(1, compositedOpacity));
  const retention = Math.max(0, Math.min(1, trailRetention));
  const denominator = 1 - target * retention;
  return denominator <= 0 ? target : target * (1 - retention) / denominator;
}

export function semanticSkeletonLayers(
  opacity: number,
  replacement: number,
  changed: boolean,
): { initial: number; replacement: number } {
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  if (!changed) return { initial: clampedOpacity, replacement: 0 };
  const progress = Math.max(0, Math.min(1, replacement));
  return {
    initial: clampedOpacity * (1 - progress),
    replacement: clampedOpacity * progress,
  };
}
