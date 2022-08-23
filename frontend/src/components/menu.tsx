import { React, cx, useMemo, useState, useCallback } from '@common'
import { useUserInfo, useIsMobileDevice } from '@lib'
import { Icon } from './icon'
import { Box } from 'boxible'
import { uniqueId } from 'lodash-es'
import { usePopper } from 'react-popper'

export interface MenuProps {
    alignEnd?: boolean
    className?: string
    menuClassName?: string
}

export const Menu: React.FC<MenuProps> = ({
    children, className, alignEnd, menuClassName,
}) => {
    const isMobile = useIsMobileDevice()
    const userInfo = useUserInfo()

    const [isOpen, setOpen] = useState(false)
    const [popover, setPopover] = useState<HTMLDivElement | null>(null)

    const [target, setTarget] = useState<SVGSVGElement | HTMLDivElement | null>(null)

    const { styles, attributes } = usePopper(target, popover, {
        placement: `bottom-${alignEnd ? 'end' : 'start'}`,
        strategy: 'fixed',
        modifiers: [{ name: 'offset', options: { offset: [0, 5] } }],
    })

    const btnId = useMemo(() => uniqueId('dropDownBtn-'), [])

    const onClose = useCallback(() => {
        document.removeEventListener('click', onBodyClick)
        setOpen(false)
    }, [setOpen])

    const onBodyClick = useCallback(() => {
        onClose()
    }, [onClose])

    const onMenuClick = (ev: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        ev.stopPropagation()
        if (isOpen) {
            onClose()
        } else {
            document.addEventListener('click', onBodyClick)
            setOpen(true)
        }
    }
    const toggleProps = { id: btnId, ref: setTarget, onClick: onMenuClick, className: cx(className, 'dropdown-toggler') }
    const menuToggle = isMobile ? (
        <Icon icon="list"
            {...toggleProps}
            height={30}
            color="white"
        />
    ) : (
        <div css={{ color: 'white', alignSelf: 'center', cursor: 'pointer' }} {...toggleProps}>Hi {userInfo?.full_name}</div>
    )

    return (
        <Box className="dropdown">
            {menuToggle}
            <div
                className={cx('dropdown-menu', menuClassName, {
                    show: isOpen,
                })}
                ref={setPopover}
                style={styles.popper}
                {...attributes.popper}
                css={{ zIndex: 1100 }}
                aria-labelledby={btnId}
            >
                {children}
            </div>
        </Box >
    )
}
