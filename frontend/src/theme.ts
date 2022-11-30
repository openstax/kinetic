
export const colors = {
    pageBackground: '#f7f8fa',
    lightGrayBackground: '#F1F1F1',
    // TODO Confirm if we want both or switch?
    //  Figma mockup has #F36B32 for orange
    orange: '#f47641',
    primaryButton: '#D4450C',
    lightBlue: '#0DC0DC',
    darkBlue: '#151B2C',
    red: '#ca2026',
    teal: '#0dc0de',
    lightTeal: '#DBF3F8',
    darkTeal: '#039AC4',
    purple: '#6922EA',
    gray: '#E8E8E8',
    green: '#0EE094',
    yellow: '#F4D019',
    lightGray: '#DBDBDB',
    darkGray: '#989898',
    text: '#212529',
    grayText: '#848484',
    darkText: '#151B2C',
    blackText: '#424242',
    input: { border: '#ced4da' },
    line: '#cfcfcf',
    linkText: '#026AA1',
    linkButtonIcon: '#DBDBDB',
    linkButtonIconHover: '#151B2C',
    white: '#ffffff',
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
