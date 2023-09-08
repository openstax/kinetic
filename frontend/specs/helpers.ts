import { Browser, BrowserContext, expect, Page } from '@playwright/test'
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
    // let attempts = 0
    // do {
    //     try {
    //         await page.goto(url)
    //         return
    //     } catch (e) {
    //         console.log(e) // eslint-disable-line no-console
    //         if (attempts++ >= 3) {
    //             throw (e)
    //         }
    //     }
    // } while (true) // eslint-disable-line no-constant-condition
}

export const interceptStudyLaunch = async ({ page }: { page: Page }) => {
    await page.route(/studies\/\d+\/launch/, async route => {
        const response = await page.request.fetch(route.request())
        const body = await response.json()
        body.url = '/'
        return route.fulfill({ response, body: JSON.stringify(body) });
    });
}

export const interceptStudyLand = async ({ page }: { page: Page }) => {
    await page.route(/study\/land\/d+/, async route => {
        return route.fulfill({ status: 200, body: '{}' })
    });
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
    await page.waitForSelector('.studies')
}

// TODO Can't delete active studies now. We can repurpose this to delete a draft in the future
export const rmStudy = async ({ page, studyId }: { page: Page, studyId: string | number }) => {
    await goToPage({ page, path: `/studies` })
    // await page.click(`testId=${studyId}-action-menu`)
    // await page.click(`testId=delete-study`)
}

export const getIdFromUrl = async (page: Page): Promise<number | undefined> => {
    const id = page.url().match(/(\/\d+)/)[1].replace('/', '')
    // const id = await page.evaluate(() => {
    //     return window.location.href.match(/(\/\d+)/)[1].replace('/', '')
    // })
    if (id) {
        return Number(id)
    }
}

interface createStudyArgs {
    studyName?: string
    approveAndLaunchStudy?: boolean
    multiSession?: boolean
    description?: string
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

    await setDateField({ page: researcherPage, fieldName: 'opensAt', date: dayjs().add(1, 'hour') })

    await researcherPage.locator('input[name=hasSampleSize]').check()
    await researcherPage.fill('[name=targetSampleSize]', '50')
    await researcherPage.locator('[name=targetSampleSize]').blur()

    await expect(researcherPage.locator('testId=launch-study-button')).toBeEnabled()
    await researcherPage.click('testId=launch-study-button')
    await researcherPage.waitForLoadState('networkidle')
    await researcherPage.click('testId=primary-action')
}

export const createStudy = async ({
    approveAndLaunchStudy = true,
    multiSession = false,
    description = faker.commerce.color(),
    adminPage,
    researcherPage,
}: createStudyArgs) => {
    const name = faker.commerce.productName() + ' ' + faker.hacker.abbreviation()
    // Step 1 - Internal Details
    await goToPage({ page: researcherPage, path: '/study/edit/new' })

    await researcherPage.fill('[name=titleForResearchers]', name)
    await researcherPage.fill('[name=internalDescription]', description)
    await researcherPage.click("input[value='Learner Characteristics']")
    await researcherPage.waitForTimeout(100)

    await expect(researcherPage.locator('testId=study-primary-action')).toBeEnabled()
    await researcherPage.click('testId=study-primary-action')

    // Step 2 - Research Team
    await researcherPage.waitForLoadState('networkidle')

    await researcherPage.locator('.select', { has: researcherPage.locator(`input[name=researcherPi]`) }).click()
    await researcherPage.waitForTimeout(100)
    await researcherPage.keyboard.press('Enter')

    await researcherPage.locator('.select', { has: researcherPage.locator(`input[name=researcherLead]`) }).click()
    await researcherPage.waitForTimeout(100)
    await researcherPage.keyboard.press('Enter')

    await expect(researcherPage.locator('testId=study-primary-action')).toBeEnabled()
    await researcherPage.click('testId=study-primary-action')
    await researcherPage.waitForLoadState('networkidle')

    // Step 3 - Participant View
    await researcherPage.fill('[name=titleForParticipants]', name)
    await researcherPage.fill('[name=shortDescription]', faker.commerce.department())
    await researcherPage.fill('[name=longDescription]', faker.commerce.department())
    await selectFirstDropdownItem({ page: researcherPage, fieldName: 'topic' })
    await selectFirstDropdownItem({ page: researcherPage, fieldName: 'subject' })
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
    await researcherPage.waitForTimeout(100)

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
    await researcherPage.waitForTimeout(100)

    // Study should have rerouted to study/edit/:id
    const studyId = await getIdFromUrl(researcherPage)

    // Submit study
    await expect(researcherPage.locator('testId=study-primary-action')).toMatchText('Submit Study')
    await expect(researcherPage.locator('testId=study-primary-action')).toBeEnabled()
    await researcherPage.click('testId=study-primary-action')
    await researcherPage.waitForTimeout(200)
    await researcherPage.click('testId=submit-study-button')
    await researcherPage.waitForLoadState('networkidle')
    await researcherPage.waitForTimeout(100)
    await researcherPage.click('testId=submit-study-success-button')
    await researcherPage.waitForTimeout(100)


    // Test draft statuses before approve and launch when dashboard is finalized
    if (approveAndLaunchStudy) {
        await approveWaitingStudy(adminPage, studyId)
        await launchApprovedStudy(researcherPage, studyId, multiSession)
    }

    return studyId
}

