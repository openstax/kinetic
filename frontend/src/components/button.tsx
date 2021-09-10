import { React, cx, styled } from '../common'
import { useHistory } from 'react-router-dom'
import { usePendingState, isNil } from '../lib'
import { BSVariants, bsClassNames } from './bs'
import { IconKey, Icon } from './icon'
import LD from './loading-dots'

const Busy = styled.span({
    display: 'flex',
})


export interface ButtonProps extends BSVariants, React.HTMLProps<HTMLButtonElement> {
    className?: string
    disabled?: boolean
    busy?: boolean
    icon?: IconKey
    busyMessage?: string
    type?: 'button' | 'submit' | 'reset'
}
export const Button:React.FC<ButtonProps> = ({
    disabled, busyMessage, children, icon,
    type = 'button',
    busy: isBusy = false,
    className = '',
    ...otherProps
}) => {
    const [bsClasses, props] = bsClassNames('btn', otherProps, { default: 'light' })
    let iconEl = null
    if (icon) {
        iconEl = <Icon icon={icon} css={{ marginRight: '0.35rem' }}/>
    }

    const showAsBusy = usePendingState(isBusy, 150)
    const message = showAsBusy ? <Busy>{busyMessage}<LD /></Busy> : children

    return (
        <button
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
}

interface LinkButtonProps extends ButtonProps {
    to: string
}

export const LinkButton:React.FC<LinkButtonProps> = ({ to, ...otherProps }) => {
    const history = useHistory()
    return <Button onClick={() => history.push(to)} {...otherProps} />
}
