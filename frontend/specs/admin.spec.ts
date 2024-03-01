import { addReward, useAdminPage, useResearcherPage } from './helpers'
import { dayjs, expect, faker, goToPage, setDateField, test } from './test'

test('creates a learning path', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)

    await goToPage({ page: adminPage, path: '/admin/manage-learning-paths' })

    await adminPage.getByLabel('Label').fill(faker.word.adjective() + ' ' + faker.word.noun())
    await adminPage.getByLabel('Description').fill(faker.word.adverb() + ' ' + faker.word.interjection())

    await adminPage.getByText('Create Learning Path').click()
})

test('edits a learning path', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)

    await goToPage({ page: adminPage, path: '/admin/manage-learning-paths' })
    await adminPage.getByPlaceholder('Select a learning path, or create a new one below').click()
    await adminPage.getByRole('option').first().click()

    await adminPage.getByLabel('Label').fill(faker.word.adjective() + ' ' + faker.word.noun())
    await adminPage.getByLabel('Description').fill(faker.word.adverb() + ' ' + faker.word.interjection())
    await adminPage.getByText('Update Learning Path').click()
})

test('displays panel only when allowed', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)

    await goToPage({ page: adminPage, path: '/admin' })
    await adminPage.waitForURL('**/admin/banners')


    await goToPage({ page: researcherPage, path: '/admin' })
    await researcherPage.waitForURL('**/studies')
})


test('can add/update/delete banners', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)

    const message = faker.commerce.productDescription()
    await goToPage({ page: adminPage, path: '/admin/banners' })
    await adminPage.click('testId=add-banner', { force: true })
    await expect(adminPage.locator('[data-banner-id=new]')).toBeVisible()

    await setDateField({
        page: adminPage, fieldName: 'dates', date: [dayjs().add(1, 'day'), dayjs().add(1, 'month')],
    })

    await adminPage.fill('[name="message"]', message)
    await adminPage.click('testId=form-save-btn')

    const banner = adminPage.locator(`[data-banner-id]:not([data-banner-id=new]):has-text("${message}")`)
    const bannerId = await banner.getAttribute('data-banner-id')

    await adminPage.fill(`[data-banner-id="${bannerId}"] >> [name="message"]`, message + ' UPDATED')
    await adminPage.click('testId=form-save-btn')

    await adminPage.waitForSelector(`[data-banner-id="${bannerId}"]:has-text("UPDATED")`)

    await adminPage.click(`[data-banner-id="${bannerId}"] >> testId="delete-banner"`)
    await adminPage.waitForSelector(`[data-banner-id="${bannerId}"]`, { state: 'detached' })
})

test('can add/update/delete rewards', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)

    const prize = faker.commerce.productName()

    await addReward({ page: adminPage, prize, points: 10 })

    const reward = adminPage.locator(`[data-reward-id]:not([data-reward-id=new]):has([value="${prize}"])`)
    const rewardId = await reward.getAttribute('data-reward-id')

    await adminPage.fill(`[data-reward-id="${rewardId}"] >> [name="prize"]`, prize + ' UPDATED')
    await adminPage.click('testId=form-save-btn')

    await adminPage.waitForSelector(`[data-reward-id="${rewardId}"] >> [value="${prize} UPDATED"]`)

    await adminPage.click(`[data-reward-id="${rewardId}"] >> testId="delete-reward"`)
    await adminPage.waitForSelector(`[data-reward-id="${rewardId}"]`, { state: 'detached' })
})
