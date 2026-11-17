import React from 'react';

// CookieYes (loaded by GTM) opens its preferences when anything with the cky-banner-element class is clicked.
// The account menu mounts after CookieYes may have loaded, so check for it on mount as well as on its load event.
const isCookieYesLoaded = () => typeof window !== 'undefined' && 'getCkyConsent' in window

export const ManageCookiesLink = () => {
    const [cookieYesLoaded, setCookieYesLoaded] = React.useState(isCookieYesLoaded)

    React.useEffect(() => {
        if (cookieYesLoaded) return

        const onLoad = () => setCookieYesLoaded(isCookieYesLoaded())
        document.addEventListener('cookieyes_banner_load', onLoad)
        return () => document.removeEventListener('cookieyes_banner_load', onLoad)
    }, [cookieYesLoaded])

    if (!cookieYesLoaded) {
        return null;
    }

    return (
        <span className="cky-banner-element">Manage Cookies</span>
    )
};
