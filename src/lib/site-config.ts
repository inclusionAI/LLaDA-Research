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
