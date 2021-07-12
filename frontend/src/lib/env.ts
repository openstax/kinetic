export const ENV = {
    MODE: import.meta.env.MODE || 'development',
    IS_DEV_MODE: import.meta.env.MODE == 'development',
    IS_PROD_MODE: import.meta.env.MODE == 'production',
    API_ADDRESS: import.meta.env.VITE_API_ADDRESS || '',
    IS_LOCAL: window.location.hostname == 'localhost',
    ACCOUNTS_URL: 'https://accounts-dev.openstax.org/',
    API_PATH: '/api/v0',
}

Object.freeze(ENV)
