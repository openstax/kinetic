import { expect, Page } from '@playwright/test';
import { createStudy, goToPage } from '../helpers';
import { faker } from '../test';

interface createAnalysisProps {
    researcherPage: Page
    adminPage: Page
    withStudy?: boolean
}

export const createAnalysis = async({ researcherPage, adminPage, withStudy = false }: createAnalysisProps) => {
    const name = faker.commerce.productName()
    const description = faker.commerce.productName()

    if (withStudy) {
        const studyId = await createStudy({ researcherPage, adminPage, name, description })
        await goToPage({ page: researcherPage, path: `/analysis/edit/new?studyId=${studyId}` })
        await expect(researcherPage.locator('[name=title]')).toMatchText(name)
        await expect(researcherPage.locator('[name=description]')).toMatchText(description)
    } else {
        await goToPage({ page: researcherPage, path: `/analysis/edit/new` })
        await expect(researcherPage.locator('testId=save-analysis-button')).toBeDisabled()
        await researcherPage.fill('[name=title]', name)
        await researcherPage.fill('[name=description]', description)
        await researcherPage.locator('.select-study-checkbox').first().check()
    }

    await expect(researcherPage.locator('testId=save-analysis-button')).toBeEnabled()
    await researcherPage.click('testId=save-analysis-button')
    await researcherPage.waitForLoadState('networkidle')
    await researcherPage.waitForTimeout(500)
    await researcherPage.waitForURL('**/analysis/overview/**')
}
