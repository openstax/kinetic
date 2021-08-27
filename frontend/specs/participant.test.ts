import { goToPage, loginAs } from './helpers'
import { test, createStudy, expect, logout, dayjs, faker, closeStudy, setFlatpickrDate } from './test'

test('displays studies', async ({ page }) => {
    const studyName = faker.commerce.productDescription()
    const studyId = await createStudy({ page, opensAt: dayjs().subtract(1, 'day'), name: studyName })
    await goToPage({ page, path: '/studies', loginAs: 'user' })
    await expect(page).toMatchText(RegExp(studyName))
    await closeStudy({ page, studyId })
})

test.only('it auto-launches mandatory studies', async ({ page }) => {
    const studyName = faker.commerce.productDescription()
    const studyId = await createStudy({
        page,
        isMandatory: true,
        opensAt: dayjs().subtract(1, 'day'),
        name: studyName,
    })
    await goToPage({ page, path: '/studies', loginAs: 'user' })

    await page.waitForFunction(
        () => document.location.origin.match(/openstax.org/),
        null,
        { timeout: 5000 },
    )
    await page.pause()
    // await page.goBack()
    // await logout({ page })
    // await goToPage({ page, path: `/studies/${studyId}`, loginAs: 'researcher' })
    // await page.uncheck('input[name=isMandatory]')
    // await page.click('testId=form-save-btn')
    await closeStudy({ page, studyId })
})
