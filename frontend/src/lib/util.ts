export function omit<T extends object = {}>(obj: T, ...keys: string[]): Partial<T> {
    return (keys as any).reduce((a: Partial<T>, e: keyof T) => {
        const { [e]: _omitted, ...rest } = a; // eslint-disable-line no-unused-vars
        return rest;
    }, obj);
}

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const ret: any = {};
    keys.forEach(key => {
        ret[key] = obj[key];
    })
    return ret;
}

export function isNil(val: any): val is { val: null } | { val: undefined } {
    return val == null
}

export function remove<T>(el: T, array: T[]): void {
    const index = array.indexOf(el, 0);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function tagTester<T>(name: string) {
    const tag = '[object ' + name + ']'
    return function (obj: unknown): obj is T {
        return Object.prototype.toString.call(obj) === tag
    }
}

export const toPercent = (num: number) => {
    Math.round(num * 100)
}

export const isString = tagTester<string>('String')
export const isNumber = tagTester<number>('Number')
export const isDate = tagTester<Date>('Date')
export const isRegExp = tagTester<RegExp>('RegExp')
export const isError = tagTester<Error>('Error')
export const isSymbol = tagTester<symbol>('Symbol')
export const isArrayBuffer = tagTester<ArrayBuffer>('ArrayBuffer')
export const isFunction = tagTester<Function>('Function')

export const whenDomReady = (): Promise<void> => {
    if (document.readyState != 'loading') {
        return Promise.resolve()
    } else {
        return new Promise(r => document.addEventListener('DOMContentLoaded', () => r()));
    }
}

interface RetryOptions {
    times?: number
    interval?: number
    exponentialBackoff?: boolean
}

// https://github.com/gregberge/loadable-components/issues/667
export function retry<T>(
    fn: () => Promise<T>,
    { times = 3, interval = 500, exponentialBackoff = true }: RetryOptions = {},
) {
    return new Promise<T>((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                setTimeout(() => {
                    if (times === 1) {
                        reject(error)
                        return
                    }

                    // Passing on "reject" is the important part
                    retry(fn, {
                        times: times - 1,
                        interval: exponentialBackoff ? interval * 2 : interval,
                    }).then(resolve, reject)
                }, interval)
            })
    })
}

export const emptyFn = () => { }
