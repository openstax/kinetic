import { test, expect } from './test'

test('requires login', async ({ page }) => {
    await page.goto('http://localhost:4000/')
    expect(await page.textContent('body')).toContain('Please login');
    expect(await page.$('testId=login-link')).not.toBeNull()
});
