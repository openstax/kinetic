import { faker, goToPage, test } from '../test';


test('can create an analysis', async ({ page }) => {
    const name = faker.commerce.productName()

    await goToPage({ page, path: '/analysis/edit/new', loginAs: 'researcher' })


    // await createStudy({ page, name })
})
