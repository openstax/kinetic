import { expect, test } from '@playwright/test';
import { createStudy, useAdminPage, useResearcherPage, useUserPage } from '../helpers';
import { faker } from '@faker-js/faker';

test('can launch active study', async ({ browser }) => {
    const researcherPage = await useResearcherPage(browser)
    const adminPage = await useAdminPage(browser)
    const userPage = await useUserPage(browser)

    const name = faker.word.interjection() + ' ' + faker.word.noun()

    await createStudy({ researcherPage, adminPage, name })

    await userPage.getByText(name).click()
    await userPage.getByRole('button', { name: 'Begin Study' }).click()

    const launchTabPage = await userPage.waitForEvent('popup')
    await expect(launchTabPage.getByText('Please read the consent form')).toBeVisible()
})
