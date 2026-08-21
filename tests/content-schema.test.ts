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
  it('requires InclusionAI participation for models', () => {
    expect(modelSchema.safeParse({ ...officialModel, participants: ['Other Lab'] }).success).toBe(false);
    expect(modelSchema.safeParse({ ...officialModel, participants: [] }).success).toBe(false);
    expect(modelSchema.safeParse({ ...officialModel, participants: ['InclusionAI', 'Partner Lab'] }).success).toBe(true);
  });

  it('requires InclusionAI participation for papers', () => {
    expect(paperSchema.safeParse({ ...officialPaper, participants: ['Other Lab'] }).success).toBe(false);
    expect(paperSchema.safeParse({ ...officialPaper, participants: [] }).success).toBe(false);
    expect(paperSchema.safeParse({ ...officialPaper, participants: ['Partner Lab', 'InclusionAI'] }).success).toBe(true);
  });

  it('does not accept the legacy sole-publisher field', () => {
    expect(modelSchema.safeParse({ ...officialModel, publisher: 'InclusionAI' }).success).toBe(false);
    expect(paperSchema.safeParse({ ...officialPaper, publisher: 'InclusionAI' }).success).toBe(false);
    expect(modelSchema.safeParse({
      ...officialModel,
      participants: ['InclusionAI'],
      publisher: 'InclusionAI',
    }).success).toBe(false);
    expect(paperSchema.safeParse({
      ...officialPaper,
      participants: ['InclusionAI'],
      publisher: 'InclusionAI',
    }).success).toBe(false);
  });
});
