import React, { useState } from 'react'
import { Anchor, Button, Modal, Stack, Text, Title } from '@mantine/core';
import { colors } from '@theme';
import { useApi, useUserPreferences } from '@lib';
import { ParticipantStudy } from '@api';
import Waves from '@images/waves.svg';
import { useLaunchStudyUrl } from '@models';

export const LearnerWelcomeModal: FC<{
    demographicSurvey: ParticipantStudy | null
}> = ({ demographicSurvey }) => {
    const [open, setOpen] = useState(true)
    const api = useApi()
    const { data: preferences, refetch } = useUserPreferences()
    const launchUrl = useLaunchStudyUrl(demographicSurvey?.id)

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
                        {launchUrl &&
                            <Anchor href={launchUrl} target='_blank'>
                                <Button
                                    c={colors.purple}
                                    color={colors.white}
                                    w='100%'
                                    data-testid="launch-study"
                                    onClick={onClose}
                                >
                                    Finish Profile (10pts)
                                </Button>
                            </Anchor>
                        }
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}
