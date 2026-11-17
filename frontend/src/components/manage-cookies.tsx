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
        // CookieYes may have loaded between render and this effect
        onLoad()
        return () => document.removeEventListener('cookieyes_banner_load', onLoad)
    }, [cookieYesLoaded])

    if (!cookieYesLoaded) {
        return null;
    }

    return (
        // Stop the surrounding link from navigating; the click still bubbles to CookieYes's body listener
        <span className="cky-banner-element" onClick={(ev) => ev.preventDefault()}>Manage Cookies</span>
    )
};
