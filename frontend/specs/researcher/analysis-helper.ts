import { BrowserContext, expect, Page } from '@playwright/test';
import { getIdFromUrl, goToPage } from '../helpers';
import { faker } from '../test';
import { createStudyData } from '../data-helpers';

interface createAnalysisProps {
    researcherPage: Page
    researcherContext: BrowserContext
    withStudy?: boolean
}

export const createAnalysis = async({ researcherPage, researcherContext, withStudy = false }: createAnalysisProps) => {
    const name = faker.commerce.productName()
    const description = faker.commerce.productName()

    if (withStudy) {
        const studyId = await createStudyData({ context: researcherContext, name, description })
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
    const analysisId = await getIdFromUrl(researcherPage)
    console.log(analysisId)
    await researcherPage.waitForFunction(() => document.location.pathname == `/analysis/overview/${analysisId}`)
}
