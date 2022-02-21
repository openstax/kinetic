import * as React from 'react'
import { keyframes, css } from '@emotion/react'
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

export interface IconProps extends Omit<IconifyIcon, 'icon'> {
    icon: IconKey | IconifyIconDefinition | IconifyIcon
    title?: string
    tooltip?: React.ReactNode
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void
}

export const Icon:React.FC<IconProps> = ({ icon, tooltip, onClick, children, ...iconProps }) => {
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
            <button onClick={onClick} css={{
                border: 'none',
                padding: 0,
                margin: 0,
                background: 'transparent',
                color: '#738694',
                transition: 'all 0.3s ease-out',
                display: 'inline-flex',
                ':hover': {
                    color: '#292929',
                },
            }}>
                {iconEl}
                {children}
            </button>
        )
    }
    return iconEl
}
