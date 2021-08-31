import { closeStudy, getIdFromUrl } from './helpers';
import { test, expect, loginAs, faker } from './test'

test('it can create and edit a study', async ({ page }) => {
    const title = faker.company.catchPhrase()
    await loginAs({ page, login: 'researcher' })
    expect(await page.textContent('.studies')).toContain('Studies')
    await page.click('testId=add-study')

    await page.click('testId=form-save-btn')
    expect(
        await page.evaluate(() => document.location.pathname)
    ).toMatch(/new$/)

    expect(await page.$('[name=titleForParticipants].is-invalid')).toBeDefined()
    await page.fill('[name=titleForParticipants]', title)
    await page.fill('[name=shortDescription]', 'short desc')
    await page.fill('[name=longDescription]', 'long desc')
    await page.fill('[name=durationMinutes]', '42')


    await page.click('testId=form-save-btn')
    await expect(page).not.toHaveSelector('.is-invalid', { timeout: 500 })


    await page.waitForSelector('.stages-listing')

    const studyId = await getIdFromUrl(page)

    expect(await page.getAttribute('[name=titleForParticipants]', 'value')).toBe(title)
    await page.fill('[name=titleForParticipants]', `${title} - UPDATED`)

    await page.click('testId=add-stage')
    await page.fill('[name=url]', 'http://cnx.org/study-this')
    await page.fill('[name=secret_key]', '1234')
    await page.click('testId=add-stage-modal >> testId=form-save-btn')
    expect(await page.textContent('.row.stage')).toContain('qualtrics')

    await page.click('testId=form-save-btn')
    await page.waitForLoadState('networkidle')

    await page.click('testId=back-to-studies')
    // await page.click('[data-status="Completed"]')
    await page.waitForLoadState('networkidle')
    await expect(page).toMatchText('testId=studies-table', RegExp(title))

    await closeStudy({ page, studyId })

})
