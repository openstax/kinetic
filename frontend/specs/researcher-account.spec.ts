import { loginAs, test } from './test';

test('can update researcher account details', async({ page }) => {
    await loginAs({ page, login: 'researcher' })
})
