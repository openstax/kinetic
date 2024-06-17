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
        _TEST_METHODS?: {
            logout?: () => void
        }
    }

    interface ImportMeta {
        env: {
            MODE: string
            IS_LOCAL: boolean
            VITE_SENTRY_DSN: string
            VITE_API_ADDRESS: string
            VITE_GTAG_ID?: string
        };
    }
}
