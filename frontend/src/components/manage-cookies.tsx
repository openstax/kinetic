import React from 'react';

// documentation for this at https://docs.osano.com/hiding-the-cookie-widget
export const ManageCookiesLink = () => {
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
        <span onClick={showOsano}>Manage Cookies</span>
    )
};
