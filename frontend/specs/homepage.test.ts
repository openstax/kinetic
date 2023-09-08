import { test, expect } from './test'

test('requires login', async ({ page }) => {
    await page.goto('http://localhost:4000/')
    await page.waitForSelector('testId=incorrect-user-panel')
    await expect(page.getByTestId('incorrect-user-panel')).toContainText('Please log in')
    await expect(page.getByTestId('login-link')).toBeVisible()
    // TODO test cleanup https://playwright.dev/docs/best-practices#dont-use-ma/**/nual-assertions
    // expect(await page.textContent('testId=incorrect-user-panel')).toContain('Please log in');
    // expect(await page.$('testId=login-link')).not.toBeNull()
});
