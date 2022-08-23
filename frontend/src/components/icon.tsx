import * as React from 'react'
import { keyframes, css, CSSObject } from '@emotion/react'
import { Popover, PopoverProps } from './popover'
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

export interface IconProps extends Omit<IconifyIcon, 'icon' | 'body'> {
    id?: string
    icon: IconKey | IconifyIconDefinition | IconifyIcon
    title?: string
    color?: string
    className?: string
    busy?: boolean
    tooltip?: React.ReactNode
    tooltipProps?: Omit<PopoverProps, 'children' | 'target' | 'popover'>
    buttonStyles?: CSSObject,
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void
}

export const Icon = React.forwardRef<SVGSVGElement, React.PropsWithChildren<IconProps>>((
    forwardedProps,
    ref
) => {

    const {
        id, icon: iconProp, tooltip, onClick, children, busy, buttonStyles = {}, tooltipProps = {}, ...iconProps
    } = forwardedProps

    //  ) => {
    const icon = busy ? 'spin' : iconProp
    const iconEl = (
        <IconifyIconComponent
            id={id}
            ref={ref as any}
            icon={typeof icon === 'object' ? icon : ICONS[icon]}
            css={icon == 'spin' ? spinCSS : {}}
            {...iconProps}
        />
    )
    if (tooltip) {
        return (
            <Popover popover={tooltip} {...tooltipProps}>
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
})
