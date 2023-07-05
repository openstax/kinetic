import { goToPage, loginAs, test } from '../test';
import { createAnalysis } from './analysis-helper';


test('can create an analysis from a study', async ({ page }) => {
    await createAnalysis({ page, withStudy: true })
})

test('can create an analysis without a study', async ({ page }) => {
    await createAnalysis({ page, withStudy: false })
})

test('can access analyses table as a researcher', async({ page }) => {
    await goToPage({ page, path: `/analysis`, loginAs: 'researcher' })
    await page.isVisible('testId=analyses-table')
})
