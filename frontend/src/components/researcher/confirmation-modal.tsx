import { Modal, ResearcherButton } from '@components';
import { Box, React } from '@common';
import { ReactNode } from 'react';

export const ConfirmationModal: FCWC<{
    onCancel: Function,
    onConfirm: Function,
    show: boolean,
    setShow: Function,
    header?: ReactNode,
    cancelText?: ReactNode,
    confirmText?: ReactNode
}> = ({
    onCancel,
    onConfirm,
    children,
    show,
    setShow,
    header,
    cancelText,
    confirmText,
}) => {
    return (
        <Modal
            center
            show={show}
            large
            onHide={() => setShow(false)}
        >
            <Modal.Body>
                <Box padding='4rem' align='center' justify='center' direction='column' gap='large'>
                    {header && <Box gap='large' align='center'>
                        {header}
                    </Box>}
                    <Box align='center' direction='column'>
                        {children}
                    </Box>
                    <Box gap='large'>
                        <ResearcherButton
                            fixedWidth
                            onClick={onCancel()}
                            buttonType='secondary'
                        >
                            {cancelText}
                        </ResearcherButton>

                        <ResearcherButton fixedWidth onClick={onConfirm()}>
                            {confirmText}
                        </ResearcherButton>
                    </Box>
                </Box>
            </Modal.Body>
        </Modal>
    )
}
