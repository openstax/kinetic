const IS_DEV_MODE = import.meta.env.MODE == 'development'
const IS_LOCAL = window.location.hostname == 'localhost'
const API_ADDRESS = IS_LOCAL ? 'http://localhost:4006' : ''
const API_VERSION = 0

export const ENV = {
    IS_DEV_MODE,
    IS_LOCAL,
    API_VERSION,
    MODE: import.meta.env.MODE || 'development',
    IS_PROD_MODE: import.meta.env.MODE == 'production',
    API_ADDRESS,
    GTAG_ID: import.meta.env.VITE_GTAG_ID,
    API_PATH: `${API_ADDRESS}/api/v${API_VERSION}`,
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
}

Object.freeze(ENV)
