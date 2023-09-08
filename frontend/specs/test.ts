import base, { selectors, expect, Locator } from '@playwright/test'
import { matchers } from 'expect-playwright'
import { faker } from '@faker-js/faker'
import { removeOsanoFooter, TC, TestConfig } from './helpers'

export const DEFAULT_TIMEOUT = process.env.CI ? 90000 :
    process.env.DEBUG ? 0 : 10_000
export const DEFAULT_NAVIGATION_TIMEOUT = process.env.CI ? 90000 :
    process.env.DEBUG ? 0 : 15_000

expect.extend(matchers)


export const createTestIdEngine = () => {
    const toTestSelector = (sel: string) => {
        const quoted = sel.match(/^".*"$/) ? sel : `"${sel}"`
        return `[data-testid=${quoted}]`
    }
    return {
        query: (root: HTMLElement, selector: string) => root.querySelector(toTestSelector(selector)),
        queryAll: (root: HTMLElement, selector: string) => Array.from(root.querySelectorAll(toTestSelector(selector))),
    }
}

const test = base.extend<{ config: TestConfig }>({
    config: TC,
})
test.beforeAll(async () => {
    await selectors.register('testId', createTestIdEngine)
})

test.beforeEach(async ({ context, page }) => {
    await removeOsanoFooter(page)

    context.setDefaultTimeout(DEFAULT_TIMEOUT)
    page.setDefaultTimeout(DEFAULT_TIMEOUT)
    context.setDefaultNavigationTimeout(DEFAULT_NAVIGATION_TIMEOUT)
    page.setDefaultNavigationTimeout(DEFAULT_NAVIGATION_TIMEOUT)
})

export * from '@playwright/test'

export * from './helpers'
export { test, faker, Locator }
