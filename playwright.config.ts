import { defineConfig, devices } from '@playwright/test';

const defaultPort = 4322;
const configuredPort = process.env.PLAYWRIGHT_PORT;
const parsedPort = configuredPort && /^\d+$/.test(configuredPort)
  ? Number.parseInt(configuredPort, 10)
  : Number.NaN;
const port = Number.isSafeInteger(parsedPort) && parsedPort >= 1 && parsedPort <= 65_535
  ? parsedPort
  : defaultPort;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  webServer: {
    command: `BASE_PATH=/ SITE_URL=${baseURL} npm run build && npx serve dist -l ${port}`,
    port,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
