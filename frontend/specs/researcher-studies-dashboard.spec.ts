import { goToPage, loginAs, test } from './test';

test('can access studies table as a researcher', async({ page }) => {
    await loginAs({ page, login: 'researcher' })
    await goToPage({ page, path: `/studies` })
    await page.isVisible('testId=studies-table')
})
