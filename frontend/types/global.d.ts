/* eslint-disable no-unused-vars, @typescript-eslint/ban-types */
export { }

import type { User } from '../src/models/user'

declare global {
    interface Window {
        dataLayer?: any[]
        gtag?(...args: any[]): void
        config: {
            url: string;
        }
        _MODELS?: {
            user?: User
            env?: any
        }
    }

    interface ImportMeta {
        env: {
            MODE: string
            IS_LOCAL: boolean
            VITE_SENTRY_DSN: string
            VITE_API_ADDRESS: string
            VITE_PROD_GTAG_ID?: string
            VITE_PROD_GA_UA?: string
            VITE_TEST_GTAG_ID?: string
            VITE_TEST_GA_UA?: string
        };
    }
}
