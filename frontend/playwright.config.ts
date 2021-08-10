import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: require.resolve('./specs/setup.ts'),
    forbidOnly: !!process.env.CI,
    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
}

export default config;
