import {
    addReward,
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
    const studyName = faker.animal.fish() + ' ' + faker.address.city()

    await addReward({ adminPage })

    await createStudy({ researcherPage, adminPage, name: studyName })

    const userPage = await useUserPage(browser)

    await userPage.getByText('All Studies').isVisible()
    await userPage.getByText(studyName).first().click()

    // await userPage.click('testId=launch-study')

    await userPage.getByText('I consent').click()
    await userPage.getByText('18 or Older').click()
    await userPage.click('#NextButton')
    await userPage.click('#NextButton')
    await userPage.waitForURL('**/study/land/**')

    // Qualtrics redirected to study landing page
    await userPage.getByText('One step closer to earning your badge!').isVisible()
    await userPage.getByAltText('kinetic-logo').click()

    await userPage.getByPlaceholder('Search by study title, researcher, or topic name').fill(studyName)
    await userPage.waitForLoadState('networkidle')

    await userPage.getByText(studyName).first().click()
    await expect(userPage).not.toHaveSelector('testId=launch-study')
})
