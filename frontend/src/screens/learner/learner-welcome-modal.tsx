import React, { useState } from 'react'
import { Anchor, Box, Button, Checkbox, Flex, Group, Image, Modal, Stack, Text, Title } from '@mantine/core';
import { useIsMobileDevice, useUpdateUserPreferences, useUserPreferences } from '@lib';
import Greeting from '@images/welcome-banner/welcome-greeting.svg';
import Success from '@images/welcome-banner/welcome-success.svg';
import { colors } from '@theme';
import { useParticipantStudies } from './studies';
import { CompactStudyCard } from '../../components/study/compact-study-card';

export const LearnerWelcomeModal: FC = () => {
    const [open, setOpen] = useState(true)
    const { data: preferences, isLoading } = useUserPreferences()
    const updatePreferences = useUpdateUserPreferences()
    const [step, setStep] = useState(0)
    const isMobile = useIsMobileDevice()

    if (preferences?.hasViewedWelcomeMessage || isLoading) {
        return null
    }

    const onClose = async () => {
        updatePreferences.mutate({ updatePreferences: { preferences: { hasViewedWelcomeMessage: true } } }, {
            onSuccess: () => setOpen(false),
        })
    }

    return (
        <Modal closeOnClickOutside={false}
            closeOnEscape={false}
            opened={open}
            onClose={onClose}
            size='85%'
            centered
            fullScreen={isMobile}
            withCloseButton={step == 1}
        >
            {step == 0 ? <WelcomeStep setStep={setStep} /> : <EarnStep onClose={onClose} />}
        </Modal>
    )
}

const WelcomeStep: FC<{
    setStep: (step: number) => void}
> = ({ setStep }) => {
    const [agreed, setAgreed] = useState(false)
    const isMobile = useIsMobileDevice()

    return (
        <Flex m={isMobile ? '1rem' : '4rem'} gap='5rem' direction={isMobile ? 'column-reverse' : 'row'}>
            <Box style={{ flex: 1, alignContent: 'center' }}>
                <Image src={Greeting} />
            </Box>

            <Stack gap='xl' style={{ flex: 2 }}>
                <Title order={1} c='purple'>
                    Welcome to OpenStax Kinetic
                </Title>

                <Title order={5} c={colors.text}>
                    Participate in educational research and be ahead of the game when it comes to understanding yourself and your learning techniques. Earn points, recognition badges, and the opportunity to connect with learning experts.
                </Title>

                <Checkbox color='purple'
                    onChange={(event) => setAgreed(event.currentTarget.checked)}
                    label={
                        <Text c={colors.text} fw='500'>
                            <Text span>I agree to Openstax Kinetic </Text>
                            <Anchor href="https://openstax.org/accounts/terms/1" target="_blank" inherit>
                                Terms of Use
                            </Anchor>
                            <Text span> and </Text>
                            <Anchor href="https://openstax.org/privacy-policy" target="_blank" inherit>
                                Privacy Notice
                            </Anchor>
                        </Text>
                    }
                />

                <Box>
                    <Button color='purple' disabled={!agreed} onClick={() => setStep(1)}>
                        Continue
                    </Button>
                </Box>
            </Stack>
        </Flex>
    )
}

const EarnStep: FC<{onClose: () => void}> = ({ onClose }) => {
    const { welcomeStudies } = useParticipantStudies()
    const updatePreferences = useUpdateUserPreferences()

    const onClick = async () => {
        updatePreferences.mutate({ updatePreferences: { preferences: { hasViewedWelcomeMessage: true } } }, {})
        onClose()
    }

    const isMobile = useIsMobileDevice()

    return (
        <Flex m={isMobile ? '1rem' : '4rem'} gap='5rem' direction={isMobile ? 'column' : 'row'}>
            <Box style={{ flex: 1, alignContent: 'center' }}>
                <Image maw={300} src={Success} />
            </Box>

            <Stack gap='xl' style={{ flex: 2 }} mb='xl'>
                <Title order={1} c='purple'>
                    Earn your first 10 points!
                </Title>

                <Title order={5} c={colors.text}>
                    Take a Kinetic study and discover its learning benefits. Plus, earn recognition badges and unlock access to additional learning rewards.
                </Title>

                <Group>
                    {welcomeStudies.map((study, index) => (
                        <Flex key={study.titleForParticipants}
                            align='center'
                            direction={{ md: 'row', base: 'column' }}
                            gap='md'
                        >
                            <CompactStudyCard study={study} onClick={onClick}/>
                            {(index !== welcomeStudies.length - 1) && <Text fw='bolder' c={colors.gray70} size='xl'>OR</Text>}
                        </Flex>
                    ))}
                </Group>
            </Stack>
        </Flex>
    )
}
