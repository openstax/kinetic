import React, { useState } from 'react'
import { Button, Modal, Stack, Text, Title } from '@mantine/core';
import { colors } from '@theme';
import { useApi, useUserPreferences } from '@lib';
import { ParticipantStudy } from '@api';
import Waves from '@images/waves.svg';
import { LaunchStudy } from '@models';

export const LearnerWelcomeModal: FC<{
    demographicSurvey: ParticipantStudy | null,
    completedCount: number
}> = ({ demographicSurvey, completedCount }) => {
    const [open, setOpen] = useState(true)
    const api = useApi()
    const { data: preferences, refetch } = useUserPreferences()

    if (!demographicSurvey || demographicSurvey.completedAt || preferences?.hasViewedWelcomeMessage) {
        return null
    }

    const onClose = async () => {
        await api.updatePreferences({ updatePreferences: { preferences: { hasViewedWelcomeMessage: true } } }).then(() => {
            refetch().then(() => {
                setOpen(false)
            })
        })
    }

    const onFinishProfile = async () => {
        await onClose()
        await LaunchStudy(api, demographicSurvey.id)
    }

    return (
        <Modal.Root opened={open} onClose={onClose} size='70%' centered>
            <Modal.Overlay />
            <Modal.Content >
                <Modal.Body style={{ backgroundImage: `url(${Waves}`, backgroundSize: 'cover' }} p='xl'>
                    <Modal.CloseButton variant='transparent' c='white' style={{ position: 'absolute', top: 5, right: 5 }} />
                    <Stack justify='center' align='center' gap='xl' c='white'>
                        <Title order={2}>Welcome to OpenStax Kinetic!</Title>
                        <Text ta='center'>
                            Participate in learning research and earn points towards exciting monthly prize draws!
                            With each participation, you will gather more insight about yourself, and understand the learning techniques that work best for you.
                        </Text>
                        <Text ta='center'>
                            <strong>Bonus:</strong> Take 5 minutes to finish your Kinetic profile and collect your first 10 points!
                        </Text>
                        <Button c={colors.purple} color={colors.white} onClick={onFinishProfile}>
                            Finish Profile (10pts)
                        </Button>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}
