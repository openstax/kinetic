import { faker, goToPage, loginAs, test } from './test';
import { expect } from '@playwright/test';

test('can update researcher account details', async({ page }) => {
    await loginAs({ page, login: 'researcher' })
    await goToPage({ page, path: `/researcher-account` })

    await page.fill('[name=firstName]', 'a'.repeat(60))
    // TODO test cleanup https://playwright.dev/docs/best-practices#dont-use-manual-assertions
    expect(await page.$('[name=firstName].is-invalid')).toBeDefined()

    await page.fill('[name=firstName]', faker.name.firstName())
    await page.fill('[name=firstName]', faker.name.lastName())

    await page.fill('[name=researchInterest1]', faker.music.genre())
    await page.fill('[name=researchInterest2]', faker.music.genre())
    await page.fill('[name=researchInterest3]', faker.music.genre())

    await page.fill('[name=labPage]', faker.internet.url())
    await page.fill('[name=bio]', faker.name.jobDescriptor())

    await page.click('testId=form-save-btn')
    await page.waitForLoadState('networkidle')
})
