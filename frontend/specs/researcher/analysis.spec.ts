import { goToPage, test } from '../test';
import { createAnalysis } from './analysis-helper';

test('completes the analysis tutorial', async ({ page }) => {
    await goToPage({ page, path: `/analysis`, loginAs: 'researcher' })
    // click through tutorial
    await page.click('testId=analysis-tutorial-continue')
    await page.click('testId=analysis-tutorial-continue')
    await page.click('testId=analysis-tutorial-finish')
})

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
