import { expect, faker, goToPage, test, useAdminPage } from '../test';
import { dayjs } from '../../src/lib/date';

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

    await expect(adminPage.getByPlaceholder('Banner message').first()).toHaveValue('')
    await expect(adminPage.getByPlaceholder('Starts at').first()).toHaveValue('')
    await expect(adminPage.getByPlaceholder('Ends at').first()).toHaveValue('')

    await adminPage.waitForLoadState('networkidle')

    // Updating
    const bannerForm = adminPage.getByTestId(`${message}-form`)
    await bannerForm.getByPlaceholder('Banner message').fill(updatedMessage)
    await bannerForm.getByRole('button', { name: /Update banner/ }).click()
    await adminPage.waitForLoadState('networkidle')

    // Deleting
    await adminPage.getByText('Delete banner').first().click()
    await adminPage.waitForLoadState('networkidle')
})
