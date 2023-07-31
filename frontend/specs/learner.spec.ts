import {
    addReward,
    createStudy,
    expect,
    faker,
    goToPage,
    interceptStudyLaunch,
    loginAs,
    rmStudy,
    test,
} from './test'

test('displays studies', async ({ page }) => {
    // const studyName = faker.commerce.productName()
    // const studyId = await createStudy({ page, name: studyName })
    await goToPage({ page, path: '/studies', loginAs: 'user' })
    // await page.waitForSelector(`text=${studyName}`)
    //
    // await rmStudy({ page, studyId })
})

test('filtering & sorting', async ({ page }) => {
    // const studyName = faker.commerce.productName()

    // const firstStudyId = await createStudy({ page, name: studyName })
    // const secondStudyId = await createStudy({ page, name: studyName })


    await goToPage({ page, path: '/studies', loginAs: 'user' })

    // await rmStudy({ page, studyId: firstStudyId })
    // await rmStudy({ page, studyId: secondStudyId })
})

test('launching study and testing completion', async ({ page }) => {
    await addReward({ page, points: 5, prize: 'Pony' })

    await interceptStudyLaunch({ page })

    const studyId = await createStudy({ page, name: faker.commerce.productName(), approveAndLaunchStudy: true })
    await goToPage({ page, path: '/studies', loginAs: 'user' })
    await loginAs({ page, login: 'user' })
    await goToPage({ page, path: `/studies/details/${studyId}` })
    await page.click('testId=launch-study')

    // qualtrics will redirect here once complete
    await goToPage({ page, path: `/study/land/${studyId}` })
    await page.click('testId=view-studies')
    // Our study is under "Learning"
    await page.click('testId=Learning')
    await expect(page).toHaveSelector(`[data-study-id="${studyId}"][role="link"]`)

    await page.click(`[data-study-id="${studyId}"]`)
    await rmStudy({ page, studyId: studyId })
})

// TODO Same thing, need active studies
test('launching study and aborting it', async ({ page }) => {
    // await interceptStudyLaunch({ page })
    //
    // const studyId = await createStudy({ page, name: faker.commerce.productName() })
    // await goToPage({ page, path: `/studies/details/${studyId}`, loginAs: 'user' })
    // await page.click('testId=launch-study')
    //
    // await goToPage({ page, path: `/study/land/${studyId}?abort=true`, loginAs: 'user' })
    // await page.waitForSelector('testId=aborted-msg')
    // await expect(page).not.toMatchText(/marked as complete/)
    // await page.click('testId=view-studies')
    // await expect(page).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="false"]`)
    //
    // await page.click(`[data-study-id="${studyId}"]`)
    // // should have navigated
    // expect(
    //     await page.evaluate(() => document.location.pathname)
    // ).toMatch(RegExp(`/studies/details/${studyId}$`))
    //
    // // now mark complete with consent granted
    // await goToPage({ page, path: `/study/land/${studyId}?consent=true`, loginAs: 'user' })
    // await page.waitForTimeout(500)
    // await expect(page).toMatchText(/marked as complete/)
    // await page.click('testId=view-studies')
    // await expect(page).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    // await page.click(`[data-study-id="${studyId}"]`)
    // await expect(page).not.toHaveSelector('testId=launch-study', { timeout: 200 })
    //
    // await rmStudy({ page, studyId })
})

// TODO Same thing, need active studies
test('launching study and completing with no consent', async ({ page }) => {

    // await interceptStudyLaunch({ page })
    //
    // const studyId = await createStudy({ page, name: faker.commerce.productName() })
    // await goToPage({ page, path: `/studies/details/${studyId}`, loginAs: 'user' })
    // await page.click('testId=launch-study')
    //
    // await goToPage({ page, path: `/study/land/${studyId}?consent=false`, loginAs: 'user' })
    // await page.waitForTimeout(500)
    // await expect(page).not.toMatchText(/Points/)
    // await expect(page).toMatchText(/marked as complete/)
    //
    // await page.click('testId=view-studies')
    // await expect(page).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    //
    // await page.click(`[data-study-id="${studyId}"]`)
    //
    // await expect(page).not.toHaveSelector('testId=launch-study', { timeout: 200 })
    // await rmStudy({ page, studyId })
})
