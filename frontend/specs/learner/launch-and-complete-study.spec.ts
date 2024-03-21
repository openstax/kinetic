import { addReward, createStudy, expect, goToPage, test, useAdminPage, useResearcherPage, useUserPage } from '../test';
import { faker } from '@faker-js/faker';

test('launching study and testing completion', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)
    const studyName = faker.animal.insect() + ' ' + faker.datatype.string(10)

    await addReward({ adminPage })

    const studyId = await createStudy({ researcherPage, adminPage, name: studyName })


    const userPage = await useUserPage(browser)

    await goToPage({ page: userPage, path: '/studies' })
    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)

    await userPage.click('testId=launch-study')

    await userPage.getByText('I consent').click()
    await userPage.getByText('18 or Older').click()
    await userPage.click('#NextButton')
    await userPage.click('#NextButton')

    // Qualtrics redirected to study landing page
    await userPage.getByText('You just earned 10 points').isVisible()
    await userPage.click('testId=view-studies')

    await userPage.reload()
    await userPage.waitForLoadState('networkidle')
    await userPage.getByPlaceholder('Search by study title, researcher, or topic name').fill(studyName)
    await userPage.waitForSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study')
})
