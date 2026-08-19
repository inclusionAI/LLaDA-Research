import { describe, expect, it } from 'vitest';
import { resolveDeploymentConfig, withBase } from '../src/lib/site-config';

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
