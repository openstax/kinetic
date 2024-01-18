import { React, useEffect, useLocation } from '@common'
import { Button } from '@components'
import { OXColoredStripe } from './ox-colored-stripe'
import { forceReload, reloadOnce } from '../lib/reload';
import { NavLink } from 'react-router-dom';
import { Container } from '@mantine/core';

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
            <Container>
                <h1>
                    Uh-oh, the <code>{path}</code> was not found
                </h1>
                <NavLink to="/">Go Home</NavLink>
            </Container>
        </div>
    );
}
