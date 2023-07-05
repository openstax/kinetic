import { expect, Page } from '@playwright/test';
import { createStudy, getIdFromUrl, goToPage } from '../helpers';
import { faker } from '../test';

interface createAnalysisProps {
    page: Page
    withStudy?: boolean
}

export const createAnalysis = async({ page, withStudy = false }: createAnalysisProps) => {
    const name = faker.commerce.productName()
    const description = faker.commerce.productName()
    const studyId = await createStudy({ page, name: name, description, approveAndLaunchStudy: true })
    if (withStudy) {
        await goToPage({ page, path: `/analysis/edit/new?studyId=${studyId}`, loginAs: 'researcher' })
        await expect(page.locator('[name=title]')).toHaveText(name)
        await expect(page.locator('[name=description]')).toHaveText(description)
    } else {
        await goToPage({ page, path: `/analysis/edit/new`, loginAs: 'researcher' })
        await expect(page.locator('testId=save-analysis-button')).toBeDisabled()
        await page.fill('[name=title]', name)
        await page.fill('[name=description]', description)
        await page.locator('.select-study-checkbox').first().check()
    }

    await expect(page.locator('testId=save-analysis-button')).toBeEnabled()
    await page.click('testId=save-analysis-button')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(200)
    return await getIdFromUrl(page)
}
