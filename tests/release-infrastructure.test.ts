import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

type WebServerConfig = {
  command: string;
  port: number;
  reuseExistingServer: boolean;
};

const loadPlaywrightConfig = async (port: string) => {
  vi.stubEnv('PLAYWRIGHT_PORT', port);
  vi.resetModules();

  return (await import('../playwright.config')).default;
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('Playwright server isolation', () => {
  it('uses a dedicated default port and never reuses an existing server', async () => {
    const config = await loadPlaywrightConfig('');
    const server = config.webServer as WebServerConfig;

    expect(server.port).toBe(4322);
    expect(server.reuseExistingServer).toBe(false);
    expect(server.command).toContain('SITE_URL=http://127.0.0.1:4322');
    expect(server.command).toContain('npx serve dist -l 4322');
    expect(config.use?.baseURL).toBe('http://127.0.0.1:4322');
  });

  it('shares one numeric PLAYWRIGHT_PORT across the command, server, and browser', async () => {
    const config = await loadPlaywrightConfig('49321');
    const server = config.webServer as WebServerConfig;

    expect(server.port).toBe(49321);
    expect(server.command).toContain('SITE_URL=http://127.0.0.1:49321');
    expect(server.command).toContain('npx serve dist -l 49321');
    expect(config.use?.baseURL).toBe('http://127.0.0.1:49321');
  });

  it.each(['4322; touch /tmp/injected', '0', '70000', '-4322', '43.22'])(
    'falls back safely when PLAYWRIGHT_PORT is %j',
    async (port) => {
      const config = await loadPlaywrightConfig(port);
      const server = config.webServer as WebServerConfig;

      expect(server.port).toBe(4322);
      expect(server.command).toContain('SITE_URL=http://127.0.0.1:4322');
      expect(server.command).toContain('npx serve dist -l 4322');
      expect(server.command).not.toContain(`-l ${port}`);
      expect(config.use?.baseURL).toBe('http://127.0.0.1:4322');
    },
  );
});

describe('Pages deployment acceptance gate', () => {
  it('installs Chromium and runs desktop E2E before the deployable build and upload', () => {
    const workflow = readFileSync(
      new URL('../.github/workflows/deploy.yml', import.meta.url),
      'utf8',
    );
    const browserInstall = workflow.indexOf('run: npx playwright install --with-deps chromium');
    const desktopE2E = workflow.indexOf('run: npm run test:e2e -- --project=desktop');
    const productionBuild = workflow.indexOf('run: npm run build');
    const artifactUpload = workflow.indexOf('uses: actions/upload-pages-artifact@v3');

    expect(browserInstall).toBeGreaterThan(-1);
    expect(desktopE2E).toBeGreaterThan(browserInstall);
    expect(productionBuild).toBeGreaterThan(desktopE2E);
    expect(artifactUpload).toBeGreaterThan(productionBuild);
  });
});
