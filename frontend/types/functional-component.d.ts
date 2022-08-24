/* eslint-disable no-unused-vars, @typescript-eslint/ban-types */
export { }


import type { WeakValidationMap, FC as RFC, ReactElement, ReactNode, ValidationMap } from 'react'

declare global {
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
