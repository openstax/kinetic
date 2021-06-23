beforeAll(async () => {
    await page.goto('http://localhost:8031/')
})

test('should display correct browser', async () => {
    const txt = await page.textContent()

    expect(txt).toContain('hello')
})
