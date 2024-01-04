// test.beforeEach(async ({ browser }) => {
//     const userPage = await useUserPage(browser)
//     await completeWelcomeMessage(userPage.context())
// })

// TODO Revisit aborting in future ticket, currently not being used
// test('launching study and aborting it', async ({ browser }) => {
//     const adminPage = await useAdminPage(browser)
//     const userPage = await useUserPage(browser)
//     const researcherPage = await useResearcherPage(browser)
//
//     await interceptStudyLaunch(userPage)
//
//     const studyId = await createStudy({ researcherPage, adminPage })
//     await goToPage({ page: userPage, path: `/studies/details/${studyId}` })
//
//     await userPage.click('testId=launch-study')
//     await userPage.waitForLoadState('networkidle')
//
//     await goToPage({ page: userPage, path: `/study/land/${studyId}?abort=true` })
//     await userPage.waitForSelector('testId=aborted-msg')
//     await expect(userPage).toMatchText(/Try again later/)
//
//     await userPage.getByRole('button', { name: /Go back to dashboard/i }).click()
//
//     // Our study is under "Learning"
//     await userPage.click('testId=Learning')
//
//     await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="false"]`)
//     await userPage.click(`[data-study-id="${studyId}"]`)
//
//     // should have navigated
//     await userPage.waitForURL(`**/studies/details/${studyId}`)
//
//     // now mark complete with consent granted
//     await goToPage({ page: userPage, path: `/study/land/${studyId}?consent=true` })
//
//     await userPage.click('testId=view-studies')
//     await userPage.click('testId=Learning')
//     await expect(userPage).toHaveSelector(`[data-study-id="${studyId}"][data-is-completed="true"]`)
//     await userPage.click(`[data-study-id="${studyId}"]`)
//     await expect(userPage).not.toHaveSelector('testId=launch-study', { timeout: 200 })
// })
