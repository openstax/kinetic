import * as React from 'react'
import { cx, styled } from '../common'
import { useHistory } from 'react-router-dom'
import { usePendingState, isNil } from '../lib'
import { BSVariants, bsClassNames } from './bs'
import { IconKey, Icon } from './icon'
import LD from './loading-dots'

const Busy = styled.span({
    display: 'flex',
})

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'>, BSVariants {
    disabled?: boolean

    busy?: boolean
    icon?: IconKey
    busyMessage?: string
    type?: 'button' | 'submit' | 'reset'
}

export const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>((forwardedProps, ref) => {

    const {
        disabled,
        busyMessage,
        children,
        icon,
        type = 'button',
        busy: isBusy = false,
        className = '',
        ...otherProps
    } = forwardedProps


    const [bsClasses, props] = bsClassNames('btn', otherProps, { default: 'light' })
    let iconEl = null

    if (icon) {
        iconEl = <Icon icon={icon} css={{ marginRight: '0.35rem' }}/>
    }

    const showAsBusy = usePendingState(isBusy, 150)
    const message = showAsBusy ? <Busy>{busyMessage}<LD /></Busy> : children

    return (
        <button
            ref={ref}
            type={type}
            css={{
                display: 'inline-flex',
                alignItems: 'center',
                '&.btn-close': {
                    background: 'transparent',
                },
            }}
            className={cx('btn', className, bsClasses)} {...props
            }
            disabled={isNil(disabled) ? isBusy : disabled}
        >
            {iconEl}
            {message}
        </button>

    )
})

interface LinkButtonProps extends ButtonProps {
    to: string
}

export const LinkButton:React.FC<LinkButtonProps> = ({ to, ...props }) => {
    const history = useHistory()
    const onClick = () => history.push(to)
    return <Button onClick={onClick} {...props} />
}
