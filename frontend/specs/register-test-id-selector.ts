import * as playwright from 'playwright'


export const createDataTestIdEngine = () => {

    const toTestSelector = (sel: string) => {
        const quoted = sel.match(/^".*"$/) ? sel : `"${sel}"`;
        return `[data-test-id=${quoted}]`;
    };

    console.log("REGISTER")
    return {
        // Creates a selector that matches given target when queried at the root.
        // Can return undefined if unable to create one.
        create(root: HTMLElement, target: HTMLElement) {
            const testId = target.getAttribute('data-test-id');
            return (testId && root.querySelector(toTestSelector(testId)) === target) ? testId : undefined;
        },

        // Returns the first element matching given selector in the root's subtree.
        query(root: HTMLElement, selector: string) {
            return root.querySelector(toTestSelector(selector));
        },

        // Returns all elements matching given selector in the root's subtree.
        queryAll(root: HTMLElement, selector: string) {
            return Array.from(root.querySelectorAll(toTestSelector(selector)));
        },
    };
};


export const registerTestIdSelector = () => {
    console.log("REGISTER TEST")
    playwright.selectors.register('testId', createDataTestIdEngine)
}
