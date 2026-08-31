import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { sortPublished } from '../lib/content';
import { withBase } from '../lib/site-config';

export async function GET(context: APIContext) {
  const posts = sortPublished(await getCollection('blog'));

  return rss({
    title: 'LLaDA Blog',
    description: 'Blog posts and technical perspectives from LLaDA research.',
    site: new URL(withBase(import.meta.env.BASE_URL), context.site),
    items: posts.map(({ id, data }) => ({
      title: data.title,
      description: data.summary,
      pubDate: data.date,
      link: withBase(import.meta.env.BASE_URL, `blog/${id}/`),
    })),
  });
}
