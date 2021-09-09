import base, { selectors, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { matchers } from 'expect-playwright'
import { TC, TestConfig } from './helpers'

expect.extend(matchers)

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

const test = base.extend<{ config: TestConfig }>({
    config: TC,
})
test.beforeAll( async () => {
    await selectors.register('testId', createTestIdEngine)
})
test.beforeEach(() => test.setTimeout(15000)) // set timeout for each individual test vs a global one

export * from '@playwright/test'

export * from './helpers'
export { test, faker }
