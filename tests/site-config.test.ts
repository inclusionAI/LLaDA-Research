import { describe, expect, it } from 'vitest';
import { resolveDeploymentConfig } from '../src/lib/site-config';

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
