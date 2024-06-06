import { addReward, faker, goToPage, test, useAdminPage } from '../test';

test('can add/update/delete rewards', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const prize = faker.random.words(3)
    const description = faker.random.words(6)
    const points = faker.random.numeric(2)

    await goToPage({ page: adminPage, path: '/admin/rewards' })

    await addReward({ adminPage, prize, points, description })

    // Update
    const updatedPrize = faker.random.words(2)
    await adminPage.getByText('Edit').first().click()
    await adminPage.getByPlaceholder('Prize').fill(updatedPrize)
    await adminPage.getByText('Update reward').click()

    // Delete
    await adminPage.getByText('Delete').first().click()
})
