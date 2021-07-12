import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: require.resolve('./specs/setup.ts'),

    use: {
        screenshot: 'only-on-failure',

    },
}

export default config;
