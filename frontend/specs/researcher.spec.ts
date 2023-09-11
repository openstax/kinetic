import { createStudy, test, useAdminPage, useResearcherPage } from './test'

test('can create a study', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)

    await createStudy({ researcherPage, adminPage })
})
