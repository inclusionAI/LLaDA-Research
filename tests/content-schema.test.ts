import { describe, expect, it } from 'vitest';
import { commonSchema } from '../src/lib/content-schema';

const required = {
  title: 'Draft research note',
  date: '2026-08-19',
  summary: 'A note that must opt in to publication explicitly.',
};

describe('common content schema', () => {
  it('requires an explicit draft flag', () => {
    expect(commonSchema.safeParse({ ...required, tags: [] }).success).toBe(false);
  });

  it('requires an explicit tag list', () => {
    expect(commonSchema.safeParse({ ...required, draft: true }).success).toBe(false);
  });

  it('accepts content with explicit publication fields', () => {
    expect(commonSchema.safeParse({ ...required, tags: [], draft: true }).success).toBe(true);
  });
});
