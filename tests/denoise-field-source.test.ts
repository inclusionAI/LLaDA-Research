import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  new URL('../src/components/DenoiseField.astro', import.meta.url),
  'utf8',
);

describe('DenoiseField light-surface renderer', () => {
  it('clears retained trails with ivory and draws semantic marks in sage', () => {
    expect(source).toContain(
      "context.fillStyle = fixedPhase ? '#f7f8f3' : `rgba(247, 248, 243, ${1 - canvasTrailRetention})`;",
    );
    expect(source).toContain(
      'context.fillStyle = `rgba(82, 122, 104, ${sourceOpacity})`;',
    );
    expect(source).toContain(
      ': `rgba(82, 122, 104, ${Math.min(0.52, alpha)})`;',
    );
    expect(source).not.toMatch(/#030303|rgba\(3,\s*3,\s*3/);
  });

  it('keeps pointer interaction local without restoring a radial spotlight', () => {
    expect(source).toContain('data-pointer-spotlight="none"');
    expect(source).not.toContain('createRadialGradient');
  });

  it('keeps one guarded requestAnimationFrame chain', () => {
    const schedulingSites = source.match(/requestAnimationFrame\(draw\)/g) ?? [];

    expect(schedulingSites).toHaveLength(2);
    expect(source).toMatch(
      /const draw = \(now: number\) => \{\s*frameHandle = 0;\s*renderFrame\(now\);\s*frameHandle = requestAnimationFrame\(draw\);\s*\};/,
    );
    expect(source).toMatch(
      /const startAnimation = \(\) => \{\s*if \(frameHandle \|\| document\.hidden \|\| motionQuery\.matches\) return;\s*frameHandle = requestAnimationFrame\(draw\);\s*\};/,
    );
  });
});
