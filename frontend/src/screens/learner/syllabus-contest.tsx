import React, { useState } from 'react'
import {
    BackgroundImage,
    Badge,
    Button,
    Container,
    Grid,
    Group,
    Image,
    List,
    Modal,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip,
} from '@mantine/core';
import { colors } from '@theme';
import SyllabusContestBackground from './syllabus-contest-background.svg'
import { StudyCard } from './card';
import { useCallback, useNavigate } from '@common';
import { ParticipantStudy } from '@api';
import dayjs from 'dayjs';
import { IconInfoCircleFilled } from '@tabler/icons-react';
import EmailSent from '@images/email-sent.svg'
import { useLocalStorage } from '@mantine/hooks';

export const useSyllabusContestDates = () => {
    const isContestActive = dayjs().isBetween(
        dayjs(),
        '2023-12-04',
        'day',
        '[]'
    ) || dayjs().isBetween(
        '2024-02-01',
        '2024-05-08',
        'day',
        '[]'
    )

    const nextPrizeDate = dayjs().add(1, 'month').set('date', 1)

    return { isContestActive, nextPrizeDate }
}

export const SyllabusContest: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const { isContestActive } = useSyllabusContestDates()
    if (!isContestActive) return null

    return (
        <BackgroundImage src={SyllabusContestBackground}>
            <Container size='xl' py='5rem' >
                <Grid gutter='xl'>
                    <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                        <ContestInfo studies={studies} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                        <ContestCards studies={studies} />
                    </Grid.Col>
                </Grid>
            </Container>
            <PrizeCycleEnded />
        </BackgroundImage>
    )
}

export const ContestInfo: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const { nextPrizeDate } = useSyllabusContestDates()
    const showComeBackMessage = nextPrizeDate.month() == 2 || nextPrizeDate.month() == 3
    return (
        <Stack c='white'>
            <Title order={6}>{dayjs().format('MMMM')} Contest</Title>
            <Title order={2}>Join Our Syllabus Contest for a Chance to Win AirPods Pro!</Title>
            <Text c={colors.gray70}>Steps:</Text>
            <List c={colors.gray50}>
                <List.Item>Complete both surveys</List.Item>
                <List.Item>Automatically entered into prize giveaway</List.Item>
                <List.Item style={{ verticalAlign: 'middle' }}>
                    Next winner announced on: {nextPrizeDate.format('LL')}

                    <Tooltip withArrow label="Contest ends on December 1, 2023 and restarts on February 1, 2024">
                        <ThemeIcon radius='lg' size='sm' c={colors.gray70}>
                            <IconInfoCircleFilled></IconInfoCircleFilled>
                        </ThemeIcon>
                    </Tooltip>
                </List.Item>
                {showComeBackMessage && <List.Item>Come back next month for another chance to win!</List.Item>}
            </List>
            <CompletedCountBadge studies={studies} />
        </Stack>
    )
}

const CompletedCountBadge: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const completedCount = studies.filter(s => !!s.completedAt).length

    if (completedCount == 2) {
        return (
            <Group gap='sm'>
                <Text>You've entered the draw</Text>
                <Badge c='white' size='lg' color='purple'>
                    {completedCount}/{studies.length} Completed
                </Badge>
            </Group>
        )
    }
    return (
        <Group gap='sm'>
            <Text>You have</Text>
            <Badge c={colors.text} size='lg' color={colors.gray50}>
                {completedCount}/{studies.length} Completed
            </Badge>
        </Group>
    )
}

export const ContestCards: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const nav = useNavigate()
    const onStudySelect = useCallback((s: ParticipantStudy) => nav(`/studies/details/${s.id}`), [nav])

    if (!studies.length) return null
    return (
        <Group>
            {studies.map((study) => (
                <StudyCard key={study.id} onSelect={onStudySelect} study={study} />
            ))}
        </Group>
    )
}

export const PrizeCycleEnded: FC = () => {
    const [viewed, setViewed] = useLocalStorage({ key: 'viewedSyllabusContestResults', defaultValue: false })
    const [open, setOpen] = useState(!!viewed)

    const onClose = () => {
        setOpen(false)
        setViewed(true)
    }

    return (
        <Modal size='75%' centered opened={open} onClose={onClose} data-testid='syllabus-contest-winners-modal'>
            <Stack gap='xl' my='2rem' mx='4rem' align='center'>
                <Image w='30rem' h='10rem' src={EmailSent} alt='email-sent'/>
                <Text ta='center'>
                    This month’s contest prize winner has been selected! We’ll reach out via email - so be sure to keep an eye out. Good luck!
                </Text>
                <Button w='15rem' color='purple' c='white' onClick={onClose} data-testid='return-to-dashboard'>
                    Return to Dashboard
                </Button>
            </Stack>
        </Modal>
    )
}