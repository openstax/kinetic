// Color definitions in figma here:
// https://www.figma.com/file/aoc0hf7t3uI7wu7ghxi625/LD-library--Desktop?type=design&node-id=1010-307&mode=design&t=vmlqtKSi8F2d0xrb-0
export const colors = {
    // Primary Colors
    navy: '#151B2C',
    blue: '#255ED3',
    purple: '#3D2DCB',
    ash: '#f7f8fa',
    white: '#ffffff',
    text: '#424242',

    // Secondary Colors
    blue50: '#2874F9', // This color is mainly for icon, links.
    red: '#ca2026', // This color is to show users with an error state, delete/cancel action or error message.
    yellow: '#F4D019', // This color is to warn users with an alerting state.
    green: '#0EE094', // This color is to show users a success action, or message or state.

    // Tertiary Colors
    pine: '#1A654E',
    violet: '#6B38A8',
    blue30: '#7594F5',
    yellow50: '#FAF6D1',
    pine50: '#C9E9D3',
    violet50: '#EADEFA',
    coral50: '#F8D5CD',
    purple50: '#DFE1F9',
    pink50: '#F6DBED',

    // Neutral colors
    gray90: '#2F2F2F', // Example: tooltip background color
    gray70: '#848484', // Secondary text color
    gray50: '#DBDBDB', // Example: disabled link, CTA, border
    gray30: '#E3E3E3', // Example: disabled dropdown field, button
    blanket: 'rgba(21, 27, 44, 0.4)', // Use this color covering the content below the modal.

    // OpenStax Colors
    osOrange: '#f47541',
    osBlue: '#002469',
    osRed: '#D4450C',
    osTeal: '#0DC0DC',
    osYellow: '#F4D019',
}

export const screenSizes = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
}

export const media = {
    mobile: `@media (max-width: ${screenSizes['md']}px)`,
    tablet: `@media (min-width: ${screenSizes['md']}px) and (max-width: ${screenSizes['xl']}px)`,
    desktop: `@media (min-width: ${screenSizes['xl']}px)`,
}

export const theme = {
    colors,
    media,
}

type ThemeT = typeof theme
export type { ThemeT }
