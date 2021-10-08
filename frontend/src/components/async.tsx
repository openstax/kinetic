import { React } from '@common'
import { ErrorBoundary } from '@sentry/react'
import { LoadingAnimation } from './loading-animation'
import { ErrorPage } from './ui-states'

/* const { Boundary } = Sentry as any
 * console.log({ Sentry }) */

export function loadAsync<T extends React.ComponentType<any>>(
    name: string,
    loader: () => Promise<{ default: T }>,
) {

    const Component = React.lazy(loader)
    const loading = <LoadingAnimation message={`Loading ${name}…`} />;

    const Loader = (props: any) => (
        <ErrorBoundary
            fallback={({ error }: {error: Error}) => <ErrorPage error={error} />}
        >
            <React.Suspense fallback={loading}>
                <Component {...props} />
            </React.Suspense>
        </ErrorBoundary>
    );

    return (props: any) => <Loader {...props} />;
}
