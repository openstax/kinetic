import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: require.resolve('./specs/setup.ts'),
    timeout: 5 * 60 * 1000,
    forbidOnly: !!process.env.CI,
    // fullyParallel: true,
    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    workers: 4,
}

export default config;
