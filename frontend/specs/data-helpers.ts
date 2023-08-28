import { expect, faker, loginAs, Page, TC, test, BrowserContext, logout } from './test'

// https://reflect.run/articles/using-playwright-for-api-testing/ Reference

interface CreateStudyDataProps {
    page: Page,
    context: BrowserContext,
    numStudies: number
}

export const createStudyData = async ({ page, context, numStudies = 1 }: CreateStudyDataProps) => {
    await loginAs({ page, login: 'researcher' })
    for (let i = 0; i < numStudies; i++) {
        const response = await context.request.post(`${TC.API_URL}/researcher/studies`, {
            // TODO Fill out more data with faker
            data: {
                benefits: faker.company.bsBuzz(),
                category: 'Cognitive Task & Assessment',
                topic: 'Learning',
                internal_description: faker.name.jobDescriptor(),
                title_for_researchers: faker.name.jobTitle(),
                title_for_participants: faker.name.jobTitle(),
                status: 'active',
                short_description: faker.commerce.productDescription(),
                long_description: faker.commerce.productDescription(),
            },
        })
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);
        console.log(await response.json())
    }
    await logout({ page })
}
