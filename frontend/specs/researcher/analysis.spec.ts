import { goToPage, Page, test, useUsersContext } from '../test';
import { createAnalysis } from './analysis-helper';
import { completeAnalysisTutorial } from '../data-helpers';

test.beforeEach(async ({ browser }) => {
    const { researcherContext } = await useUsersContext(browser)
    await completeAnalysisTutorial(researcherContext)
})

test('completes the analysis tutorial', async ({ browser }) => {
    const { researcherPage } = await useUsersContext(browser)
    await goToPage({ page: researcherPage, path: `/analysis` })
    // await completeTutorial(researcherPage)
})

test('can create an analysis from a study', async ({ browser }) => {
    const { researcherPage, researcherContext } = await useUsersContext(browser)
    // await completeTutorial(researcherPage)
    await createAnalysis({ researcherPage, researcherContext, withStudy: true })
})

test('can create an analysis without a study', async ({ browser }) => {
    const { researcherPage, researcherContext } = await useUsersContext(browser)
    // await completeTutorial(researcherPage)
    await createAnalysis({ researcherPage, researcherContext, withStudy: false })
})

test('can access analyses table as a researcher', async({ browser }) => {
    const { researcherPage } = await useUsersContext(browser)
    await goToPage({ page: researcherPage, path: `/analysis` })
    // await completeTutorial(researcherPage)
    await researcherPage.isVisible('testId=analyses-table')
})

const completeTutorial = async (researcherPage: Page) => {
    if (await researcherPage.isVisible('testId=analysis-tutorial-modal')) {
        await researcherPage.click('testId=analysis-tutorial-continue')
        await researcherPage.click('testId=analysis-tutorial-continue')
        await researcherPage.click('testId=analysis-tutorial-finish')
    }
}
