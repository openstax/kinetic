import { faker, goToPage, test, useResearcherPage } from './test';
import { expect } from '@playwright/test';

test('can update researcher account details', async({ browser }) => {
    const researcherPage = await useResearcherPage(browser)
    await goToPage({ page: researcherPage, path: `/researcher-account` })

    await researcherPage.fill('[name=firstName]', 'a'.repeat(60))
    expect(researcherPage.locator('[name=firstName].is-invalid')).toBeDefined()

    await researcherPage.fill('[name=firstName]', faker.name.firstName())
    await researcherPage.fill('[name=firstName]', faker.name.lastName())

    await researcherPage.fill('[name=researchInterest1]', faker.music.genre())
    await researcherPage.fill('[name=researchInterest2]', faker.music.genre())
    await researcherPage.fill('[name=researchInterest3]', faker.music.genre())

    await researcherPage.fill('[name=labPage]', faker.internet.url())
    await researcherPage.fill('[name=bio]', faker.name.jobDescriptor())

    await researcherPage.click('testId=form-save-btn')
    await researcherPage.waitForLoadState('networkidle')
})
