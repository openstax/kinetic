
export const colors = {
    pageBackground: '#f7f8fa',
    orange: '#f47641',
    darkBlue: '#233066',
    red: '#ca2026',
    teal: '#0dc0de',
    purple: '#6922EA',
    gray: '#E8E8E8',
    green: '#0EE094',
    lightGray: '#DBDBDB',
    darkGray: '#989898',
    text: '#212529',
    grayText: '#848484',
    darkText: '#151B2C',
    blackText: '#424242',
    input: { border: '#ced4da' },

    linkButtonIcon: '#DBDBDB',
    linkButtonIconHover: '#151B2C',
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
