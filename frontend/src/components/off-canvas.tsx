import { React, cx, useCallback, useState, useMemo, useEffect } from '@common'
import { Icon, Box } from '@components'
import { useEventListenerRef, useForkRef } from 'rooks'
import BSOffcanvas from 'bootstrap/js/dist/offcanvas'
import { uniqueId } from 'lodash-es'

const useOffCanvas = ({ show, onHide }: { show: boolean, onHide?(): void }) => {
    const [isVisible, setVisible] = useState(false)
    const [bs, setBs] = useState<BSOffcanvas | null>(null)
    const cbRef = useCallback((el: HTMLElement | null) => {
        if (!el) return
        const bs = BSOffcanvas.getOrCreateInstance(el)
        bs
        setBs(bs)
    }, [setBs])

    const close = useCallback(() => {
        setVisible(false)
    }, [setVisible])

    useEffect(() => {
        setVisible(show)
    }, [show])

    useEffect(() => {
        if (!bs) return
        isVisible ? bs.show() : bs.hide()
    }, [bs, isVisible])

    const eventRef = useEventListenerRef('hidden.bs.offcanvas', () => onHide?.())
    const ref = useForkRef(cbRef, eventRef)
    return useMemo(() => ({
        ref,
        show,
        close,
    }), [ref, show])
}

interface OffCanvasProps {
    show: boolean
    title?: React.ReactNode
    className?: string
    onHide?(): void
}

export const OffCanvas: React.FC<OffCanvasProps> = ({ show, onHide, className, children, title }) => {
    const { ref, close } = useOffCanvas({ show, onHide })
    const id = useMemo(() => uniqueId('off-canvas'), [])
    return (
        <div
            ref={ref}
            className={cx('offcanvas', 'offcanvas-end', className)}
            tabIndex={-1}
            aria-labelledby={id}
        >
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id={id}>{title}</h5>
                <Icon icon="close" onClick={close} />
            </div>
            <Box className="offcanvas-body" direction="column">
                {children}
            </Box>
        </div>
    )
}

