import { goToPage, test, useAdminPage, useResearcherPage } from '../test';
import { createAnalysis } from './analysis-helper';
import { completeAnalysisTutorial } from '../data-helpers';

test('completes the analysis tutorial', async ({ browser }) => {
    const researcherPage = await useResearcherPage(browser)

    await goToPage({ page: researcherPage, path: `/analysis` })
    if (await researcherPage.isVisible('testId=analysis-tutorial-modal')) {
        await researcherPage.click('testId=analysis-tutorial-continue')
        await researcherPage.click('testId=analysis-tutorial-continue')
        await researcherPage.click('testId=analysis-tutorial-finish')
    }
})

test('can create an analysis from a study', async ({ browser }) => {
    const researcherPage = await useResearcherPage(browser)
    const adminPage = await useAdminPage(browser)

    await completeAnalysisTutorial(researcherPage.context())
    await createAnalysis({ researcherPage, adminPage, withStudy: true })
})

test('can create an analysis without a study', async ({ browser }) => {
    const researcherPage = await useResearcherPage(browser)
    const adminPage = await useAdminPage(browser)

    await completeAnalysisTutorial(researcherPage.context())
    await createAnalysis({ researcherPage, adminPage, withStudy: false })
})

test('can access analyses table as a researcher', async({ browser }) => {
    const researcherPage = await useResearcherPage(browser)

    await goToPage({ page: researcherPage, path: `/analysis` })
    await completeAnalysisTutorial(researcherPage.context())
    await researcherPage.isVisible('testId=analyses-table')
})
