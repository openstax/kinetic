import { goToPage, test, useUsersContext } from '../test';
import { createAnalysis } from './analysis-helper';

test('completes the analysis tutorial', async ({ browser }) => {
    const { researcherPage } = await useUsersContext(browser)
    await goToPage({ page: researcherPage, path: `/analysis` })
    // click through tutorial
    if (await researcherPage.isVisible('testId=analysis-tutorial-modal')) {
        await researcherPage.click('testId=analysis-tutorial-continue')
        await researcherPage.click('testId=analysis-tutorial-continue')
        await researcherPage.click('testId=analysis-tutorial-finish')
    }
})

test('can create an analysis from a study', async ({ browser }) => {
    const { researcherPage, researcherContext } = await useUsersContext(browser)
    await createAnalysis({ researcherPage, researcherContext, withStudy: true })
})

test('can create an analysis without a study', async ({ browser }) => {
    const { researcherPage, researcherContext } = await useUsersContext(browser)
    await createAnalysis({ researcherPage, researcherContext, withStudy: false })
})

test('can access analyses table as a researcher', async({ browser }) => {
    const { researcherPage } = await useUsersContext(browser)

    await goToPage({ page: researcherPage, path: `/analysis` })
    await researcherPage.isVisible('testId=analyses-table')
})
