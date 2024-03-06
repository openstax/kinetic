import { Browser, expect, Page } from '@playwright/test'
import { dayjs } from '../src/lib/date'
import { faker } from './test';

export { dayjs }

const hostPort = process.env.SERVER_PORT || 4000

export const TC = {
    ORIGIN: process.env.ORIGIN || `http://localhost:${hostPort}`,
    USERS: {
        admin: '00000000-0000-0000-0000-000000000000',
        researcher: '00000000-0000-0000-0000-000000000001',
        user: '00000000-0000-0000-0000-000000000002',
    },
    API_URL: `${process.env.ORIGIN || 'http://localhost:4006'}/api/v1`,
}

type TestingLogin = keyof typeof TC.USERS

type TestConfig = typeof TC

export type { TestConfig }

interface goToPageArgs {
    page: Page
    path: string
}

export const goToPage = async ({ page, path }: goToPageArgs) => {
    const url = TC.ORIGIN + path
    await page.goto(url)
}

export const logout = async ({ page }: { page: Page }) => {
    await page.goto(TC.ORIGIN)
    await page.waitForFunction(() => (window as any)._TEST_METHODS)
    await page.evaluate(() => {
        return (window as any)._TEST_METHODS?.logout() || Promise.resolve()
    })
    await page.goto(TC.ORIGIN)
    await page.waitForSelector('testId=login-link')
}

export const loginAs = async ({ page, login }: { page: Page, login: TestingLogin }) => {
    await page.goto('http://localhost:4000/dev/user')
    await page.waitForSelector('.dev-console');
    await page.click(`[data-user-id="${TC.USERS[login]}"]`)
    await removeOsanoFooter(page)
    return await page.waitForSelector('.studies')
}

// TODO Can't delete active studies now. We can repurpose this to delete a draft in the future
export const rmStudy = async ({ page, studyId }: { page: Page, studyId: string | number }) => {
    await goToPage({ page, path: `/studies` })
    // await page.click(`testId=${studyId}-action-menu`)
    // await page.click(`testId=delete-study`)
}

export const getIdFromUrl = (page: Page): number | undefined => {
    const id = page.url().match(/(\/\d+)/)[1].replace('/', '')

    if (id) {
        return Number(id)
    }
}

interface createStudyArgs {
    studyName?: string
    multiSession?: boolean
    description?: string
    name?: string
    adminPage: Page
    researcherPage: Page
}

export const approveWaitingStudy = async(adminPage: Page, studyId: number) => {
    await goToPage({ page: adminPage, path: '/admin/approve-studies' })
    await adminPage.click(`testId=${studyId}-checkbox`)
    await adminPage.click(`testId=${studyId}-approve`)
}

export const launchApprovedStudy = async(researcherPage: Page, studyId: number, multiSession: boolean = false) => {
    await goToPage({ page: researcherPage, path: `/study/overview/${studyId}` })

    if (multiSession) {
        await researcherPage.getByTestId('confirm-qualtrics-0').check();
        await researcherPage.getByTestId('confirm-qualtrics-1').check();
    } else {
        await researcherPage.getByTestId('confirm-qualtrics').check();
    }

    await researcherPage.getByPlaceholder('Select a date').click()
    await researcherPage.locator('.open >> .today').click()
    await researcherPage.locator('.open >> .today').blur()
    await researcherPage.fill('.flatpickr-hour', '12')

    await expect(researcherPage.locator('testId=launch-study-button')).toBeEnabled()
    await researcherPage.click('testId=launch-study-button')
    await researcherPage.waitForLoadState('networkidle')
    await researcherPage.click('testId=launched-return-to-dashboard')
}

