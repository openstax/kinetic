import { createStudy, expect, goToPage, test, useAdminPage, useResearcherPage, useUserPage } from '../test';
import { completeWelcomeMessage } from '../data-helpers';


test.beforeEach(async ({ browser }) => {
    const userPage = await useUserPage(browser)
    await completeWelcomeMessage(userPage.context())
})


test('launching study and completing with no consent', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)

    const studyId = await createStudy({ researcherPage, adminPage })
    await researcherPage.waitForURL(`**/studies`)

    const userPage = await useUserPage(browser)

    await goToPage({ page: userPage, path: '/studies' })
    await userPage.click('testId=Learning')
    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)

    await userPage.click('testId=launch-study')

    await userPage.getByText('I consent').click()
    await userPage.getByText('18 or Older').click()
    await userPage.click('#NextButton')
    await userPage.click('#NextButton')

    // No consent will redirect back to studies after completion
    await userPage.waitForURL(`**/studies`)

    await goToPage({ page: userPage, path: `/studies/details/${studyId}` })
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})
