import { expect, Page } from '@playwright/test'
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
    loginAs?: TestingLogin
}

export const goToPage = async ({ page, path, loginAs: login }: goToPageArgs) => {
    const url = TC.ORIGIN + path
    let attempts = 0
    do {
        try {
            await page.goto(url)
            await page.waitForTimeout(500) // wait for user fetch to complete
            if (await page.$('testId=incorrect-user-panel')) {
                await loginAs({ page, login: login || 'researcher' })
                await page.goto(url)
            }
            return
        } catch (e) {
            console.log(e) // eslint-disable-line no-console
            if (attempts++ >= 3) {
                throw (e)
            }
        }
    } while (true) // eslint-disable-line no-constant-condition
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
    await logout({ page })
    await page.goto('http://localhost:4000/dev/user')
    await page.waitForSelector('.dev-console');
    await page.click(`[data-user-id="${TC.USERS[login]}"]`)
    await page.waitForSelector('.studies')
}

// TODO Can't delete active studies now. We can repurpose this to delete a draft in the future
export const rmStudy = async ({ page, studyId }: { page: Page, studyId: string | number }) => {
    await loginAs({ page, login: 'researcher' })
    await goToPage({ page, path: `/studies` })
    // await page.click(`testId=${studyId}-action-menu`)
    // await page.click(`testId=delete-study`)
}

export const getIdFromUrl = async (page: Page): Promise<number | undefined> => {
    const id = await page.evaluate(() => {
        return window.location.href.match(/(\/\d+)/)[1].replace('/', '')
    })
    if (id) {
        return Number(id)
    }
}

interface createStudyArgs {
    page: Page
    studyName?: string
    approveAndLaunchStudy?: boolean
    multiSession?: boolean
    description?: string
}

export const approveWaitingStudy = async(page: Page, studyId: number) => {
    await goToPage({ page, path: '/admin/approve-studies', loginAs: 'admin' })
    await page.click(`testId=${studyId}-checkbox`)
    await page.click(`testId=${studyId}-approve`)
    await logout({ page })
}

export const launchApprovedStudy = async(page: Page, studyId: number, multiSession: boolean = false) => {
    await goToPage({ page, path: `/study/overview/${studyId}`, loginAs: 'researcher' })
    await expect(page.locator('testId=launch-study-button')).toBeDisabled()

    if (multiSession) {
        await page.getByTestId('confirm-qualtrics-0').check();
        await page.getByTestId('confirm-qualtrics-1').check();
    } else {
        await page.getByTestId('confirm-qualtrics').check();
    }

    await setDateField({ page, fieldName: 'opensAt', date: dayjs() })

    await page.locator('input[name=hasSampleSize]').check()
    await page.fill('[name=targetSampleSize]', '50')

    await expect(page.locator('testId=launch-study-button')).not.toBeDisabled()
    await page.click('testId=launch-study-button')
    await page.waitForLoadState('networkidle')
    await page.click('testId=primary-action')
}

export const createStudy = async ({
    page,
    studyName = null,
    approveAndLaunchStudy = true,
    multiSession = false,
    description = faker.commerce.color(),
}: createStudyArgs) => {
    const name = studyName || faker.commerce.productName()
    // Step 1 - Internal Details
    await loginAs({ page, login: 'researcher' })
    await goToPage({ page, path: '/study/edit/new' })
    await page.fill('[name=titleForResearchers]', name)
    await page.fill('[name=internalDescription]', description)
    await page.click("input[value='Learner Characteristics']")
    await page.waitForTimeout(200)

    await expect(page.locator('testId=study-primary-action')).not.toBeDisabled()
    await page.click('testId=study-primary-action')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(200)

    // Study should reroute to study/edit/:id
    const studyId = await getIdFromUrl(page)

    // Step 2 - Research Team
    await page.locator('.select', { has: page.locator(`input[name=researcherPi]`) }).click()
    await page.waitForTimeout(100)
    await page.keyboard.press('Enter')

    await page.locator('.select', { has: page.locator(`input[name=researcherLead]`) }).click()
    await page.waitForTimeout(100)
    await page.keyboard.press('Enter')

    await expect(page.locator('testId=study-primary-action')).not.toBeDisabled()
    await page.click('testId=study-primary-action')
    await page.waitForLoadState('networkidle')

    // Step 3 - Participant View
    await page.fill('[name=titleForParticipants]', name)
    await page.fill('[name=shortDescription]', faker.commerce.department())
    await page.fill('[name=longDescription]', faker.commerce.department())
    await selectFirstDropdownItem({ page, fieldName: 'topic' })
    await selectFirstDropdownItem({ page, fieldName: 'subject' })
    await page.click("input[value='10']")
    await page.click("input[value='score']")
    await page.click("input[value='debrief']")
    await page.fill('[name=benefits]', faker.finance.accountName())

    await page.click('testId=image-picker')
    await expect(page.locator('testId=image-library-modal')).toBeVisible()
    await page.locator('testId=card-image').first().click()
    await page.click('testId=select-card-image')
    await expect(page.locator('testId=image-library-modal')).not.toBeVisible()

    await expect(page.locator('testId=study-primary-action')).not.toBeDisabled()
    await page.click('testId=study-primary-action')
    await page.waitForLoadState('networkidle')

    // Step 4 - Additional Sessions
    await expect(page.getByTestId('study-step-header')).toContainText('Additional sessions')
    if (multiSession) {
        await page.click('testId=add-session')
        await page.click("input[value='25']")
        await page.click("input[value='personalized']")
    }
    await expect(page.locator('testId=study-primary-action')).not.toBeDisabled()
    await page.click('testId=study-primary-action')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(100)

    // Submit study
    await expect(page.locator('testId=study-primary-action')).toMatchText('Submit Study')
    await expect(page.locator('testId=study-primary-action')).not.toBeDisabled()
    await page.click('testId=study-primary-action')
    await page.waitForTimeout(200)
    await page.click('testId=submit-study-button')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(100)
    await page.click('testId=submit-study-success-button')
    await page.waitForTimeout(100)
    await logout({ page })

    // Test draft statuses before approve and launch when dashboard is finalized
    if (approveAndLaunchStudy) {
        await approveWaitingStudy(page, studyId)
        await launchApprovedStudy(page, studyId, multiSession)
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

export const setDateField = async (
    {
        fieldName, date, page,
    }: {
        fieldName: string, date: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs], page: Page,
    },
) => {
    return await setFlatpickrDate({ page, date, selector: `[data-field-name="${fieldName}"]` })
}


export const addReward = async (
    {
        page, points, prize,
        startAt = dayjs().subtract(1, 'day'),
        endAt = dayjs().add(1, 'day'),
    }: {
        page: Page, points: number, prize: string
        startAt?: dayjs.Dayjs,
        endAt?: dayjs.Dayjs,
    }
) => {
    await goToPage({ page, path: '/admin/rewards', loginAs: 'admin' })
    await page.click('testId=add-reward')
    await page.waitForSelector('[data-reward-id="new"]')
    await setDateField({ page, fieldName: 'dates', date: [startAt, endAt] })
    await page.fill('[name="points"]', String(points))
    await page.fill('[name="prize"]', prize)
    await page.click('testId=form-save-btn')
    await logout({ page })
}
