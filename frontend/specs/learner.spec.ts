import { addReward, createStudy, expect, goToPage, interceptStudyLaunch, test, useUsersContext } from './test'
import { createStudiesData } from './data-helpers';

test('displays studies', async ({ browser }) => {
    const { userPage, researcherContext } = await useUsersContext(browser)

    await createStudiesData({ context: researcherContext, numStudies: 5 })
    await goToPage({ page: userPage, path: '/studies' })
    await userPage.waitForSelector('testId=studies-listing')
})

test('filtering studies', async ({ browser }) => {
    const { userPage, researcherContext } = await useUsersContext(browser)
    const studyIds = await createStudiesData({ context: researcherContext, numStudies: 5 })

    await goToPage({ page: userPage, path: '/studies' })
    await userPage.click('testId=Learning')
    await expect(userPage).toHaveSelector(`[data-study-id="${studyIds[0]}"]`)
})

test('launching study and testing completion', async ({ browser }) => {
    const { adminPage, researcherPage, userPage } = await useUsersContext(browser)
    await addReward({ page: adminPage, points: 5, prize: 'Pony' })

    const studyId = await createStudy({ researcherPage, adminPage })

    await goToPage({ page: userPage, path: `/studies/details/${studyId}` })
    await interceptStudyLaunch({ page: userPage })
    await userPage.click('testId=launch-study')

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
    const { userPage, researcherPage, adminPage } = await useUsersContext(browser)

    const studyId = await createStudy({ researcherPage, adminPage })
    await goToPage({ page: userPage, path: `/studies/details/${studyId}` })
    await interceptStudyLaunch({ page: userPage })

    await userPage.click('testId=launch-study')

    await goToPage({ page: userPage, path: `/study/land/${studyId}?abort=true` })
    await userPage.waitForSelector('testId=aborted-msg')
    await expect(userPage).not.toMatchText(/marked as complete/)
    // Our study is under "Learning"
    await userPage.click('testId=view-studies')
    await userPage.click('testId=Learning')

    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="false"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    // should have navigated
    await userPage.waitForURL(`**/studies/details/${studyId}`)
    // expect(
    //     await userPage.evaluate(() => document.location.pathname)
    // ).toMatch(RegExp(`/studies/details/${studyId}$`))

    // now mark complete with consent granted
    await goToPage({ page: userPage, path: `/study/land/${studyId}?consent=true` })
    // await page.waitForTimeout(100)
    await userPage.click('testId=view-studies')
    await userPage.click('testId=Learning')
    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})

test('launching study and completing with no consent', async ({ browser }) => {
    const { userPage, researcherPage, adminPage } = await useUsersContext(browser)

    await interceptStudyLaunch({ page: userPage })

    const studyId = await createStudy({ researcherPage, adminPage })
    await goToPage({ page: userPage, path: `/studies/details/${studyId}` })
    // should have navigated
    await userPage.waitForURL(`**/studies/details/${studyId}`)
    // expect(
    //     await userPage.evaluate(() => document.location.pathname)
    // ).toMatch(RegExp(`/studies/details/${studyId}`))
    await userPage.click('testId=launch-study')

    await goToPage({ page: userPage, path: `/study/land/${studyId}?consent=false` })
    await expect(userPage).not.toMatchText(/Points/)
    await expect(userPage).toMatchText(/Success!/)
    // Our study is under "Learning"
    await userPage.click('testId=view-studies')
    await userPage.click('testId=Learning')

    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})
