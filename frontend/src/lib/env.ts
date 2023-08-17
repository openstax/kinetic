const IS_DEV_MODE = import.meta.env.MODE == 'development'
const IS_LOCAL = window.location.hostname == 'localhost'
const API_ADDRESS = IS_LOCAL ? 'http://localhost:4006' : ''
const API_VERSION = 1
const IS_PRODUCTION = (window.location.host == 'kinetic.openstax.org')

export const ENV = {
    IS_DEV_MODE,
    IS_PRODUCTION,
    IS_LOCAL,
    API_VERSION,
    MODE: import.meta.env.MODE || 'development',
    IS_PROD_MODE: import.meta.env.MODE == 'production',
    API_ADDRESS,
    GTAG_ID: IS_PRODUCTION ? import.meta.env.VITE_PROD_GTAG_ID : import.meta.env.VITE_TEST_GTAG_ID,
    GA_UA: IS_PRODUCTION ? import.meta.env.VITE_PROD_GA_UA : import.meta.env.VITE_TEST_GA_UA,
    API_PATH: `${API_ADDRESS}/api/v${API_VERSION}`,
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
}

window._MODELS = window._MODELS || {}
window._TEST_METHODS = window._TEST_METHODS || {}
window._MODELS.env = ENV

Object.freeze(ENV)