export const createStudy = async ({
    multiSession = false,
    name = faker.word.adjective() + ' ' + faker.animal.fish(),
    description = faker.commerce.color(),
    adminPage,
    researcherPage,
}: createStudyArgs) => {
    // Step 1 - Internal Details
    await goToPage({ page: researcherPage, path: '/study/edit/new' })

    await researcherPage.fill('[name=titleForResearchers]', name)
    await researcherPage.fill('[name=internalDescription]', description)
    await researcherPage.click("input[value='Learner Characteristics']")

    await expect(researcherPage.locator('testId=study-primary-action')).toBeEnabled()
    await researcherPage.click('testId=study-primary-action')

    // Step 2 - Research Team
    await researcherPage.waitForLoadState('networkidle')

    await researcherPage.locator('.select', { has: researcherPage.locator(`input[name=researcherPi]`) }).click()
    await researcherPage.keyboard.press('Enter')

    await researcherPage.locator('.select', { has: researcherPage.locator(`input[name=researcherLead]`) }).click()
    await researcherPage.keyboard.press('Enter')

    await expect(researcherPage.locator('testId=study-primary-action')).toBeEnabled()
    await researcherPage.click('testId=study-primary-action')
    await researcherPage.waitForLoadState('networkidle')

    // Step 3 - Participant View
    await researcherPage.fill('[name=titleForParticipants]', name)
    await researcherPage.fill('[name=shortDescription]', faker.commerce.department())
    await researcherPage.fill('[name=longDescription]', faker.commerce.department())
    await researcherPage.fill('[name=longDescription]', faker.commerce.department())
    await researcherPage.getByTestId('learning-path').first().check();

    await selectDropdownOption({ page: researcherPage, fieldName: 'subject', option: 'Business Ethics' })
    await researcherPage.click("input[value='10']")
    await researcherPage.click("input[value='score']")
    await researcherPage.click("input[value='debrief']")
    await researcherPage.fill('[name=benefits]', faker.finance.accountName())

    await researcherPage.click('testId=image-picker')
    await expect(researcherPage.locator('testId=image-library-modal')).toBeVisible()
    await researcherPage.locator('testId=card-image').first().click()
    await researcherPage.click('testId=select-card-image')
    await expect(researcherPage.locator('testId=image-library-modal')).toBeHidden()
    await expect(researcherPage.locator('testId=study-primary-action')).toBeEnabled()

    await researcherPage.click('testId=study-primary-action')
    await researcherPage.waitForLoadState('networkidle')

    // Step 4 - Additional Sessions
    await expect(researcherPage.getByTestId('study-step-header')).toContainText('Additional sessions')
    if (multiSession) {
        await researcherPage.click('testId=add-session')
        await researcherPage.click("input[value='25']")
        await researcherPage.click("input[value='personalized']")
    }
    await expect(researcherPage.locator('testId=study-primary-action')).toBeEnabled()
    await researcherPage.click('testId=study-primary-action')
    await researcherPage.waitForLoadState('networkidle')

    // Study should have rerouted to study/edit/:id
    const studyId = getIdFromUrl(researcherPage)

    // Submit study
    await expect(researcherPage.locator('testId=study-primary-action')).toMatchText('Submit Study')
    await expect(researcherPage.locator('testId=study-primary-action')).toBeEnabled()
    await researcherPage.click('testId=study-primary-action')
    await researcherPage.click('testId=submit-study-button')
    await researcherPage.waitForLoadState('networkidle')
    await researcherPage.click('testId=submit-study-success-button')

    // Test draft statuses before approve and launch when dashboard is finalized
    await approveWaitingStudy(adminPage, studyId)
    await launchApprovedStudy(researcherPage, studyId, multiSession)

    return studyId
}

export const selectDropdownOption = async ({
    fieldName, page, option,
}: {
    fieldName: string, page: Page, option: string
}) => {
    await page.locator('.select', { has: page.locator(`input[name=${fieldName}]`) }).click()
    await page.locator('.select', { has: page.locator(`input[name=${fieldName}]`) }).getByText(option).click()
    await page.keyboard.press('Enter')
}

export const addReward = async ({
    adminPage,
    points = faker.random.numeric(2),
    prize = faker.random.words(3),
    description = faker.random.words(6),
    startAt = dayjs().subtract(1, 'day').format('MMMM D, YYYY'),
    endAt = dayjs().add(1, 'day').format('MMMM D, YYYY'),
}: {
    adminPage: Page,
    points?: string,
    prize?: string
    description?: string,
    startAt?: dayjs.Dayjs,
    endAt?: dayjs.Dayjs,
}) => {
    await goToPage({ page: adminPage, path: '/admin/rewards' })

    await adminPage.getByPlaceholder('Prize').fill(prize)
    await adminPage.getByPlaceholder('Points').fill(points)
    await adminPage.getByPlaceholder('Description').fill(description)
    await adminPage.getByPlaceholder('Starts at').first().fill(startAt)
    await adminPage.getByPlaceholder('Ends at').first().fill(endAt)
    await adminPage.getByText('Create reward').click()
}

export const removeOsanoFooter  = async (page:Page) => {
    // For some reason, the osano footer is different when running in CI environment?
    if (await page.getByRole('button', { name: /Accept/i }).isVisible({ timeout: 500 })) {
        await page.getByRole('button', { name: /Accept/i }).click();
    }

    await page.evaluate(async () => {
        document.querySelector('.osano-cm-dialog')?.remove()
    });
    await page.waitForSelector('.osano-cm-dialog', { state: 'detached' })
}

// Helper methods for multi-context tests
// https://playwright.dev/docs/browser-contexts#multiple-contexts-in-a-single-test
export const useAdminPage = async (browser: Browser) => {
    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    await loginAs({ page: adminPage, login: 'admin' })
    await removeOsanoFooter(adminPage)
    return adminPage
}

export const useResearcherPage = async (browser: Browser) => {
    const researcherContext = await browser.newContext()
    const researcherPage = await researcherContext.newPage()
    await loginAs({ page: researcherPage, login: 'researcher' })
    await removeOsanoFooter(researcherPage)
    return researcherPage
}

export const useUserPage = async (browser: Browser) => {
    const userContext = await browser.newContext()
    const userPage = await userContext.newPage()
    await loginAs({ page: userPage, login: 'user' })
    await removeOsanoFooter(userPage)
    return userPage
}
