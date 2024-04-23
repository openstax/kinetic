import { faker, goToPage, test, useAdminPage } from '../test';

export const testingLearningPath = faker.internet.httpMethod() + ' ' + faker.internet.color() + ' ' + faker.internet.domainSuffix()

test('creates a learning path', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)

    await goToPage({ page: adminPage, path: '/admin/manage-learning-paths' })

    await adminPage.getByLabel('Label').fill(testingLearningPath)
    await adminPage.getByLabel('Description').fill(faker.word.adverb() + ' ' + faker.word.interjection())
    await adminPage.getByLabel('Badge ID').fill('SAJSINa7DGDaC4D')

    await adminPage.getByText('Create Learning Path').click()
})

test('edits a learning path', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)

    await goToPage({ page: adminPage, path: '/admin/manage-learning-paths' })
    await adminPage.getByPlaceholder('Select a learning path, or create a new one below').click()
    await adminPage.getByText(testingLearningPath).click()

    await adminPage.getByLabel('Description').fill(faker.word.adverb() + ' ' + faker.word.interjection())
    await adminPage.getByText('Update Learning Path').click()
})
