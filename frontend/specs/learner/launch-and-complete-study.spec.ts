import {
    addReward,
    createStudy, expect, goToPage,
    interceptStudyLaunch,
    test,
    useAdminPage,
    useResearcherPage,
    useUserPage,
} from '../test';

test('launching study and testing completion', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)

    await interceptStudyLaunch(userPage)

    await addReward({ page: adminPage, points: 5, prize: 'Pony' })

    const studyId = await createStudy({ researcherPage, adminPage })

    await goToPage({ page: userPage, path: `/studies/details/${studyId}` })
    await userPage.click('testId=launch-study')
    await userPage.waitForLoadState('networkidle')

    // qualtrics will redirect here once complete
    await goToPage({ page: userPage, path: `/study/land/${studyId}` })
    await userPage.click('testId=view-studies')

    // Our study is under "Learning"
    await userPage.click('testId=Learning')

    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})
