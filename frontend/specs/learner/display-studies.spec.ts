import { createStudy, goToPage, test, useAdminPage, useResearcherPage, useUserPage } from '../test';
import { completeWelcomeMessage } from '../data-helpers';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ browser }) => {
    const userPage = await useUserPage(browser)
    await completeWelcomeMessage(userPage.context())
})

test('displays studies', async ({ browser }) => {
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)
    const adminPage = await useAdminPage(browser)
    const name = faker.vehicle.bicycle() + ' ' + faker.vehicle.vin()

    await createStudy({ researcherPage, adminPage, name })

    await goToPage({ page: userPage, path: '/studies' })
    await userPage.waitForSelector('testId=studies-listing')
    await userPage.getByText(name).isVisible()
})
