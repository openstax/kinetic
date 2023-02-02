import * as React from 'react'
import {
    IconProps as SundryIconProps,
    Icon as SundryIcon,

    IconifyIcon,
    IconifyIconDefinition,
    setSundryIcons,
} from '@nathanstitt/sundry'

import thumbsUp from '@iconify-icons/bi/hand-thumbs-up-fill'
import exclamationTriangle from '@iconify-icons/bi/exclamation-triangle-fill'
import xCircle from '@iconify-icons/bi/x-circle'
import plusSquare from '@iconify-icons/bi/plus-square-fill'
import exclamationCircle from '@iconify-icons/bi/exclamation-circle-fill'
import clock from '@iconify-icons/bi/clock'
import spin from '@iconify-icons/bi/arrow-clockwise'
import minusSquare from '@iconify-icons/bi/dash-square'


import plusCircle from '@iconify-icons/bi/plus-circle'
import close from '@iconify-icons/bi/x-square'
import x from '@iconify-icons/bi/x'
import back from '@iconify-icons/bi/chevron-double-left'
import right from '@iconify-icons/bi/chevron-right'
import tripleDot from '@iconify-icons/bi/three-dots'
import cancel from '@iconify-icons/bi/x-circle'
import trash from '@iconify-icons/bi/trash'
import checkCircle from '@iconify-icons/bi/check-circle-fill'
import feedback from '@iconify-icons/bi/chat-left-dots-fill'
import search from '@iconify-icons/bi/search'
import heart from '@iconify-icons/bi/heart-fill'
import warning from '@iconify-icons/bi/exclamation-triangle-fill'
import rolodex from '@iconify-icons/bi/person-rolodex'
import list from '@iconify-icons/bi/list'
import multiStage from '@iconify-icons/bi/stack'
import chatLeft from '@iconify-icons/bi/chat-left-fill'
import cloudUpload from '@iconify-icons/bi/cloud-upload'


const SUNDRY_PACKAGED_ICONS = {
    thumbsUp,
    exclamationCircle,
    exclamationTriangle,
    cancel: xCircle,
    clock,
    xCircle,
    spin,
    close,
    plusSquare,
    minusSquare,
}
setSundryIcons(SUNDRY_PACKAGED_ICONS)

export const ICONS = {
    ...SUNDRY_PACKAGED_ICONS,
    x,
    close,
    clock,
    back,
    search,
    plusCircle,
    cancel,
    trash,
    tripleDot,
    checkCircle,
    spin,
    feedback,
    heart,
    warning,
    rolodex,
    list,
    right,
    multiStage,
    chatLeft,
    cloudUpload,
}

export type IconKey = keyof typeof ICONS
export type IconSpec = IconKey | IconifyIconDefinition | IconifyIcon

export interface IconProps extends Omit<SundryIconProps, 'icon'> {
    icon: IconSpec
}

export const Icon = React.forwardRef<SVGSVGElement, PropsWithOptionalChildren<IconProps>>((allProps, ref) => {
    const { icon, ...props } = allProps

    return <SundryIcon {...props} ref={ref} icon={typeof icon === 'object' ? icon : ICONS[icon]} />
})

Icon.displayName = 'Icon'
