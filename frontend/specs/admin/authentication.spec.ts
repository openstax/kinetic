import { goToPage, test, useAdminPage, useResearcherPage } from '../test';

test('displays panel only when allowed', async ({ browser }) => {
    const adminPage = await useAdminPage(browser)
    const researcherPage = await useResearcherPage(browser)

    await goToPage({ page: adminPage, path: '/admin' })
    await adminPage.waitForURL('**/admin/banners')

    await goToPage({ page: researcherPage, path: '/admin' })
    await researcherPage.waitForURL('**/studies')
})
