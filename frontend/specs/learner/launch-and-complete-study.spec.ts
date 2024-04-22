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

// TODO: Rewrite with new landing page
test('launching study and testing completion', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)
    const firstStudyName = faker.animal.fish() + ' ' + faker.datatype.string(10)
    const secondStudyName = faker.animal.fish() + ' ' + faker.datatype.string(10)

    await addReward({ adminPage })

    const firstStudyId = await createStudy({ researcherPage, adminPage, name: firstStudyName })
    const secondStudyId = await createStudy({ researcherPage, adminPage, name: secondStudyName })

    const userPage = await useUserPage(browser)

    // Complete first study
    await completeQualtricsStudy(userPage, firstStudyId)

    // Qualtrics redirected to study landing page
    await userPage.getByText('One step closer to earning your badge!').isVisible()
    await userPage.getByAltText('kinetic-logo').click()

    await userPage.getByPlaceholder('Search by study title, researcher, or topic name').fill(firstStudyName)
    await userPage.waitForLoadState('networkidle')

    await userPage.waitForSelector(`[data-study-id="${firstStudyId}"]`)
    await userPage.click(`[data-study-id="${firstStudyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study')

    await completeQualtricsStudy(userPage, secondStudyId)
    await userPage.getByText('Wow, effort really pays off!').isVisible()

})
