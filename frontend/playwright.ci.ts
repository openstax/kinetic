import { baseConfig } from './playwright.config'
import { defineConfig } from '@playwright/test';

defineConfig({
    ...baseConfig,
    globalSetup: require.resolve('./specs/setup.ci.ts'),
})
