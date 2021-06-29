import { React, Component, useEffect } from '../common'
import { ErrorInfo, ReactNode } from 'react'
import { Button } from './primitives'
import { OXColoredStripe } from './ox-colored-stripe'
import LoadingAnimation from './loading-animation'
import { reloadOnce, forceReload } from '../lib/reload';
//import { Raven } from '../../models';

const AsyncLoadError:React.FC<{ error: any }> = ({ error }) => {
    useEffect(reloadOnce, [])

    return (
        <div className="invalid-page">
            <OXColoredStripe />
            <h1>
                Uh-oh, the page failed to load
            </h1>
            <p>{String(error)}</p>
            <Button primary onClick={() => forceReload()}>Retry</Button>
        </div>
    );
}


interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {

    };

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI.
        return { error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // eslint-disable-next-line no-console
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.error) {
            return <AsyncLoadError error={this.state.error} />;
        }
        return this.props.children;
    }
}


export function loadAsync<T extends React.ComponentType<any>>(
    name: string,
    loader: () => Promise<{ default: T }>,
) {

    const Component = React.lazy(loader)
    const loading = <LoadingAnimation message={`Loading ${name}…`} />;

    const Loader = (props: any) => (
        <ErrorBoundary>
            <React.Suspense fallback={loading}>
                <Component {...props} />
            </React.Suspense>
        </ErrorBoundary>
    );

    return (props: any) => <Loader {...props} />;
}

/*
 * export function loadAsync(resolve, name) {
 *     // return a function so the router will only evaluate it when it's needed
 *     // in the future we may insert role dependant logic here
 *     return () => asyncComponent(resolve, name);
 * } */
