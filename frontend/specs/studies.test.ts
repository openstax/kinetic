import { test, expect, loginAs, faker } from './test'

test('it can create and edit a study', async ({ page }) => {
    const title = faker.company.catchPhrase()
    await loginAs({ page, login: 'researcher' })
    expect(await page.textContent('.studies')).toContain('studies')
    await page.click('testId=add-study')
    await page.click('testId=form-save-btn')
    expect(await page.$('[name=titleForParticipants].is-invalid')).toBeDefined()
    await page.fill('[name=titleForParticipants]', title)
    await page.fill('[name=shortDescription]', 'short desc')
    await page.fill('[name=longDescription]', 'long desc')
    await page.click('testId=form-save-btn')
    await page.waitForSelector('.modal.show', { state: 'detached' })
    await page.waitForLoadState('networkidle')
    expect(await page.textContent('testId=studies-table')).toContain(title)

    await page.click('testId=studies-table >> css=.row:last-child >> testId=edit-study')
    expect(await page.getAttribute('[name=titleForParticipants]', 'value')).toBe(title)
    await page.fill('[name=titleForParticipants]', `${title} - UPDATED`)
    await page.click('testId=form-save-btn')
    await page.waitForLoadState('networkidle')
    expect(await page.textContent('testId=studies-table')).toContain(`${title} - UPDATED`)
});
