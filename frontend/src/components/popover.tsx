import { React, useState, cx } from '../common'
import { usePopper } from 'react-popper'
import { useRefElement } from 'rooks'

interface ControlledPopoverProps {
    show: boolean
    target?: HTMLElement | null
    title?: React.ReactNode
}

interface PopoverProps extends Omit<ControlledPopoverProps, 'show'> {
    popover: React.ReactNode
}

export const ControlledPopover: React.FC<ControlledPopoverProps> = ({
    show, title, target, children,
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
            className={cx('popover', 'fade', `bs-popover-${pos}`, { show })}
            role="tooltip"
            ref={setPopover}
            style={styles.popper}
            {...attributes.popper}
        >
            <div className="popover-arrow" ref={setArrow} style={styles.arrow} />
            {title && <h3 className="popover-header">{title}</h3>}
            <div className="popover-body">
                {children}
            </div>
        </div>
    )
}

export const Popover: React.FC<PopoverProps> = ({ popover, children, ...popoverProps }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [ setWrapperRef, wrapperRef] = useRefElement<HTMLElement>()

    return (
        <div ref={setWrapperRef}
            className="popover-wrapper"
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
