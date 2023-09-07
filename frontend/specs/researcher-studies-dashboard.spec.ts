import { goToPage, test, useUsersContext } from './test';

test('can access studies table as a researcher', async({ browser }) => {
    const { researcherPage } = await useUsersContext(browser)
    await goToPage({ page: researcherPage, path: `/studies` })
    await researcherPage.isVisible('testId=studies-table')
})
