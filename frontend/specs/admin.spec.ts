import {
    interceptStudyLaunch, test, goToPage,
    setDateField,
    createStudy, expect, dayjs, faker, rmStudy,
} from './test'

test('displays panel', async ({ page }) => {
    await goToPage({ page, path: '/admin', loginAs: 'admin' })
    await page.waitForFunction(() => document.location.pathname.match(/admin\/banners/))
})


test('can add/update/delete banners', async ({ page }) => {
    const message = faker.commerce.productDescription()
    await goToPage({ page, path: '/admin/banners/', loginAs: 'admin' })
    await page.click('testId=add-banner')
    await page.waitForSelector('[data-banner-id="new"]')
    await setDateField({ page, fieldName: 'startAt', date: dayjs().add(1, 'day') })
    await setDateField({ page, fieldName: 'endAt', date: dayjs().add(1, 'month') })

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

    await goToPage({ page, path: '/admin/rewards/', loginAs: 'admin' })
    await page.click('testId=add-reward')
    await page.waitForSelector('[data-reward-id="new"]')
    await setDateField({ page, fieldName: 'startAt', date: dayjs().add(1, 'day') })
    await setDateField({ page, fieldName: 'endAt', date: dayjs().add(1, 'month') })
    await page.fill('[name="points"]', '10')
    await page.fill('[name="prize"]', prize)
    await page.click('testId=form-save-btn')

    const reward = page.locator(`[data-reward-id]:not([data-reward-id="new"]):has([value="${prize}"])`)
    await reward.waitFor()
    const rewardId = await reward.getAttribute('data-reward-id')

    await page.fill(`[data-reward-id="${rewardId}"] >> [name="prize"]`, prize + ' UPDATED')
    await page.click('testId=form-save-btn')

    await page.waitForSelector(`[data-reward-id="${rewardId}"] >> [value="${prize} UPDATED"]`)

    await page.click(`[data-reward-id="${rewardId}"] >> testId="delete-reward"`)
    await page.waitForSelector(`[data-reward-id="${rewardId}"]`, { state: 'detached' })
})
