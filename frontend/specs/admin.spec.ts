import { addReward, useAdminPage, useResearcherPage } from './helpers'
import { dayjs, expect, faker, goToPage, test } from './test'

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
    const today = dayjs().format('MMMM D, YYYY')
    const message = faker.random.words(4)
    const updatedMessage = faker.random.words(3)

    await goToPage({ page: adminPage, path: '/admin/banners' })

    // Adding
    await expect(adminPage.getByText('Create banner')).toBeDisabled()
    await adminPage.getByPlaceholder('Banner message').first().fill(message)
    await adminPage.getByPlaceholder('Starts at').first().fill(today)
    await adminPage.getByPlaceholder('Ends at').first().fill(today)
    await expect(adminPage.getByText('Create banner')).toBeEnabled()
    await adminPage.getByText('Create banner').click()
    await adminPage.waitForLoadState('networkidle')

    await expect(adminPage.getByPlaceholder('Banner message').first()).toHaveValue('')
    await expect(adminPage.getByPlaceholder('Starts at').first()).toHaveValue('')
    await expect(adminPage.getByPlaceholder('Ends at').first()).toHaveValue('')

    // Updating
    const bannerForm = adminPage.getByTestId(`${message}-form`)
    await bannerForm.getByPlaceholder('Banner message').fill(updatedMessage)
    await bannerForm.getByText('Update banner').click()
    await adminPage.waitForLoadState('networkidle')

    // Deleting
    await bannerForm.getByText('Delete banner').click()
    await adminPage.waitForLoadState('networkidle')
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
