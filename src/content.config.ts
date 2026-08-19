import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const resourceLinks = z.object({
  project: z.url().optional(),
  paper: z.url().optional(),
  pdf: z.url().optional(),
  code: z.url().optional(),
  model: z.url().optional(),
  modelscope: z.url().optional(),
}).default({});

const common = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  authors: z.array(z.string()).default([]),
});

const models = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/models' }),
  schema: common.extend({
    family: z.string(),
    modality: z.string(),
    status: z.enum(['released', 'preview', 'archived']).default('released'),
    license: z.string().optional(),
    links: resourceLinks,
  }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/papers' }),
  schema: common.extend({
    venue: z.string().optional(),
    citation: z.string().optional(),
    links: resourceLinks,
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: common.extend({
    category: z.enum(['Release', 'Research', 'Engineering', 'Perspective']),
    readingTime: z.string().optional(),
    links: resourceLinks,
  }),
});

export const collections = { models, papers, blog };
