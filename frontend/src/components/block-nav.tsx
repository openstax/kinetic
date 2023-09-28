import { Icon, Modal, Box, ResearcherButton, showResearcherNotification, useFormContext, useFormState } from '@components';
import { colors } from '@theme';
import ReactRouterPrompt from 'react-router-prompt'

export const BlockNavigationWhileFormDirty = () => {
    const { isDirty } = useFormState()
    console.log({ isDirty })
    return (
        <ReactRouterPrompt when={isDirty}>
            {({ isActive, onConfirm, onCancel }) => (
                <Modal
                    center
                    show={isActive}
                    onHide={onConfirm}
                >
                    <Modal.Body>
                        <Box padding='4rem' align='center' justify='center' direction='column' gap='large'>
                            <Box gap='large' align='center'>
                                <Icon height={20} icon="warning" color={colors.red} />
                                <span className='fs-4 fw-bold'>Exit Page</span>
                            </Box>
                            <Box align='center' direction='column'>
                                <span>You're about to leave this study creation process.</span>
                                <span>Would you like to save the changes you made thus far?</span>
                            </Box>
                        </Box>
                    </Modal.Body>
                </Modal>
            )}
        </ReactRouterPrompt>
    )
}
