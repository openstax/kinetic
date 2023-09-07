import { createStudy, test, useUsersContext } from './test'

test('can create a study', async ({ browser }) => {
    const { adminPage, researcherPage } = await useUsersContext(browser)

    await createStudy({ researcherPage, adminPage })
})
