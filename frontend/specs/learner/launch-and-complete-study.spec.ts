import {
    addReward,
    completeQualtricsStudy,
    createStudy,
    expect,
    test,
    useAdminPage,
    useResearcherPage,
    useUserPage,
} from '../test';
import { faker } from '@faker-js/faker';

test('launching study and testing completion', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)
    const firstStudyName = faker.animal.fish() + ' ' + faker.address.city()
    const secondStudyName = faker.animal.fish() + ' ' + faker.address.city()

    await addReward({ adminPage })

    await createStudy({ researcherPage, adminPage, name: firstStudyName })
    await createStudy({ researcherPage, adminPage, name: secondStudyName })

    const userPage = await useUserPage(browser)

    // Complete first study
    await completeQualtricsStudy(userPage, firstStudyName)

    // Qualtrics redirected to study landing page
    await userPage.getByText('One step closer to earning your badge!').isVisible()
    await userPage.getByAltText('kinetic-logo').click()

    await userPage.getByPlaceholder('Search by study title, researcher, or topic name').fill(firstStudyName)
    await userPage.waitForLoadState('networkidle')

    await userPage.getByText(firstStudyName).first().click()
    await expect(userPage).not.toHaveSelector('testId=launch-study')

    await userPage.reload()
    // Complete second study
    await completeQualtricsStudy(userPage, secondStudyName)
    await userPage.getByText('Wow, effort really pays off!').isVisible()

})
