import { React, cx, useMemo, useState, useCallback } from '@common'
import { Button, ButtonProps } from './button'
import { uniqueId } from 'lodash-es'
import { usePopper } from 'react-popper'

export interface MenuProps extends Omit<ButtonProps, 'label'> {
    label: React.ReactElement | string
    alignEnd?: boolean
    menuClassName?: string
}
export const Menu:React.FC<MenuProps> = ({
    label, children, className, alignEnd, menuClassName, ...buttonProps
}) => {
    const [isOpen, setOpen] = useState(false)
    const [popover, setPopover] = useState<HTMLDivElement | null>(null)

    const [target, setTarget] = useState<HTMLButtonElement | null>(null)

    const { styles, attributes } = usePopper(target, popover, {
        placement: `bottom-${alignEnd ? 'end' : 'start'}`,
        strategy: 'fixed',
        modifiers: [ { name: 'offset', options: { offset: [0, 5] } } ],
    })

    const btnId = useMemo(() => uniqueId('dropDownBtn-'), [])

    const onClose = useCallback(() => {
        document.removeEventListener('click', onBodyClick)
        setOpen(false)
    }, [setOpen])

    const onBodyClick = useCallback(() => {
        onClose()
    }, [onClose])

    const onMenuClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation()
        if (isOpen) {
            onClose()
        } else {
            document.addEventListener('click', onBodyClick)
            setOpen(true)
        }
    }

    return (
        <div className="dropdown">
            <Button
                {...buttonProps}
                ref={setTarget}
                className={cx(className, 'dropdown-toggle')}
                id={btnId}
                onClick={onMenuClick}
                css={{ height: '100%' }}
            >
                {label}
            </Button>
            <div
                className={cx('dropdown-menu', menuClassName, {
                    show: isOpen,
                })}
                ref={setPopover}
                style={styles.popper}
                {...attributes.popper}

                aria-labelledby={btnId}
            >
                {children}
            </div>
        </div>
    )
}