export const selectFirstDropdownItem = async (
    { fieldName, page }: { fieldName: string, page: Page }
) => {
    await page.locator('.select', { has: page.locator(`input[name=${fieldName}]`) }).click()

    await page.keyboard.press('Enter')
}

export const setFlatpickrDate = async (
    { selector, date, page }: { selector: string, date: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs], page: Page },
) => {
    const dates = (Array.isArray(date) ? date : [date]).map(date => date.format('M/D/YYYY'))
    const inputSelector = `css=${selector} >> css=input`
    await page.waitForSelector(inputSelector)
    await page.$eval(inputSelector, (el, dates) => {
        (el as any)._flatpickr.setDate(dates, true, 'm/d/Y')
        return true
    }, dates)
}

export const setDateField = async ({
    fieldName, date, page,
}: {
    fieldName: string, date: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs], page: Page,
}) => {
    return await setFlatpickrDate({ page, date, selector: `[data-field-name="${fieldName}"]` })
}


export const addReward = async ({
    page, points, prize,
    startAt = dayjs().subtract(1, 'day'),
    endAt = dayjs().add(1, 'day'),
}: {
    page: Page, points: number, prize: string
    startAt?: dayjs.Dayjs,
    endAt?: dayjs.Dayjs,
}) => {
    await goToPage({ page, path: '/admin/rewards' })
    await page.click('testId=add-reward')
    await page.waitForSelector('[data-reward-id="new"]')
    await setDateField({ page, fieldName: 'dates', date: [startAt, endAt] })
    await page.fill('[name="points"]', String(points))
    await page.fill('[name="prize"]', prize)
    await page.click('testId=form-save-btn')
}

export const removeOsanoFooter  = async (page:Page) => {
    await page.evaluate(async () => {
        document.querySelector('.osano-cm-dialog')?.remove()
    });
    await page.waitForSelector('.osano-cm-dialog', { state: 'detached' })
}

// Useful for multi-context tests
// https://playwright.dev/docs/browser-contexts#multiple-contexts-in-a-single-test
export const useUsersContext = async (browser: Browser) => {
    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    await loginAs({ page: adminPage, login: 'admin' })

    const researcherContext = await browser.newContext()
    const researcherPage = await researcherContext.newPage()
    await loginAs({ page: researcherPage, login: 'researcher' })

    const userContext = await browser.newContext()
    const userPage = await userContext.newPage()
    await loginAs({ page: userPage, login: 'user' })

    return { adminPage, researcherPage, userPage, researcherContext, userContext, adminContext }
}
