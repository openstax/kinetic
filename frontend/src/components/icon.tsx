import * as React from 'react'
import { keyframes, css, CSSObject } from '@emotion/react'
import { Popover } from './popover'
import { Icon as IconifyIconComponent, IconifyIcon } from '@iconify/react'
import { ICONS } from './packaged-icons'

const spinKeyframes = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`

const spinCSS = css`
    animation: 2s linear ${spinKeyframes} infinite;
`

interface IconifyIconDefinition {
    body: string
}

export type IconKey = keyof typeof ICONS

export interface IconProps extends Omit<IconifyIcon, 'icon'|'body'> {
    icon: IconKey | IconifyIconDefinition | IconifyIcon
    title?: string
    color?: string
    className?: string
    busy?: boolean
    tooltip?: React.ReactNode
    buttonStyles?: CSSObject,
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void
}

export const Icon:React.FC<IconProps> = ({
    icon: iconProp, tooltip, onClick, children, busy, buttonStyles = {}, ...iconProps
}) => {
    const icon = busy ? 'spin' : iconProp
    const iconEl = (
        <IconifyIconComponent
            icon={typeof icon === 'object' ? icon : ICONS[icon]}
            css={icon == 'spin' ? spinCSS : {}}
            {...iconProps}
        />
    )
    if (tooltip) {
        return (
            <Popover popover={tooltip}>
                {iconEl}
            </Popover>
        )
    }
    if (onClick) {
        return (
            <button
                onClick={onClick}
                disabled={busy}
                css={Object.assign({
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    background: 'transparent',
                    color: '#738694',
                    transition: 'all 0.3s ease-out',
                    ':hover': {
                        color: '#292929',
                    },
                }, buttonStyles)}>
                {iconEl}
                {children}
            </button>
        )
    }
    return iconEl
}
