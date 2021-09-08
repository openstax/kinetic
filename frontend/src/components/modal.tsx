import { React, cx } from '../common'
import OverlayModal, { ModalProps as OverlayModalProps } from 'react-overlays/Modal'
import { Icon } from './icon'

const renderBackdrop = (props: any) => {
    return <div className="modal-backdrop fade show" {...props} />
}

interface ModalProps extends OverlayModalProps {
    className?: string
    title?: React.ReactNode
    header?: React.ReactNode
    show?: boolean
    onHide?: () => void
    xlarge?: boolean
    scrollable?: boolean
    large?: boolean
    small?: boolean
    closeBtn?: boolean
}


interface ModalI extends React.FC<ModalProps> {
    Header: React.FC<ModalPartProps>,
    Body: React.FC<ModalPartProps>,
    Footer: React.FC<ModalPartProps>,
}

const Modal: ModalI = ({
    className, header, children, show, title, onHide, xlarge, large, small,
    scrollable = true,
    closeBtn = true,
    ...props
}) => {
    return (
        <OverlayModal
            {...props}
            show={show}
            containerClassName="model-open"
            className={cx(className, 'modal', 'fade', {
                show,
            })}
            style={{ display: 'block', pointerEvents: 'none', overflow: scrollable ? '' : 'auto' }}
            renderBackdrop={renderBackdrop}
            onBackdropClick={onHide}
        >
            <div className={cx('modal-dialog', {
                'modal-dialog-scrollable': scrollable,
                'modal-xl': xlarge,
                'modal-lg': large,
                'modal-small': small,

            })}>
                <div className="modal-content">
                    {header && header}
                    {title && (
                        <Modal.Header>
                            <h5 className="modal-title">{title}</h5>
                            {closeBtn && <Icon data-test-id="modal-close-btn" icon="close" onClick={onHide} />}
                        </Modal.Header>
                    )}
                    {children}
                </div>
            </div>
        </OverlayModal>
    )
}

interface ModalPartProps {
    className?: string
}

const Header: React.FC<ModalPartProps> = (props) => <div {...props} className={cx('modal-header', props.className)} />
Modal.Header = Header

const Body: React.FC<ModalPartProps> = (props) => <div {...props} className={cx('modal-body', props.className)} />
Modal.Body = Body

const Footer: React.FC<ModalPartProps> = (props) => <div {...props} className={cx('modal-footer', props.className)} />
Modal.Footer = Footer

export { Modal }
