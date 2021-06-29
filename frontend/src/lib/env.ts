export const ENV = {
    API_URL: import.meta.env.VITE_API_URL || '',
    IS_LOCAL: window.location.hostname == 'localhost',
}

Object.freeze(ENV)
