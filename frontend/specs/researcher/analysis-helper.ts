import { expect, Page } from '@playwright/test';
import { createStudy, getIdFromUrl, goToPage, loginAs } from '../helpers';
import { faker } from '../test';

interface createAnalysisProps {
    page: Page
    withStudy?: boolean
}

export const createAnalysis = async({ page, withStudy = false }: createAnalysisProps) => {
    await loginAs({ page, login: 'researcher' })
    const studyName = faker.commerce.productName()
    const description = faker.commerce.productName()
    if (withStudy) {
        const studyId = await createStudy({ page, studyName, description })
        await goToPage({ page, path: `/analysis/edit/new?studyId=${studyId}` })
        await expect(page.locator('[name=title]')).toHaveText(studyName)
        await expect(page.locator('[name=description]')).toHaveText(description)
    } else {
        await goToPage({ page, path: `/analysis/edit/new` })
        await expect(page.locator('testId=save-analysis-button')).toBeDisabled()
        await page.fill('[name=title]', studyName)
        await page.fill('[name=description]', description)
        await page.locator('.select-study-checkbox').first().check()
    }

    await expect(page.locator('testId=save-analysis-button')).toBeEnabled()
    await page.click('testId=save-analysis-button')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(200)
    return await getIdFromUrl(page)
}
