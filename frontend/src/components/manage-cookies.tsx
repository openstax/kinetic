import React from 'react';
import { Global, css } from '@emotion/react'

type ManageCookiesLinkProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  wrapper?: (button: React.ReactElement) => React.ReactElement
}

// documentation for this at https://docs.osano.com/hiding-the-cookie-widget
export const ManageCookiesLink = (props: ManageCookiesLinkProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const osano = typeof window === 'undefined' ? undefined : (window as any).Osano

    if (osano === undefined || osano.cm.mode === 'debug') {
        return null;
    }

    const showOsano = (ev: React.MouseEvent) => {
        ev.preventDefault()
        osano.cm.showDrawer('osano-cm-dom-info-dialog-open')
    }


    return (
        <>
            <Global
                styles={css({ '.osano-cm-widget': { display: 'none' } })}
            />
            <a href='#' onClick={showOsano}>Manage Cookies</a>
        </>
    )
};
