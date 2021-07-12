import base, { selectors } from '@playwright/test';

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
export { test }
