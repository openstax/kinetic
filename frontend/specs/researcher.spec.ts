import {
    test, expect, loginAs, faker, rmStudy, getIdFromUrl,
    createStudy, goToPage, interceptStudyLaunch, interceptStudyLand,
} from './test'

test('can create and edit a study', async ({ page }) => {
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

    await page.fill('#tags input', 'type:survey')
    await page.keyboard.press('Enter')

    await page.click('testId=form-save-btn')
    await expect(page).not.toHaveSelector('.is-invalid', { timeout: 500 })

    await page.waitForSelector('.stages-listing')

    const studyId = await getIdFromUrl(page)

    expect(await page.getAttribute('[name=titleForParticipants]', 'value')).toBe(title)
    await page.fill('[name=titleForParticipants]', `${title} - UPDATED`)

    await page.click('testId=add-stage')
    await page.fill('[name=survey_id]', 'QR_1234')
    await page.fill('[name=secret_key]', '1234')
    await page.click('testId=add-stage-modal >> testId=form-save-btn')
    expect(await page.textContent('.row.stage')).toContain('qualtrics')

    await page.click('testId=form-save-btn')
    await page.waitForLoadState('networkidle')

    await page.click('testId=back-to-studies')

    await page.waitForLoadState('networkidle')
    await expect(page).toMatchText('testId=studies-table', RegExp(title))

    await rmStudy({ page, studyId })
})


test('can preview a study', async ({ page }) => {
    interceptStudyLaunch({ page })
    interceptStudyLand({ page })

    const studyName = faker.commerce.productDescription()
    const studyId = await createStudy({ page, name: studyName })
    await goToPage({ page, path: `/study/edit/${studyId}`, loginAs: 'researcher' })
    await page.click('testId=preview-study-btn')
    await expect(page).toMatchText('.modal-header', studyName)
    await page.click('testId=modal-close-btn')
    await expect(page).not.toMatchText('.modal-header', studyName, { timeout: 1000 })

    await page.click('testId=preview-study-btn')
    await page.waitForSelector('iframe[id="study"]')

    const frameHandle = await page.$('iframe[id="study"]')
    const frame = await frameHandle.contentFrame()

    // it's unclear why this is needed, but without it
    // the evaluate below seems to have no effect;
    // the src attribute does not update
    await page.waitForTimeout(500)

    await frameHandle.evaluate((n, sid: number) => n.setAttribute('src', `/study/land/${sid}`), studyId)

    await frame.click('testId=view-studies')

    await expect(page).not.toMatchText('.modal-header', studyName, { timeout: 1000 })

    await rmStudy({ page, studyId })
})
