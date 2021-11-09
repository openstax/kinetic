import { React, cx, useState, useEffect  } from '@common'
import { useEventListenerRef, useForkRef, useRefElement } from 'rooks'
import { Icon, Box } from '@components'
import { Offcanvas as BSOffcanvas } from 'bootstrap'

export interface OffCanvasProps {
    isVisible?: boolean
    title: string
    onHide(): void
}

export const OffCanvas: React.FC<OffCanvasProps> = ({ children, title, isVisible, onHide }) => {
    const [bs, setBS] = useState<BSOffcanvas>()
    const [elRef, element] = useRefElement<HTMLElement>();
    const ref = useForkRef(elRef, useEventListenerRef('hide.bs.offcanvas', onHide))

    useEffect(() => {
        isVisible ? bs?.show() : bs?.hide()
    }, [isVisible])

    useEffect(() => {
        if (!element) return
        setBS(BSOffcanvas.getOrCreateInstance(element))
        return () => {
            bs?.dispose()
        }
    }, [element])
    
    return (
        <div
            className={cx('offcanvas', 'offcanvas-end')}
            tabIndex={-1}
            ref={ref}
            id="offcanvas"
            aria-labelledby={title}
        >
            <Box className="offcanvas-header" align="center">
                <h5 className="offcanvas-title" id="offcanvasLabel">{title}</h5>
                <Icon icon="close" data-bs-dismiss="offcanvas" aria-label="Close" />
            </Box>
            <div className="offcanvas-body">
                {children}
            </div>
        </div>

    )
}
