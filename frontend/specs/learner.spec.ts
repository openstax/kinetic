import { addReward, createStudy, expect, faker, goToPage, interceptStudyLaunch, Locator, rmStudy, test } from './test'

test('displays studies', async ({ page }) => {
    // const studyName = faker.commerce.productName()
    // const studyId = await createStudy({ page, name: studyName })
    await goToPage({ page, path: '/studies', loginAs: 'user' })
    // await page.waitForSelector(`text=${studyName}`)
    //
    // await rmStudy({ page, studyId })
})

// TODO Filtering by active, draft, completed tabs
test('filtering & sorting', async ({ page }) => {
    // const studyName = faker.commerce.productName()

    // const firstStudyId = await createStudy({ page, name: studyName })
    // const secondStudyId = await createStudy({ page, name: studyName })

    await goToPage({ page, path: '/studies', loginAs: 'user' })

    // await rmStudy({ page, studyId: firstStudyId })
    // await rmStudy({ page, studyId: secondStudyId })
})

// TODO No way for researchers to set mandatory anymore...
//  might phase this out eventually
// test('it auto-launches mandatory studies', async ({ page }) => {
//     const studyName = faker.commerce.productName()
//     const studyId = await createStudy({ page, name: studyName })
//     await goToPage({ page, path: '/studies', loginAs: 'user' })
//     await expect(page).toMatchText('.modal-header', studyName)
//     await expect(page).not.toHaveSelector('testId=data-close-btn')
//
//     await rmStudy({ page, studyId })
// })

const studyIdForCard = (l: Locator) => l.evaluate<string, HTMLDivElement>(card => card.dataset.studyId)

test('launching study and testing completion', async ({ page }) => {
    await addReward({ page, points: 5, prize: 'Pony' })

    await interceptStudyLaunch({ page })

    const studyId = await createStudy({ page, name: faker.commerce.productName(), approveAndLaunchStudy: true })
    await goToPage({ page, path: '/studies', loginAs: 'user' })

    // const firstStudyCard = page.locator('css=.studies.filtered >> [data-testid="studies-listing"]').nth(0)
    // const firstStudyId = await studyIdForCard(firstStudyCard)
    // console.log(firstStudyId)

    await goToPage({ page, path: `/studies/details/${studyId}`, loginAs: 'user' })
    await page.click('testId=launch-study')
    // qualtrics will redirect here once complete
    await goToPage({ page, path: `/study/land/${studyId}`, loginAs: 'user' })
    await page.click('testId=view-studies')
    await expect(page).toHaveSelector(`[data-study-id="${studyId}"][role="link"]`)
    // test that sort order is the same
    // expect(firstStudyId).toEqual(await studyIdForCard(firstStudyCard))
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
