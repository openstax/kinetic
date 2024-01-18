import { React } from '@common'
import { useFormState } from '@components';
import { colors } from '@theme';
import ReactRouterPrompt from 'react-router-prompt'
import { useBeforeUnload } from 'react-router-dom';
import { Button, Group, Modal, Stack, Title } from '@mantine/core';

export const ConfirmNavigationIfDirty = () => {
    const { isDirty } = useFormState()

    useBeforeUnload((event) => {
        if (isDirty) {
            event.preventDefault()
            event.returnValue = ''
        }
    })

    return (
        <ReactRouterPrompt when={isDirty}>
            {({ isActive, onConfirm, onCancel }) => (
                <Modal size='lg' centered zIndex={1040} opened={isActive} onClose={onCancel}>
                    <Stack p='4rem' align='center' gap='xl'>
                        <Title order={6}>
                            Changes you made may not be saved.
                        </Title>
                        <Group>
                            <Button w={180} variant="outline" color='blue' c={colors.blue} onClick={() => onCancel()}>
                                Cancel
                            </Button>
                            <Button w={180} color='blue' c='white' onClick={() => onConfirm()}>
                                Leave
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            )}
        </ReactRouterPrompt>
    )
}
