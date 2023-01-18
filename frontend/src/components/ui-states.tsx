import { React, useEffect, useLocation } from '@common'
import { Button } from './button'
import { LinkButton } from './styled-buttons'
import { OXColoredStripe } from './ox-colored-stripe'
import { reloadOnce, forceReload } from '../lib/reload';

export const ErrorPage: React.FC<{ error: any }> = ({ error }) => {
    useEffect(reloadOnce, [])
    return (
        <div className="invalid-page error">
            <OXColoredStripe />
            <div className="container pt-2">
                <h1>
                    Uh-oh, the page failed to load
                </h1>
                <p>{String(error)}</p>
                <Button primary onClick={() => forceReload()}>Retry</Button>
            </div>
        </div>
    );
}

export const PageNotFound: React.FC<{ name?: string }> = ({ name }) => {
    const location = useLocation();
    const path = name || `page ${location.pathname}`

    return (
        <div className="invalid-page not-found">
            <OXColoredStripe />
            <div className="container pt-2">
                <h1>
                    Uh-oh, the <code>{path}</code> was not found
                </h1>
                <LinkButton primary to="/">Go Home</LinkButton>
            </div>
        </div>
    );
}
