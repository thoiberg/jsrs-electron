import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 10 * 1000,
  maxFailures: 2,
  expect: {
    timeout: 5 * 1000,
  },

  //   /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  //   /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  //   /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  //   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',

  outputDir: 'test-results/',
}

export default config
