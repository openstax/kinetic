import { createStudy, faker, goToPage, test, useAdminPage, useResearcherPage } from '../test';

test('creates a learning path', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)

    await goToPage({ page: adminPage, path: '/admin/manage-learning-paths' })

    await adminPage.getByLabel('Label').fill(faker.word.adjective() + ' ' + faker.word.noun())
    await adminPage.getByLabel('Description').fill(faker.word.adverb() + ' ' + faker.word.interjection())
    await adminPage.getByLabel('Badge ID').fill('SAJSINa7DGDaC4D')

    await adminPage.getByText('Create Learning Path').click()
})

test('edits a learning path', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)

    const name = faker.vehicle.bicycle() + ' ' + faker.vehicle.vin()
    await createStudy({ researcherPage, adminPage, name })

    await goToPage({ page: adminPage, path: '/admin/manage-learning-paths' })
    await adminPage.getByPlaceholder('Select a learning path, or create a new one below').click()
    await adminPage.getByRole('option').first().click()

    await adminPage.getByLabel('Label').fill(faker.word.adjective() + ' ' + faker.word.noun())
    await adminPage.getByLabel('Description').fill(faker.word.adverb() + ' ' + faker.word.interjection())
    await adminPage.getByText('Update Learning Path').click()
})
