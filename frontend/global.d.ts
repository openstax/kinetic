/* eslint-disable no-unused-vars, @typescript-eslint/ban-types */
export { }

import type { User } from './src/models/user'
import type { FunctionComponent, WeakValidationMap, FC as RFC, ReactElement, ReactNode, ValidationMap } from 'react'

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

    type PropsWithChildren<P = {}> = P & {
        children: ReactNode | ReactNode[] | undefined
    }
    type PropsWithOptionalChildren<P = {}> = P & {
        children?: ReactNode | ReactNode[] | undefined
    }
    interface FCProperties<P = {}> {
        propTypes?: WeakValidationMap<P> | undefined
        contextTypes?: ValidationMap<any> | undefined
        defaultProps?: Partial<P> | undefined
        displayName?: string | undefined
    }
    export type FC<P = {}> = RFC<P>
    export interface FCWOC<P = {}> extends FCProperties {
        (props: PropsWithOptionalChildren<P>, context?: any): ReactElement<any, any> | null
    }
    export interface FCWC<P = {}> extends FCProperties {
        (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null
    }

}

// import type { FunctionComponent } from 'react'

// declare global {
// }


// Adding this exports the declaration file which Typescript/CRA can now pickup:
export { }
