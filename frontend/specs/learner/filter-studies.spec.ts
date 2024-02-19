import { createStudy, expect, goToPage, test, useAdminPage, useResearcherPage, useUserPage } from '../test';
import { completeWelcomeMessage } from '../data-helpers';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ browser }) => {
    const userPage = await useUserPage(browser)
    await completeWelcomeMessage(userPage.context())
})

test('searching studies', async ({ browser }) => {
    const userPage = await useUserPage(browser)
    const researcherPage = await useResearcherPage(browser)
    const adminPage = await useAdminPage(browser)

    const studyToFind = faker.animal.cetacean() + ' ' + faker.animal.rabbit();

    const studyId = await createStudy({ researcherPage, adminPage, name: studyToFind })

    await goToPage({ page: userPage, path: '/studies' })
    await userPage.getByPlaceholder('Search by study title, researcher, or topic name').fill(studyToFind)
    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"]`)
})
