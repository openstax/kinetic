import {
    interceptStudyLaunch, test, goToPage, createStudy, expect, dayjs, faker, rmStudy,
} from './test'

test('displays studies', async ({ page }) => {
    const studyName = faker.commerce.productDescription()

    const studyId = await createStudy({ page, opensAt: dayjs().subtract(1, 'day'), name: studyName })
    await goToPage({ page, path: '/studies', loginAs: 'user' })
    await page.waitForTimeout(100)
    await expect(page).toMatchText(RegExp(studyName))
    await page.click(`[data-study-id="${studyId}"]`)

    await rmStudy({ page, studyId })
})

test('it auto-launches mandatory studies', async ({ page }) => {
    const studyName = faker.commerce.productDescription()
    const studyId = await createStudy({
        page,
        isMandatory: true,
        opensAt: dayjs().subtract(1, 'day'),
        name: studyName,
    })
    await goToPage({ page, path: '/studies', loginAs: 'user' })
    await expect(page).toMatchText('.modal-header', studyName)
    await expect(page).not.toHaveSelector('testId=data-close-btn')

    await rmStudy({ page, studyId })
})

test('launching study and testing completion', async ({ page }) => {

    await interceptStudyLaunch({ page })

    const studyId = await createStudy({ page, name: faker.commerce.productDescription() })
    await goToPage({ page, path: `/study/details/${studyId}`, loginAs: 'user' })
    await page.click('testId=launch-study')

    // qualtrics will redirect here once complete
    await goToPage({ page, path: `/study/land/${studyId}`, loginAs: 'user' })

    await page.click('testId=view-studies')
    await expect(page).toHaveSelector(`[data-study-id="${studyId}"][aria-disabled="true"]`)
    await page.click(`[data-study-id="${studyId}"]`)
    // should not have navigated
    expect(
        await page.evaluate(() => document.location.pathname)
    ).toMatch(/studies$/)
    await rmStudy({ page, studyId })
})
