import { addReward, createStudy, expect, goToPage, interceptStudyLaunch, loginAs, TC, test } from './test'
import { createStudyData } from './data-helpers';

test('displays studies', async ({ page, context }) => {
    await createStudyData({ page, context, numStudies: 5 })
    await loginAs({ page, login: 'user' })
    await goToPage({ page, path: '/studies' })
    await page.waitForSelector('testId=studies-listing')
})

test('filtering studies', async ({ page, context }) => {
    await createStudyData({ page, context, numStudies: 5 })

    const studyId = await createStudy({ page })
    await loginAs({ page, login: 'user' })
    await goToPage({ page, path: '/studies' })
    await page.click('testId=Learning')
    await expect(page).toHaveSelector(`[data-study-id="${studyId}"]`)
})

test('launching study and testing completion', async ({ page }) => {
    await addReward({ page, points: 5, prize: 'Pony' })
    await interceptStudyLaunch({ page })

    const studyId = await createStudy({ page })
    await goToPage({ page, path: '/studies' })
    await loginAs({ page, login: 'user' })
    await goToPage({ page, path: `/studies/details/${studyId}` })
    await page.click('testId=launch-study')

    // qualtrics will redirect here once complete
    await goToPage({ page, path: `/study/land/${studyId}` })
    await page.click('testId=view-studies')
    // Our study is under "Learning"
    await page.click('testId=Learning')

    await expect(page).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await page.click(`[data-study-id="${studyId}"]`)
    await expect(page).not.toHaveSelector('testId=launch-study', { timeout: 200 })
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

test('launching study and completing with no consent', async ({ page }) => {
    await interceptStudyLaunch({ page })

    const studyId = await createStudy({ page })
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
