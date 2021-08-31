import { test, goToPage, createStudy, expect, dayjs, faker, closeStudy } from './test'

test('displays studies', async ({ page }) => {
    const studyName = faker.commerce.productDescription()

    const studyId = await createStudy({ page, opensAt: dayjs().subtract(1, 'day'), name: studyName })
    await goToPage({ page, path: '/studies', loginAs: 'user' })
    await page.waitForTimeout(100)
    await expect(page).toMatchText(RegExp(studyName))
    await page.click(`[data-study-id="${studyId}"]`)

    await closeStudy({ page, studyId })
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

    await page.waitForFunction(
        () => document.location.origin.match(/openstax.org/),
        null,
        { timeout: 5000 },
    )

    await closeStudy({ page, studyId })
})
