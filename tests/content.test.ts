import { describe, expect, it } from 'vitest';
import { selectFeatured, sortPublished } from '../src/lib/content';

const entry = (id: string, date: string, featured = false, draft = false) => ({
  id,
  data: { title: id, date: new Date(date), featured, draft },
});

describe('content selection', () => {
  it('filters drafts and sorts newest first', () => {
    const result = sortPublished([
      entry('old', '2026-01-01'),
      entry('draft', '2026-12-01', false, true),
      entry('new', '2026-08-01'),
    ]);
    expect(result.map(({ id }) => id)).toEqual(['new', 'old']);
  });

  it('selects the newest featured entry', () => {
    const result = selectFeatured([
      entry('latest', '2026-08-01'),
      entry('featured-old', '2026-05-01', true),
      entry('featured-new', '2026-07-01', true),
    ], () => undefined);
    expect(result?.id).toBe('featured-new');
  });

  it('falls back to the newest published entry', () => {
    expect(selectFeatured([
      entry('old', '2026-01-01'),
      entry('new', '2026-08-01'),
    ])?.id).toBe('new');
  });

  it('warns when several entries are featured', () => {
    const warnings: string[] = [];
    selectFeatured([
      entry('featured-old', '2026-05-01', true),
      entry('featured-new', '2026-07-01', true),
    ], (message) => warnings.push(message));
    expect(warnings).toEqual(['Multiple featured entries found; using featured-new.']);
  });

  it('selects a featured entry across collection types', () => {
    const entries = [
      entry('model', '2026-08-01'),
      entry('paper', '2026-07-01', true),
      entry('post', '2026-08-19'),
    ];
    expect(selectFeatured(entries)?.id).toBe('paper');
  });
});
