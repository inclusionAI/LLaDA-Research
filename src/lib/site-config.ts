export interface DeploymentConfig {
  site: string;
  base: string;
}

export function resolveDeploymentConfig(repository = 'Ulov888/ant-llada'): DeploymentConfig {
  const [rawOwner = 'Ulov888', rawRepo = 'ant-llada'] = repository.split('/');
  const owner = rawOwner.toLowerCase();
  const repo = rawRepo || 'ant-llada';
  const rootRepository = `${owner}.github.io`;

  return {
    site: `https://${owner}.github.io`,
    base: repo.toLowerCase() === rootRepository ? '/' : `/${repo}`,
  };
}

export function withBase(base: string, path = ''): string {
  const normalizedBase = base === '/' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`;
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
}
