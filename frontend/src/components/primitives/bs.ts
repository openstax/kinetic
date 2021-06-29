import { omit } from '../../lib/util'

export interface BSVariants {
    primary?: boolean
    secondary?: boolean
    success?: boolean
    danger?: boolean
    warning?: boolean
    info?: boolean
    light?: boolean
    dark?: boolean
    link?: boolean
    outline?: boolean
}

export const BS_VARIANTS = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'link',
]

interface bsClassNamesOptions {
    default: string
}

export const bsClassNames = (
    prefix: string,
    props: any,
    options: bsClassNamesOptions = { default: 'info' },
): [string, any] => {
    const outline = !!props.outline
    let classNames = BS_VARIANTS.filter(nm => props[nm]).map(nm => `${prefix}-${outline ? 'outline-' : ''}${nm}`).join(' ')
    if (!classNames && options.default) {
        classNames = `${prefix}-${outline ? 'outline-' : ''}${options.default}`
    }
    return [classNames, omit(props, ...BS_VARIANTS)]
}
