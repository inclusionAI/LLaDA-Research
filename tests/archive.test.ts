import { describe, expect, it } from 'vitest';
import { matchesArchiveEntry, selectRelated } from '../src/lib/archive';

describe('matchesArchiveEntry', () => {
  it('matches a query against the title and tags', () => {
    expect(matchesArchiveEntry('LLaDA2.0-Uni', ['multimodal', 'generation'], 'multimodal', '')).toBe(true);
    expect(matchesArchiveEntry('LLaDA2.0-Uni', ['multimodal', 'generation'], 'token editing', '')).toBe(false);
  });

  it('requires the active tag when one is selected', () => {
    expect(matchesArchiveEntry('LLaDA2.0-Uni', ['multimodal'], '', 'multimodal')).toBe(true);
    expect(matchesArchiveEntry('LLaDA2.0-Uni', ['multimodal'], '', 'language')).toBe(false);
  });
});

describe('selectRelated', () => {
  const entries = [
    { id: 'current', kind: 'paper', data: { title: 'Current', tags: ['diffusion', 'language'], date: new Date('2026-08-01') } },
    { id: 'strong', kind: 'model', data: { title: 'Strong', tags: ['diffusion', 'language'], date: new Date('2026-06-01') } },
    { id: 'newer', kind: 'blog', data: { title: 'Newer', tags: ['diffusion'], date: new Date('2026-07-01') } },
    { id: 'older', kind: 'paper', data: { title: 'Older', tags: ['diffusion'], date: new Date('2026-05-01') } },
    { id: 'unrelated', kind: 'blog', data: { title: 'Unrelated', tags: ['vision'], date: new Date('2026-08-10') } },
  ];

  it('excludes the current item and ranks shared tags before date', () => {
    expect(selectRelated(entries, { id: 'current', kind: 'paper' }, ['diffusion', 'language']).map(({ id }) => id)).toEqual([
      'strong',
      'newer',
      'older',
    ]);
  });

  it('keeps a different collection entry that shares the same id', () => {
    const collision = [
      { id: 'llada-2-0-uni', kind: 'model', data: { title: 'Model', tags: ['multimodal'], date: new Date('2026-04-23') } },
      { id: 'llada-2-0-uni', kind: 'paper', data: { title: 'Paper', tags: ['multimodal'], date: new Date('2026-04-23') } },
    ];
    expect(selectRelated(collision, { id: 'llada-2-0-uni', kind: 'paper' }, ['multimodal']).map(({ kind }) => kind)).toEqual(['model']);
  });
});
