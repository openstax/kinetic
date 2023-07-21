import * as React from 'react'
import {
    IconProps as SundryIconProps,
    Icon as SundryIcon,
    IconifyIcon,
    IconifyIconDefinition,
} from '@nathanstitt/sundry/ui'

import clockOutline from '@iconify-icons/mdi/clock-outline'
import plusCircleOutline from '@iconify-icons/mdi/plus-circle-outline'
import close from '@iconify-icons/mdi/close'
import chevronRight from '@iconify-icons/mdi/chevron-right'
import chevronLeft from '@iconify-icons/mdi/chevron-left'
import chevronDown from '@iconify-icons/mdi/chevron-down'
import chevronUp from '@iconify-icons/mdi/chevron-up'
import dotsVertical from '@iconify-icons/mdi/dots-vertical'
import search from '@iconify-icons/mdi/search'
import trash from '@iconify-icons/mdi/delete'
import checkCircle from '@iconify-icons/mdi/check-circle'
import circle from '@iconify-icons/mdi/circle-outline'
import feedback from '@iconify-icons/mdi/feedback'
import heart from '@iconify-icons/mdi/heart'
import warning from '@iconify-icons/mdi/warning'
import person from '@iconify-icons/mdi/person'
import menu from '@iconify-icons/mdi/menu'
import cardMultiple from '@iconify-icons/mdi/card-multiple'
import message from '@iconify-icons/mdi/message'
import cloudUpload from '@iconify-icons/mdi/cloud-upload'
import cloudDownload from '@iconify-icons/mdi/cloud-download'
import helpCircle from '@iconify-icons/mdi/help-circle'
import pencil from '@iconify-icons/mdi/pencil'
import pause from '@iconify-icons/mdi/pause'
import play from '@iconify-icons/mdi/play'


export const ICONS = {
    clockOutline,
    plusCircleOutline,
    close,
    chevronRight,
    chevronLeft,
    chevronDown,
    chevronUp,
    dotsVertical,
    search,
    trash,
    checkCircle,
    feedback,
    heart,
    warning,
    circle,
    person,
    menu,
    cardMultiple,
    message,
    cloudUpload,
    cloudDownload,
    helpCircle,
    pencil,
    pause,
    play,
}

export type IconKey = keyof typeof ICONS
export type IconSpec = IconKey | IconifyIconDefinition | IconifyIcon

export interface IconProps extends Omit<SundryIconProps, 'icon'> {
    icon: IconSpec
    id?: string
    disabled?: boolean
}

export const Icon = React.forwardRef<SVGSVGElement, PropsWithOptionalChildren<IconProps>>((allProps, ref) => {
    const { icon, ...props } = allProps

    return <SundryIcon {...props} ref={ref} icon={typeof icon === 'object' ? icon : ICONS[icon]} />
})

Icon.displayName = 'Icon'
