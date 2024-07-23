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
    
    await adminPage.waitForSelector('text=Edit', { state: 'visible' });
    await adminPage.getByText('Edit').first().click()
    await adminPage.waitForLoadState('networkidle');

    await adminPage.waitForSelector('input[placeholder="Prize"]', { state: 'visible' });
    await adminPage.getByPlaceholder('Prize').fill(updatedPrize)
    
    await adminPage.waitForSelector('text=Update reward', { state: 'visible' });
    await adminPage.getByText('Update reward').click()
    await adminPage.waitForLoadState('networkidle');

    // Delete
    await adminPage.waitForSelector('text=Delete', { state: 'visible' });
    await adminPage.getByText('Delete').first().click()
    await adminPage.waitForLoadState('networkidle');
})