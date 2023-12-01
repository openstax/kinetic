import {
    addReward,
    createStudy,
    expect,
    goToPage,
    interceptStudyLaunch,
    test,
    useAdminPage,
    useResearcherPage,
    useUserPage,
} from './test'
import { createStudiesData } from './data-helpers';

test('displays studies', async ({ browser }) => {
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)

    await createStudiesData({ context: researcherPage.context(), numStudies: 5 })
    await goToPage({ page: userPage, path: '/studies' })
    await userPage.waitForSelector('testId=studies-listing')
})

test('filtering studies', async ({ browser }) => {
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)
    const studyIds = await createStudiesData({ context: researcherPage.context(), numStudies: 5 })

    await goToPage({ page: userPage, path: '/studies' })
    await userPage.click('testId=Learning')
    await expect(userPage).toHaveSelector(`[data-study-id="${studyIds[0]}"]`)
})

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

test('launching study and aborting it', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)

    await interceptStudyLaunch(userPage)

    const studyId = await createStudy({ researcherPage, adminPage })
    await goToPage({ page: userPage, path: `/studies/details/${studyId}` })

    await userPage.click('testId=launch-study')
    await userPage.waitForLoadState('networkidle')

    await goToPage({ page: userPage, path: `/study/land/${studyId}?abort=true` })
    await userPage.waitForSelector('testId=aborted-msg')
    await expect(userPage).toMatchText(/Try again later/)

    await userPage.getByRole('button', { name: /Go back to dashboard/i }).click()

    // Our study is under "Learning"
    await userPage.click('testId=Learning')

    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="false"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)

    // should have navigated
    await userPage.waitForURL(`**/studies/details/${studyId}`)

    // now mark complete with consent granted
    await goToPage({ page: userPage, path: `/study/land/${studyId}?consent=true` })

    await userPage.click('testId=view-studies')
    await userPage.click('testId=Learning')
    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
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

    await expect(userPage).not.toMatchText(/Points/)
    await expect(userPage).toMatchText(/Success!/g)
    // Our study is under "Learning"
    await userPage.click('testId=view-studies')
    await userPage.click('testId=Learning')

    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})
