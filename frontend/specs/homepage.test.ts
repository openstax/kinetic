import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
    await page.goto('http://localhost:3008/')
    expect(await page.textContent('.App')).toContain('hello world');
});
