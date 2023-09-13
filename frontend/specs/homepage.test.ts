import { test, expect } from './test'

test('requires login', async ({ page }) => {
    await page.goto('http://localhost:4000/')
    await page.waitForSelector('testId=incorrect-user-panel')
    await expect(page.getByTestId('incorrect-user-panel')).toContainText('Please log in')
    await expect(page.getByTestId('login-link')).toBeVisible()
});
