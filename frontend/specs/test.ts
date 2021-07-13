import base, { selectors, Page } from '@playwright/test';
import * as faker from 'faker'
export const createTestIdEngine = () => {
    const toTestSelector = (sel: string) => {
        const quoted = sel.match(/^".*"$/) ? sel : `"${sel}"`;
        return `[data-test-id=${quoted}]`;
    };
    return {
        query: (root: HTMLElement, selector: string) => root.querySelector(toTestSelector(selector)),
        queryAll: (root: HTMLElement, selector: string) => Array.from(root.querySelectorAll(toTestSelector(selector))),
    }
}

const test = base.extend({

})

test.beforeAll( async () => {
    await selectors.register('testId', createTestIdEngine)
})

export * from '@playwright/test'

const USERS = {
    admin: '00000000-0000-0000-0000-000000000000',
    researcher: '00000000-0000-0000-0000-000000000001',
}

export const loginAs = async ({ page, login }: { page: Page, login: keyof typeof USERS }) => {
    await page.goto('http://localhost:4000/')
    await page.click('testId=login-link')
    await page.click(`[data-user-id="${USERS[login]}"]`)
}

export { test, faker }
