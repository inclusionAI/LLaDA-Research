import { describe, expect, it } from 'vitest';
import { commonSchema, modelSchema, paperSchema } from '../src/lib/content-schema';

const required = {
  title: 'Draft research note',
  date: '2026-08-19',
  summary: 'A note that must opt in to publication explicitly.',
};

const officialModel = {
  ...required,
  tags: ['diffusion'],
  draft: false,
  family: 'LLaDA 2.x',
  modality: 'Language',
  links: {},
};

const officialPaper = {
  ...required,
  tags: ['diffusion'],
  draft: false,
  links: {},
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

describe('official research schemas', () => {
  it('accepts only InclusionAI models', () => {
    expect(modelSchema.safeParse({ ...officialModel, publisher: 'Other Lab' }).success).toBe(false);
    expect(modelSchema.safeParse({ ...officialModel, publisher: 'InclusionAI' }).success).toBe(true);
  });

  it('accepts only InclusionAI papers', () => {
    expect(paperSchema.safeParse({ ...officialPaper, publisher: 'Other Lab' }).success).toBe(false);
    expect(paperSchema.safeParse({ ...officialPaper, publisher: 'InclusionAI' }).success).toBe(true);
  });
});
