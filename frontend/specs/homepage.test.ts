import { test, expect } from './test'

test('requires login', async ({ page }) => {
    await page.goto('http://localhost:4000/')
    expect(await page.textContent('.homepage')).toContain('not logged in');
    expect(await page.$('testId=login-link')).not.toBeNull()
});
