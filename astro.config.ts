import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { resolveDeploymentConfig } from './src/lib/site-config';

const deployed = resolveDeploymentConfig(process.env.GITHUB_REPOSITORY);

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL ?? deployed.site,
  base: process.env.BASE_PATH ?? deployed.base,
  integrations: [mdx(), sitemap()],
});
