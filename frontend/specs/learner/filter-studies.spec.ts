import { createStudy, expect, goToPage, test, useAdminPage, useResearcherPage, useUserPage } from '../test';
import { completeWelcomeMessage } from '../data-helpers';

test.beforeEach(async ({ browser }) => {
    const userPage = await useUserPage(browser)
    await completeWelcomeMessage(userPage.context())
})

test('filtering studies', async ({ browser }) => {
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)
    const adminPage = await useAdminPage(browser)

    const studyId = await createStudy({ researcherPage, adminPage })
    await createStudy({ researcherPage, adminPage })
    await createStudy({ researcherPage, adminPage })
    await createStudy({ researcherPage, adminPage })

    await goToPage({ page: userPage, path: '/studies' })
    await userPage.click('testId=Learning Goals')
    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"]`)
})
