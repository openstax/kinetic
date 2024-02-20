import { addReward, createStudy, expect, goToPage, test, useAdminPage, useResearcherPage, useUserPage } from '../test';

test('launching study and testing completion', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)

    await addReward({ page: adminPage, points: 5, prize: 'Pony' })

    const studyId = await createStudy({ researcherPage, adminPage })

    const userPage = await useUserPage(browser)

    await goToPage({ page: userPage, path: '/studies' })
    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)

    await userPage.click('testId=launch-study')

    await userPage.getByText('I consent').click()
    await userPage.getByText('18 or Older').click()
    await userPage.click('#NextButton')
    await userPage.click('#NextButton')

    // qualtrics will redirect here once complete
    await userPage.getByText('You just earned 10 points').isVisible()
    await userPage.click('testId=view-studies')

    await userPage.waitForURL('**/studies')
    await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
    await userPage.click(`[data-study-id="${studyId}"]`)
    await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
})
