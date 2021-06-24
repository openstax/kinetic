import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
    await page.goto('http://localhost:4000/')
    expect(await page.textContent('.App')).toContain('hello world');
});
