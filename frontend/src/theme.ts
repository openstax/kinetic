
export const colors = {
    // Primary Colors
    navy: '#151B2C',
    blue: '#255ED3',
    purple: '#3D2DCB',
    ash: '#f7f8fa',
    white: '#ffffff',
    text: '#848484',

    // Secondary Colors
    blue50: '#2874F9',
    red: '#ca2026',
    yellow: '#F4CF18',
    green: '#0EE094',

    // Tertiary Colors

    orange: '#f47541',
    primaryBlue: '#002469',
    lightBlue: '#62DAFC',
    teal: '#0DC0DC',
    darkTeal: '#039AC4',

    gray: '#E8E8E8',
    lightGray: '#DBDBDB',
    darkGray: '#989898',
    grayerText: '#424242',
    input: { border: '#ced4da' },
    line: '#cfcfcf',
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

const makeLine = (side: string) => ({
    [`border${side}`]: `1px solid ${colors.line}`,
    [`margin${side}`]: '1rem',
    [`padding${side}`]: '1rem',
})


export const theme = {
    colors,
    media,
    line: `1px solid ${colors.line}`,
    subtleBorder: `1px solid ${colors.line}`,
    css: {
        topLine: makeLine('Top'),
        bottomLine: makeLine('Bottom'),
        box: {
            border: `1px solid ${colors.line}`,
            padding: '1rem',
        },
    },
}

type ThemeT = typeof theme
export type { ThemeT }
