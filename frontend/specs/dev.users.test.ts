import { test, expect } from '@playwright/test';


test('it shows list of users to login as', async ({ page }) => {
    await page.goto('http://localhost:4000/')
    await page.waitForSelector('[data-test-id="login-link"]')
    await page.click('[data-test-id="login-link"]')
    await page.click('[data-user-id="00000000-0000-0000-0000-000000000000"]')
    expect(await page.textContent('.homepage')).toContain('hello user')
});
