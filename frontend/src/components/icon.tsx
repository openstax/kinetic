import * as React from 'react'
import {
    Icon as SundryIcon,
    IconifyIcon,
    IconifyIconDefinition,
    IconProps as SundryIconProps,
    setSundryIcons,
} from '@nathanstitt/sundry/ui'

import arrowLeft from '@iconify-icons/ep/arrow-left-bold'
import arrowRight from '@iconify-icons/ep/arrow-right-bold'
import clockOutline from '@iconify-icons/mdi/clock-outline'
import plusCircleOutline from '@iconify-icons/mdi/plus-circle-outline'
import plus from '@iconify-icons/mdi/plus'
import minus from '@iconify-icons/mdi/minus'
import close from '@iconify-icons/mdi/close'
import chevronRight from '@iconify-icons/mdi/chevron-right'
import chevronLeft from '@iconify-icons/mdi/chevron-left'
import chevronDown from '@iconify-icons/mdi/chevron-down'
import chevronUp from '@iconify-icons/mdi/chevron-up'
import dotsVertical from '@iconify-icons/mdi/dots-vertical'
import search from '@iconify-icons/mdi/search'
import trash from '@iconify-icons/mdi/delete'
import checkCircle from '@iconify-icons/mdi/check-circle'
import check from '@iconify-icons/mdi/check'
import thickCheck from '@iconify-icons/mdi/check-thick'
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
import info from '@iconify-icons/mdi/info'
import thumbsUp from '@iconify-icons/mdi/thumb-up'
import alert from '@iconify-icons/mdi/alert'
import alertCircle from '@iconify-icons/mdi/alert-circle'
import reload from '@iconify-icons/mdi/reload'
import trophy from '@iconify-icons/mdi/trophy'
import trophyOutline from '@iconify-icons/mdi/trophy-outline'
import facebook from '@iconify-icons/mdi/facebook'
import instagram from '@iconify-icons/mdi/instagram'
import twitter from '@iconify-icons/mdi/twitter'

export const ICONS = {
    arrowLeft,
    arrowRight,
    clockOutline,
    plusCircleOutline,
    plus,
    close,
    search,
    trash,
    checkCircle,
    check,
    thickCheck,
    feedback,
    heart,
    warning,
    cloudUpload,
    cloudDownload,
    pause,
    chevronLeft,
    chevronRight,
    chevronDown,
    chevronUp,
    dotsVertical,
    circle,
    person,
    menu,
    cardMultiple,
    message,
    helpCircle,
    pencil,
    play,
    info,
    trophy,
    trophyOutline,
    facebook,
    twitter,
    instagram,
}

const SUNDRY_PACKAGED_ICONS = {
    thumbsUp,
    xSimple: close,
    cancel: close,
    xCircle: close,
    exclamationCircle: alertCircle,
    exclamationTriangle: alert,
    clock: clockOutline,
    spin: reload,
    close,
    plusSquare: plus,
    plus,
    minusSquare: minus,
}
setSundryIcons(SUNDRY_PACKAGED_ICONS)

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
