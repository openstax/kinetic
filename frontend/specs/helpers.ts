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

type TestConfig = typeof TC

export type { TestConfig }

interface goToPageArgs {
    page: Page
    path: string
    loginAs?: keyof typeof TC.USERS
}
export const goToPage = async ({ page, path, loginAs }: goToPageArgs) => {
    const url = TC.ORIGIN + path
    const user = TC.USERS[loginAs || 'researcher']
    await page.goto(url)
    await page.waitForTimeout(100)

    if (await page.$('testId=incorrect-user-panel')) {
        await page.click('testId=login-link')
        await page.click(`a[data-user-id="${user}"]`)
        await page.goto(url)
    }
}

export const logout = async ({ page }: { page: Page }) => {
    await page.goto(TC.ORIGIN)
    await page.waitForFunction(() => (window as any)._MODELS)
    await page.evaluate(() => {
        return (window as any)._MODELS?.user?.logout() || Promise.resolve()
    })
    await page.goto(TC.ORIGIN)
    await page.waitForSelector('testId=login-link')
    // await page.waitForTimeout(500)



    // await page.waitForTimeout(500)

    // const s = await page.$()
    // if (!s) {
    //     console.log(s)
    //     await page.pause()
    // }
}

export const loginAs = async ({ page, login }: { page: Page, login: keyof typeof TC.USERS }) => {
    await logout({ page })
    await page.goto('http://localhost:4000/')
    await page.click('testId=login-link')
    await page.click(`[data-user-id="${TC.USERS[login]}"]`)
}

interface createStudyArgs {
    page: Page
    name: string
    isMandatory?: boolean
    opensAt: dayjsImport.Dayjs,
}

export const closeStudy = async ({ page, studyId }: { page: Page, studyId: string | number }) => {
    loginAs({ page, login: 'researcher' })
    await goToPage({ page, path: `/studies/${studyId}` })
    await setFlatpickrDate({ selector: '[data-field-name=closesAt]', page, date: dayjs().subtract(1, 'day') })
    await page.click('testId=form-save-btn')
}

export const createStudy = async ({
    page, name, opensAt, isMandatory,
}: createStudyArgs) => {
//    await logout({ page })

    await goToPage({ page, path: '/studies/new', loginAs: 'researcher' })
    await page.fill('[name=titleForParticipants]', name)
    await setFlatpickrDate({ selector: '[data-field-name=opensAt]', page, date: opensAt })
    if (isMandatory) {
        await page.click('input[name=isMandatory]')
    }

    await page.fill('[name=shortDescription]', 'short desc')
    await page.fill('[name=longDescription]', 'long desc')
    await page.fill('[name=durationMinutes]', '42')
    await page.click('testId=form-save-btn')

    await page.click('testId=add-stage')
    await page.fill('.modal-content >> input[name=url]', 'https://openstax.org/research')
    await page.fill('.modal-content >> input[name=secret_key]', '0123466789123456')
    await page.click('.modal-content >> testId=form-save-btn')
    await page.click('testId=form-save-btn')

    await page.waitForLoadState('networkidle')
    const studyId = await page.evaluate(() => {
        return window.location.href.match(/studies\/(\d+)$/)[1]
    })

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
