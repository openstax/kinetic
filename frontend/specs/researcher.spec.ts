import { createStudy, test } from './test'

test('can create a study', async ({ browser }) => {
    await createStudy({ browser })
})
