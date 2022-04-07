import { React, cx } from '@common'
import styled from '@emotion/styled'
import { merge } from 'lodash-es'
import { BSVariants, bsClassNames } from './bs'
import LD from './loading-dots'
import { IconKey, Icon } from './icon'
import { usePendingState } from '@lib'


const iconStyle = {
    display: 'flex',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    svg: {
        marginRight: 0,
        ':not([height])': {
            height: '18px',
        },
    },
}

const StyledButton = styled.button<{ iconOnly: boolean }>(({ iconOnly }) => {
    const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        svg: {
            transition: 'color 0.2s',
            color: 'currentColor',
            marginRight: '0.5rem',
            ':not([height])': {
                height: '18px',
            },
        },
        '&.clear': {
            backgroundColor: 'transparent',
        },
    }
    return iconOnly ? merge(baseStyle, iconStyle) : baseStyle
})


const Busy = styled.span({
    display: 'flex',
})

type IconT = React.ReactNode | IconKey

export interface ButtonProps extends BSVariants, React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void
    icon?: IconT
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    busy?: boolean
    busyMessage?: string
    className?: string
    clear?: boolean
    small?: boolean
    iconOnly?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement,React.PropsWithChildren<ButtonProps>>((
    forwardedProps,
    ref
) => {
    const {
        disabled, busyMessage, children, clear, small,
        type = 'button',
        busy: busyProp = false,
        className = '',
        iconOnly = false,
        ...otherProps
    } = forwardedProps

    let { icon } = otherProps

    const [bsClasses, props] = bsClassNames('btn', otherProps, { default: 'light' })

    if (typeof icon === 'string') {
        icon = <Icon icon={icon as IconKey} />
    }

    const isBusy = usePendingState(busyProp, 150)

    const message = isBusy ? <Busy>{busyMessage}<LD /></Busy> : children

    return (
        <StyledButton
            type={type}
            ref={ref}
            disabled={busyProp || disabled}
            iconOnly={icon && !message}
            className={cx('btn', className, bsClasses, { clear, 'btn-sm': small })}
            {...props}
        >
            {icon}
            {iconOnly !== true && <span>{message}</span>}
        </StyledButton>
    )
})

Button.displayName = 'Button'
