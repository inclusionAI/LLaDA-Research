import { z } from 'astro/zod';

export const resourceLinksSchema = z.object({
  project: z.url().optional(),
  paper: z.url().optional(),
  pdf: z.url().optional(),
  code: z.url().optional(),
  model: z.url().optional(),
  modelscope: z.url().optional(),
}).default({});

export const commonSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  summary: z.string().min(1),
  tags: z.array(z.string()),
  cover: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean(),
  authors: z.array(z.string()).default([]),
});

export const modelSchema = commonSchema.extend({
  family: z.string(),
  modality: z.string(),
  status: z.enum(['released', 'preview', 'archived']).default('released'),
  license: z.string().optional(),
  links: resourceLinksSchema,
});

export const paperSchema = commonSchema.extend({
  venue: z.string().optional(),
  citation: z.string().optional(),
  links: resourceLinksSchema,
});

export const blogSchema = commonSchema.extend({
  category: z.enum(['Release', 'Research', 'Engineering', 'Perspective']),
  readingTime: z.string().optional(),
  links: resourceLinksSchema,
});
