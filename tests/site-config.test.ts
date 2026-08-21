import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolveAssetUrl, resolveDeploymentConfig, withBase } from '../src/lib/site-config';

describe('public assets', () => {
  it('keeps the favicon within the approved journal palette', () => {
    const source = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');
    const approved = new Set(['#f7f8f3', '#24312b', '#68756e', '#527a68', '#d8e0d8', '#eef3ed']);
    const colors = [...source.matchAll(/#[0-9a-f]{6}/gi)].map(([color]) => color.toLowerCase());

    expect(colors.length).toBeGreaterThan(0);
    expect(colors.every((color) => approved.has(color))).toBe(true);
  });

  it('wires both black logos through the project-base helper', () => {
    const source = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
    const logoReferences = source.match(/src=\{local\('llada-logo-black\.svg'\)\}/g) ?? [];

    expect(logoReferences).toHaveLength(2);
    expect(withBase('/ant-llada', 'llada-logo-black.svg')).toBe('/ant-llada/llada-logo-black.svg');
  });

  it('uses Notes as the RSS channel title', () => {
    const source = readFileSync(new URL('../src/pages/rss.xml.ts', import.meta.url), 'utf8');

    expect(source).toContain("title: 'LLaDA Research Notes'");
    expect(source).not.toContain('LLaDA Research Blog');
  });
});

describe('resolveDeploymentConfig', () => {
  it('uses a repository base path for a project Pages site', () => {
    expect(resolveDeploymentConfig('Ulov888/ant-llada')).toEqual({
      site: 'https://ulov888.github.io',
      base: '/ant-llada',
    });
  });

  it('uses the root path for an organization Pages repository', () => {
    expect(resolveDeploymentConfig('ant-llada/ant-llada.github.io')).toEqual({
      site: 'https://ant-llada.github.io',
      base: '/',
    });
  });
});

describe('withBase', () => {
  it('joins a project base and a local path with one slash', () => {
    expect(withBase('/ant-llada', 'models/')).toBe('/ant-llada/models/');
  });

  it('joins the root base without adding a duplicate slash', () => {
    expect(withBase('/', 'models/')).toBe('/models/');
  });

  it('returns a trailing slash for the site root', () => {
    expect(withBase('/ant-llada', '')).toBe('/ant-llada/');
  });
});

describe('resolveAssetUrl', () => {
  it('prefixes root-relative public assets with the project base', () => {
    expect(resolveAssetUrl('/ant-llada', '/covers/release.webp')).toBe('/ant-llada/covers/release.webp');
  });

  it('prefixes relative public assets with the root base', () => {
    expect(resolveAssetUrl('/', 'covers/release.webp')).toBe('/covers/release.webp');
  });

  it('preserves external and embedded asset URLs', () => {
    expect(resolveAssetUrl('/ant-llada', 'https://images.example/release.webp')).toBe('https://images.example/release.webp');
    expect(resolveAssetUrl('/ant-llada', 'data:image/svg+xml;base64,abc')).toBe('data:image/svg+xml;base64,abc');
  });
});
