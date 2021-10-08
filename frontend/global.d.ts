import type { User } from './src/models/user'

declare global {
    interface Window {
        dataLayer?: any[]
        gtag?(...args: any[]): void
        config: {
            url: string;
        }
        _MODELS?: {
            user?: User
        }
    }

    interface ImportMeta {
        env: {
            VITE_API_ADDRESS: string
            MODE: string
            IS_LOCAL: boolean
            VITE_GTAG_ID: string
        };
    }

}


// Adding this exports the declaration file which Typescript/CRA can now pickup:
export {}
