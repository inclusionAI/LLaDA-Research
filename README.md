# LLaDA Research Website

An English-first research index for the LLaDA 2.x model family. The site publishes models, papers, and technical blog posts from MDX and deploys as a static GitHub Pages site.

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

The development server starts at `http://localhost:4321`.

Useful commands:

```bash
npm run check            # Astro and TypeScript diagnostics
npm run test:run         # Unit tests
npm run build            # Production build
npm run test:e2e         # Chromium, mobile WebKit, and desktop WebKit
npm run test:lighthouse  # Performance, accessibility, and SEO budgets
```

Install the browser runtimes once before the first end-to-end test:

```bash
npx playwright install chromium webkit
```

## Publishing content

Add MDX files to one of these directories:

```text
src/content/models/
src/content/papers/
src/content/blog/
```

Every entry requires a title, date, summary, tags, and publication flags. For example:

```mdx
---
title: "Inside LLaDA 2.x"
date: 2026-08-19
summary: "A concise description used on index pages and in search metadata."
tags: ["diffusion", "language"]
featured: false
draft: true
category: "Research"
readingTime: "6 min read"
links:
  project: "https://github.com/inclusionAI/LLaDA2.X"
---

Write the article in Markdown or MDX here.
```

Collection-specific fields:

- Models require `family` and `modality`; they may include `status` and `license`.
- Papers may include `venue`, `citation`, and paper/code/model links.
- Blog posts require a `category`: `Release`, `Research`, `Engineering`, or `Perspective`.

Publishing behavior:

- `draft: true` excludes an entry from production pages, RSS, Sitemap, and related content.
- `featured: true` places an entry in the homepage recommendation area.
- If several published entries are featured, the newest wins and the build emits a warning.
- If no entry is featured, the newest published entry is recommended automatically.
- Missing optional links are not rendered.

Run `npm run check` before committing. A push to `main` runs tests and publishes a successful build through GitHub Actions.

## GitHub Pages

The repository currently targets the project URL:

```text
https://ulov888.github.io/ant-llada/
```

The build reads `GITHUB_REPOSITORY` and automatically changes to `/` when the repository is moved to `ant-llada/ant-llada.github.io`.

In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` uploads `dist/` only after the unit tests and production build succeed.

For a custom domain, configure the domain in Pages settings and set `SITE_URL` and `BASE_PATH=/` in the build environment.

## Initial content sources

The included release metadata and links come from the official public projects:

- [LLaDA2.X](https://github.com/inclusionAI/LLaDA2.X)
- [LLaDA2.0-Uni](https://github.com/inclusionAI/LLaDA2.0-Uni)
- [InclusionAI on Hugging Face](https://huggingface.co/inclusionAI)

## License

Apache-2.0. See [LICENSE](LICENSE).
