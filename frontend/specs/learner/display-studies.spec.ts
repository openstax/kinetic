import { createStudy, goToPage, test, useAdminPage, useResearcherPage, useUserPage } from '../test';
import { completeWelcomeMessage } from '../data-helpers';

test.beforeEach(async ({ browser }) => {
    const userPage = await useUserPage(browser)
    await completeWelcomeMessage(userPage.context())
})

test('displays studies', async ({ browser }) => {
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)
    const adminPage = await useAdminPage(browser)

    await createStudy({ researcherPage, adminPage })
    await createStudy({ researcherPage, adminPage })
    await createStudy({ researcherPage, adminPage })
    await createStudy({ researcherPage, adminPage })
    await createStudy({ researcherPage, adminPage })

    await goToPage({ page: userPage, path: '/studies' })
    await userPage.waitForSelector('testId=studies-listing')
})
