import { loginAs, test } from './test';

test('cannot access researcher studies if logged in as a user', async({ page }) => {
    await loginAs({ page, login: 'user' })
})

test('can access studies table as a researcher', async({ page }) => {
    await loginAs({ page, login: 'researcher' })
})
