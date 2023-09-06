import { addReward, createStudy, expect, goToPage, interceptStudyLaunch, loginAs, test, useUsersContext } from './test'
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

test('launching study and testing completion', async ({ page, browser }) => {
    const { adminPage, researcherPage, userPage, researcherContext } = await useUsersContext(browser)
    await addReward({ page: adminPage, points: 5, prize: 'Pony' })
    const studyIds = await createStudiesData({ context: researcherContext })
    const studyId = await createStudy({ page: researcherPage, browser })

    await goToPage({ page: userPage, path: `/studies/details/${studyId}` })
    await interceptStudyLaunch({ page: userPage })
    await page.click('testId=launch-study')

    // qualtrics will redirect here once complete
    await goToPage({ page: userPage, path: `/study/land/${studyId}` })
    await page.click('testId=view-studies')
    // Our study is under "Learning"
    await page.click('testId=Learning')

    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await page.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})

test('launching study and aborting it', async ({ page }) => {
    await interceptStudyLaunch({ page })

    const studyId = await createStudy({ page })
    await loginAs({ page, login: 'user' })
    await goToPage({ page, path: `/studies/details/${studyId}` })
    await page.click('testId=launch-study')

    await goToPage({ page, path: `/study/land/${studyId}?abort=true` })
    await page.waitForSelector('testId=aborted-msg')
    await expect(page).not.toMatchText(/marked as complete/)
    // Our study is under "Learning"
    await page.click('testId=view-studies')
    await page.click('testId=Learning')

    await expect(page).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="false"]`)
    await page.click(`[data-study-id="${studyId}"]`)
    // should have navigated
    expect(
        await page.evaluate(() => document.location.pathname)
    ).toMatch(RegExp(`/studies/details/${studyId}$`))

    // now mark complete with consent granted
    await goToPage({ page, path: `/study/land/${studyId}?consent=true` })
    // await page.waitForTimeout(100)
    await page.click('testId=view-studies')
    await page.click('testId=Learning')
    await expect(page).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await page.click(`[data-study-id="${studyId}"]`)
    await expect(page).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})

test('launching study and completing with no consent', async ({ page, browser }) => {
    await interceptStudyLaunch({ page })

    const studyId = await createStudy({ browser })
    await loginAs({ page, login: 'user' })
    await goToPage({ page, path: `/studies/details/${studyId}` })
    // should have navigated
    expect(
        await page.evaluate(() => document.location.pathname)
    ).toMatch(RegExp(`/studies/details/${studyId}$`))
    await page.click('testId=launch-study')

    await goToPage({ page, path: `/study/land/${studyId}?consent=false` })
    await expect(page).not.toMatchText(/Points/)
    await expect(page).toMatchText(/Success!/)
    // Our study is under "Learning"
    await page.click('testId=view-studies')
    await page.click('testId=Learning')

    await expect(page).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await page.click(`[data-study-id="${studyId}"]`)
    await expect(page).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})
