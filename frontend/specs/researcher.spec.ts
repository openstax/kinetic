import { createStudy, faker, test } from './test'

test('can create and edit a study', async ({ page }) => {
    const name = faker.commerce.productName()
    await createStudy({ page, studyName: name })
})
