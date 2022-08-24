import { React, useState, cx } from '../common'
import { usePopper } from 'react-popper'
import { useRefElement } from 'rooks'
import * as CSS from 'csstype'

interface ControlledPopoverProps {
    show: boolean
    displayType?: 'tooltip' | 'popover'
    target?: HTMLElement | null
    title?: React.ReactNode
}

export interface PopoverProps extends Omit<ControlledPopoverProps, 'show'> {
    popover: React.ReactNode
    className?: string
    style?: CSS.Properties<string | number>
}

export const ControlledPopover: FCWC<ControlledPopoverProps> = ({
    show,
    title,
    target,
    children,
    displayType = 'popover',
}) => {
    const [setPopover, popover] = useRefElement<HTMLElement>()
    const [setArrow, arrow] = useRefElement<HTMLDivElement>()

    const { styles, attributes } = usePopper(target, popover, {
        modifiers: [{ name: 'arrow', options: { element: arrow } }],
    })
    if (!show) { return null }
    const pos = (attributes.popper || {})['data-popper-placement']
    return (
        <div
            className={cx(displayType, 'fade', `bs-${displayType}-${pos}`, { show })}
            role="tooltip"
            ref={setPopover}
            style={styles.popper}
            {...attributes.popper}
        >
            <div className={`${displayType}-arrow`} ref={setArrow} style={styles.arrow} />
            {title && <h3 className={`${displayType}-header`}>{title}</h3>}
            <div className={displayType == 'popover' ? 'popover-body' : 'tooltip-inner'}>
                {children}
            </div>
        </div>
    )
}

export const Popover: FCWC<PopoverProps> = ({
    popover,
    children,
    className,
    style,
    ...popoverProps
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [setWrapperRef, wrapperRef] = useRefElement<HTMLElement>()

    return (
        <div
            ref={setWrapperRef}
            style={style}
            className={cx('popover-wrapper', className)}
            onMouseEnter={() => { setIsHovered(true) }}
            onMouseLeave={() => { setIsHovered(false) }}
        >
            {children}
            <ControlledPopover target={wrapperRef} show={isHovered} {...popoverProps}>
                {popover}
            </ControlledPopover>
        </div>
    )
}
