import {
    createStudy,
    expect,
    goToPage,
    interceptStudyLaunch,
    test,
    useAdminPage,
    useResearcherPage,
    useUserPage,
} from '../test';
import { completeWelcomeMessage } from '../data-helpers';


test.beforeEach(async ({ browser }) => {
    const userPage = await useUserPage(browser)
    await completeWelcomeMessage(userPage.context())
})


test('launching study and completing with no consent', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)

    await interceptStudyLaunch(userPage)

    const studyId = await createStudy({ researcherPage, adminPage })
    await researcherPage.waitForURL(`**/studies`)

    await goToPage({ page: userPage, path: `/studies/details/${studyId}` })

    // should have navigated
    await userPage.waitForURL(`**/studies/details/${studyId}`)

    await userPage.click('testId=launch-study')
    await userPage.waitForLoadState('networkidle')

    await goToPage({ page: userPage, path: `/study/land/${studyId}?consent=false` })
    await userPage.waitForLoadState('networkidle')

    // No consent will redirect back to studies after completion
    await userPage.waitForURL(`**/studies`)

    // Our study is under "Learning"
    await userPage.click('testId=Learning')

    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})
