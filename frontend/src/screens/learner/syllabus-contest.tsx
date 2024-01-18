import React from 'react'
import {
    BackgroundImage,
    Badge,
    Container,
    Grid,
    Group,
    List,
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

const isContestActive = dayjs().isBetween(
    '2024-02-01',
    '2024-05-01',
    'day',
    '[)'
)

export const useSyllabusContestDates = () => {
    const nextPrizeDate = dayjs().add(1, 'month').set('date', 1)

    return { isContestActive, nextPrizeDate }
}

export const SyllabusContest: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const { isContestActive } = useSyllabusContestDates()
    if (!isContestActive || !studies.length) return null

    return (
        <BackgroundImage src={SyllabusContestBackground}>
            <Container py='4rem' >
                <Grid gutter='xl'>
                    <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 6, xl: 4 }}>
                        <ContestInfo studies={studies} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 6, xl: 8 }}>
                        <ContestCards studies={studies} />
                    </Grid.Col>
                </Grid>
            </Container>
        </BackgroundImage>
    )
}

const getContestTooltipMessage = () => {
    const month = dayjs().month()
    // November
    if (month == 10) {
        return 'Contest ends on November 30, 2023 and restarts on February 1, 2024'
    }
    if (month == 1) {
        return 'Contest ends on February 29, 2024 and restarts on March 1, 2024'
    }
    if (month == 2) {
        return 'Contest ends on March 31, 2024 and restarts on April 1, 2024'
    }

    return 'Contest ends on April 30, 2024'
}

export const ContestInfo: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const { nextPrizeDate } = useSyllabusContestDates()
    const showComeBackMessage = nextPrizeDate.month() == 2 || nextPrizeDate.month() == 3
    return (
        <Stack c='white' gap='lg'>
            <Title order={6}>{dayjs().format('MMMM')} Contest</Title>
            <Title order={2}>Join Our Syllabus Contest for a Chance to Win AirPods Pro!</Title>
            <Text>Steps:</Text>
            <List withPadding>
                <List.Item>Complete both surveys</List.Item>
                <List.Item>Automatically entered into prize draw</List.Item>
                <List.Item>
                    Winner announced on {nextPrizeDate.format('LL')}

                    <Tooltip visibleFrom='xs' withArrow label={getContestTooltipMessage()}>
                        <ThemeIcon bg='transparent'>
                            <IconInfoCircleFilled size='18px'></IconInfoCircleFilled>
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

    return (
        <Group>
            {studies.map((study) => (
                <StudyCard key={study.id} onSelect={onStudySelect} study={study} />
            ))}
        </Group>
    )
}
