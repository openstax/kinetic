import * as React from 'react'
import {
    IconProps as SundryIconProps,
    Icon as SundryIcon,
    IconifyIcon,
    IconifyIconDefinition,
    setSundryIcons,
} from '@nathanstitt/sundry/ui'

import thumbsUp from '@iconify-icons/bi/hand-thumbs-up-fill'
import exclamationTriangle from '@iconify-icons/bi/exclamation-triangle-fill'
import xCircle from '@iconify-icons/bi/x-circle'
import plusSquare from '@iconify-icons/bi/plus-square-fill'
import exclamationCircle from '@iconify-icons/bi/exclamation-circle-fill'
import clock from '@iconify-icons/bi/clock'
import clockFill from '@iconify-icons/bi/clock-fill'
import spin from '@iconify-icons/bi/arrow-clockwise'
import minusSquare from '@iconify-icons/bi/dash-square'
import plusCircle from '@iconify-icons/bi/plus-circle'
import plus from '@iconify-icons/bi/plus'
import close from '@iconify-icons/bi/x-square'
import x from '@iconify-icons/bi/x'
import back from '@iconify-icons/bi/chevron-double-left'
import right from '@iconify-icons/bi/chevron-right'
import tripleDot from '@iconify-icons/bi/three-dots'
import tripleDotVertical from '@iconify-icons/bi/three-dots-vertical'
import cancel from '@iconify-icons/bi/x-circle'
import trash from '@iconify-icons/bi/trash'
import checkCircle from '@iconify-icons/bi/check-circle-fill'
import emptyCircle from '@iconify-icons/bi/circle'
import feedback from '@iconify-icons/bi/chat-left-dots-fill'
import search from '@iconify-icons/bi/search'
import heart from '@iconify-icons/bi/heart-fill'
import warning from '@iconify-icons/bi/exclamation-triangle-fill'
import rolodex from '@iconify-icons/bi/person-rolodex'
import list from '@iconify-icons/bi/list'
import multiStage from '@iconify-icons/bi/stack'
import chatLeft from '@iconify-icons/bi/chat-left-fill'
import cloudUpload from '@iconify-icons/bi/cloud-upload'
import cloudDownload from '@iconify-icons/bi/cloud-download'
import questionCircleFill from '@iconify-icons/bi/question-circle-fill'
import arrowLeftRight from '@iconify-icons/bi/arrow-left-right'
import arrowUpDown from '@iconify-icons/bi/arrow-up-down'
import arrowLeft from '@iconify-icons/bi/arrow-left'
import arrowRight from '@iconify-icons/bi/arrow-right'
import arrowUp from '@iconify-icons/bi/arrow-up'
import arrowDown from '@iconify-icons/bi/arrow-down'
import pencilFill from '@iconify-icons/bi/pencil-fill'
import pause from '@iconify-icons/bi/pause'
import pauseFill from '@iconify-icons/bi/pause-fill'
import playFill from '@iconify-icons/bi/play-fill'
import chevronLeft from '@iconify-icons/bi/chevron-left'
import chevronRight from '@iconify-icons/bi/chevron-right'
import chevronDown from '@iconify-icons/bi/chevron-down'
import chevronUp from '@iconify-icons/bi/chevron-up'

const SUNDRY_PACKAGED_ICONS = {
    thumbsUp,
    xSimple: x,
    exclamationCircle,
    exclamationTriangle,
    cancel: xCircle,
    clock,
    xCircle,
    spin,
    close,
    plusSquare,
    plus,
    minusSquare,
}
setSundryIcons(SUNDRY_PACKAGED_ICONS)

export const ICONS = {
    ...SUNDRY_PACKAGED_ICONS,
    x,
    close,
    clock,
    clockFill,
    back,
    search,
    plusCircle,
    cancel,
    trash,
    tripleDot,
    tripleDotVertical,
    checkCircle,
    spin,
    feedback,
    heart,
    warning,
    emptyCircle,
    rolodex,
    list,
    right,
    multiStage,
    chatLeft,
    cloudUpload,
    cloudDownload,
    questionCircleFill,
    arrowUpDown,
    arrowLeftRight,
    arrowLeft,
    arrowRight,
    arrowUp,
    arrowDown,
    pencilFill,
    pause,
    pauseFill,
    playFill,
    chevronLeft,
    chevronRight,
    chevronDown,
    chevronUp,
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
