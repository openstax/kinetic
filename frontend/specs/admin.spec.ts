import { addReward } from './helpers'
import {
    test, goToPage, setDateField, dayjs, faker, logout,
} from './test'

test('displays panel only when allowed', async ({ page }) => {
    await goToPage({ page, path: '/admin', loginAs: 'admin' })
    await page.waitForFunction(() => document.location.pathname == '/admin/banners/')

    await logout({ page })
    await goToPage({ page, path: '/admin', loginAs: 'researcher' })
    await page.waitForFunction(() => document.location.pathname === '/studies')
})


test('can add/update/delete banners', async ({ page }) => {
    const message = faker.commerce.productDescription()
    await goToPage({ page, path: '/admin/banners/', loginAs: 'admin' })
    await page.waitForSelector('data-testid=add-banner')
    await page.waitForTimeout(200)
    await page.click('data-testid=add-banner')
    await page.waitForSelector('[data-banner-id="new"]')
    await page.waitForTimeout(100)

    await setDateField({
        page, fieldName: 'dates', date: [dayjs().add(1, 'day'), dayjs().add(1, 'month')],
    })

    await page.fill('[name="message"]', message)
    await page.click('testId=form-save-btn')

    const banner = page.locator(`[data-banner-id]:not([data-banner-id="new"]):has-text("${message}")`)
    await banner.waitFor()
    const bannerId = await banner.getAttribute('data-banner-id')

    await page.fill(`[data-banner-id="${bannerId}"] >> [name="message"]`, message + ' UPDATED')
    await page.click('testId=form-save-btn')

    await page.waitForSelector(`[data-banner-id="${bannerId}"]:has-text("UPDATED")`)

    await page.click(`[data-banner-id="${bannerId}"] >> testId="delete-banner"`)
    await page.waitForSelector(`[data-banner-id="${bannerId}"]`, { state: 'detached' })
})

test('can add/update/delete rewards', async ({ page }) => {
    const prize = faker.commerce.productName()

    await addReward({ page, prize, points: 10 })
    await goToPage({ page, path: '/admin/rewards', loginAs: 'admin' })

    const reward = page.locator(`[data-reward-id]:not([data-reward-id="new"]):has([value="${prize}"])`)
    await reward.waitFor()
    const rewardId = await reward.getAttribute('data-reward-id')

    await page.fill(`[data-reward-id="${rewardId}"] >> [name="prize"]`, prize + ' UPDATED')
    await page.click('testId=form-save-btn')

    await page.waitForSelector(`[data-reward-id="${rewardId}"] >> [value="${prize} UPDATED"]`)

    await page.click(`[data-reward-id="${rewardId}"] >> testId="delete-reward"`)
    await page.waitForSelector(`[data-reward-id="${rewardId}"]`, { state: 'detached' })
})
