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
        route.fulfill({ response, body: JSON.stringify(body) });
    });
}

export const interceptStudyLand = async ({ page }: { page: Page }) => {
    await page.route(/study\/land\/d+/, async route => {
        route.fulfill({ status: 200, body: '{}' })
    });
}

export const logout = async ({ page }: { page: Page }) => {
    await page.goto(TC.ORIGIN)
    await page.waitForFunction(() => (window as any)._MODELS)
    await page.evaluate(() => {
        return (window as any)._MODELS?.user?.logout() || Promise.resolve()
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

export const rmStudy = async ({ page, studyId }: { page: Page, studyId: string | number }) => {
    await loginAs({ page, login: 'researcher' })
    await goToPage({ page, path: `/study/edit/${studyId}` })
    if (await page.$('testId=delete-study-btn')) {
        await page.click('testId=delete-study-btn')
    } else {
        await setFlatpickrDate({ selector: '[data-field-name=closesAt]', page, date: dayjs().subtract(1, 'day') })
        await page.click('testId=form-save-btn')
    }
}

export const getIdFromUrl = async (page: Page): Promise<number | undefined> => {
    const id = await page.evaluate(() => {
        return window.location.href.match(/\/(\d+)$/)[1]
    })
    if (id) {
        return Number(id)
    }
}

interface createStudyArgs {
    page: Page
    name: string
    isMandatory?: boolean
    topic?: string
    subject?: string
    opensAt?: dayjs.Dayjs,
}

export const createStudy = async ({
    page, name,
}: createStudyArgs) => {
    // Step 1 - Internal Details
    await goToPage({ page, path: '/study/edit/new', loginAs: 'researcher' })
    await page.fill('[name=titleForResearchers]', name)
    await page.fill('[name=internalDescription]', faker.commerce.color())

    await selectFirstDropdownItem({ page, fieldName: 'studyType' })

    await expect(page.locator('testId=primary-action')).not.toBeDisabled()
    await page.click('testId=primary-action')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(200)

    // Step 2 - Research Team
    await page.locator('.select', { has: page.locator(`input[name=researcherPi]`) }).click()
    await page.waitForTimeout(100)
    await page.keyboard.press('Enter')

    await page.locator('.select', { has: page.locator(`input[name=researcherLead]`) }).click()
    await page.waitForTimeout(100)
    await page.keyboard.press('Enter')

    await expect(page.locator('testId=primary-action')).not.toBeDisabled()
    await page.click('testId=primary-action')
    await page.waitForLoadState('networkidle')

    // Step 3 - Participant View
    await page.fill('[name=titleForParticipants]', name)
    await page.fill('[name=shortDescription]', faker.commerce.department())
    await page.fill('[name=longDescription]', faker.commerce.department())
    await selectFirstDropdownItem({ page, fieldName: 'studyTopic' })
    await selectFirstDropdownItem({ page, fieldName: 'studySubject' })
    await page.click("input[value='10']")
    await page.click("input[value='score']")
    await page.click("input[value='debrief']")
    await page.fill('[name=benefits]', faker.finance.accountName())

    await page.click('testId=image-picker')
    await expect(page.locator('testId=image-library-modal')).toBeVisible()
    await page.locator('testId=card-image').first().click()
    await page.click('testId=select-card-image')
    await expect(page.locator('testId=image-library-modal')).not.toBeVisible()

    await expect(page.locator('testId=primary-action')).not.toBeDisabled()
    await page.click('testId=primary-action')
    await page.waitForLoadState('networkidle')

    // Step 4 - Additional Sessions
    await page.click('testId=add-session')
    await page.click("input[value='25']")
    await page.click("input[value='personalized']")

    await expect(page.locator('testId=primary-action')).not.toBeDisabled()
    await page.click('testId=primary-action')
    await page.waitForLoadState('networkidle')

    // Submit study
    await expect(page.locator('testId=primary-action')).not.toBeDisabled()
    await page.click('testId=primary-action')
    await expect(page.locator('.modal-content')).toBeVisible()
    await page.click('.modal-content >> testId=primary-action')

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await logout({ page })
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
