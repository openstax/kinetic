import { expect, test } from '@playwright/test';
import { createStudy, useAdminPage, useResearcherPage, useUserPage } from '../helpers';
import { faker } from '@faker-js/faker';

test('can launch active study', async ({ browser }) => {
    const researcherPage = await useResearcherPage(browser)
    const adminPage = await useAdminPage(browser)

    const name = faker.word.interjection() + ' ' + faker.word.noun()
    await createStudy({ researcherPage, adminPage, name })

    const userPage = await useUserPage(browser)
    await userPage.waitForLoadState('networkidle')
    await userPage.getByText(name).click()
    // await userPage.getByRole('button', { name: 'Begin Study' }).click()

    const pagePromise = userPage.context().waitForEvent('page');
    await userPage.getByRole('button', { name: 'Begin Study' }).click()

    await userPage.getByTestId('launch-study').click();
    const qualtricsPage = await pagePromise;
    await qualtricsPage.waitForLoadState();
    await expect(qualtricsPage.getByText('Please read the consent form')).toBeVisible()

    // const launchTabPage = await userPage.waitForEvent('popup')
    // debugger
    // await expect(launchTabPage.getByText('Please read the consent form')).toBeVisible()
})
