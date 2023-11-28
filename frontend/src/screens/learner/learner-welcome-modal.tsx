import React, { useState } from 'react'
import { Button, Modal, Stack, Text, Title } from '@mantine/core';
import { colors } from '@theme';
import { useNavigate } from 'react-router-dom';
import { noop } from 'lodash-es';
import { useApi, useUserPreferences } from '@lib';
import { ParticipantStudy } from '@api';
import Waves from './waves.svg';

export const LearnerWelcomeModal: FC<{
    demographicSurvey: ParticipantStudy | null,
    completedCount: number
}> = ({ demographicSurvey, completedCount }) => {
    const [open, setOpen] = useState(true)
    const nav = useNavigate()
    const api = useApi()
    const { data: preferences, refetch } = useUserPreferences()
    // api.updatePreferences({ updatePreferences: { preferences: { hasViewedWelcomeMessage: false } } })
    if (!demographicSurvey || preferences?.hasViewedWelcomeMessage || completedCount > 0) return null

    const onContinue = async () => {
        setOpen(false)
        await api.updatePreferences({ updatePreferences: { preferences: { hasViewedWelcomeMessage: true } } }).then(() => {
            refetch().then(() => {
                setOpen(false)
                nav(`/studies/details/${demographicSurvey.id}`)
            })
        })
    }

    return (
        <Modal centered opened={open} onClose={noop} closeOnEscape={false} closeOnClickOutside={false} withCloseButton={false} size='75%' styles={{
            content: {
                backgroundImage: `url(${Waves})`,
                backgroundSize: 'cover',
            },
        }}>
            <Modal.Body p='xl'>
                <Stack justify='center' align='center' gap='xl' c='white'>
                    <Title order={2}>Welcome to OpenStax Kinetic!</Title>
                    <Text ta='center'>
                        Take part in the latest learning research for free at the comfort of your home. With each study, you will gather more insight about yourself as a person and student, and understand the learning techniques that work best for you.
                    </Text>
                    <Text ta='center'>
                        <strong>Bonus:</strong> Earn points with each study and join thousands of learners in exciting monthly prize draws!
                    </Text>
                    {/* TODO Insert text copy and button text updates from debshila/iris */}
                    <Button c={colors.purple} color={colors.white} onClick={onContinue}>
                        Let's go!
                    </Button>
                </Stack>
            </Modal.Body>
        </Modal>
    )
}
