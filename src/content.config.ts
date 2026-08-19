import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, modelSchema, paperSchema } from './lib/content-schema';

const models = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/models' }),
  schema: modelSchema,
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/papers' }),
  schema: paperSchema,
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: blogSchema,
});

export const collections = { models, papers, blog };
