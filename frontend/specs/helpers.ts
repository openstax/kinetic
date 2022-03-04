import { Page } from '@playwright/test'
import * as dayjsImport from 'dayjs'
// not sure why this is needed, but the import doesn't seem to be correct for TS
const dayjs = (dayjsImport as any)['default'] as typeof dayjsImport

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
                throw(e)
            }
        }
    }
    while (true)
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
    await page.click(`[data-user-id="${TC.USERS[login]}"]`)
    await page.waitForSelector('.container.studies')
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
    points?: number
    mins?: number
    subject?: string
    opensAt?: dayjsImport.Dayjs,
}

export const RESEARCH_HOMEPAGE = 'https://openstax.org/research'

export const createStudy = async ({
    page, name,
    isMandatory = false,
    points = 10,
    mins = 10,
    subject = 'physics',
    opensAt = dayjs().subtract(1, 'day'),
}: createStudyArgs) => {
    await goToPage({ page, path: '/study/edit/new', loginAs: 'researcher' })
    await page.fill('[name=titleForParticipants]', name)
    await setFlatpickrDate({ selector: '[data-field-name=opensAt]', page, date: opensAt })
    if (isMandatory) {
        await page.click('input[name=isMandatory]')
    }

    await page.fill('[name=shortDescription]', 'short desc')
    await page.fill('[name=longDescription]', 'long desc')
    await page.fill('[name=durationMinutes]', String(mins))
    await page.fill('[name=participationPoints]', String(points))

    await page.fill('#tags input', 'cog')
    await page.keyboard.press('Enter')

    await page.fill('#tags input', 'cog')
    await page.keyboard.press('Enter')

    await page.fill('#tags input', `subject:${subject}`)
    await page.keyboard.press('Enter')

    await page.click('testId=form-save-btn')

    await page.click('testId=add-stage')
    await page.fill('.modal-content >> input[name=title]', `${name} stage`)
    await page.fill('.modal-content >> input[name=survey_id]', '1Q_RT12345')
    await page.fill('.modal-content >> input[name=secret_key]', '0123466789123456')
    await page.click('.modal-content >> testId=form-save-btn')
    await page.click('testId=form-save-btn')

    await page.waitForLoadState('networkidle')
    const studyId = await getIdFromUrl(page)

    await logout({ page })
    return studyId
}

export const setFlatpickrDate = async (
    { selector, date, page }: { selector:string, date:string | dayjsImport.Dayjs, page:Page},
) => {
    await page.click(`css=${selector} >> css=input`)
    const d = dayjs(date)
    await page.selectOption('css=.flatpickr-calendar.open >> css=.flatpickr-monthDropdown-months', String(d.month()))
    await page.waitForTimeout(100)
    await page.fill('css=.flatpickr-calendar.open >> css=input.cur-year', String(d.year()))
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)
    await page.click(`css=.flatpickr-calendar.open >> css=.dayContainer  >> text="${d.date()}"`)
}
