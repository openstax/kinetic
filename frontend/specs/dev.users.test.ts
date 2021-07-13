import { test, expect } from './test'

test('it can login as admin', async ({ page }) => {
    await page.goto('http://localhost:4000/')
    await page.click('testId=login-link')
    await page.click('[data-user-id="00000000-0000-0000-0000-000000000000"]')
    expect(await page.textContent('.homepage')).toContain('studies')
});
