import React from 'react'
import { BackgroundImage, Badge, Container, Grid, Group, List, Stack, Text, Title } from '@mantine/core';
import { colors } from '@theme';
import SyllabusContestBackground from './syllabus-contest-background.svg'
import { StudyCard } from './card';
import { useLearnerStudies } from './studies';
import { useCallback, useNavigate } from '@common';
import { ParticipantStudy } from '@api';

export const SyllabusContest: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const completedCount = studies.filter(s => !!s.completedAt).length
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
        </BackgroundImage>
    )
}

export const ContestInfo: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const completedCount = studies.filter(s => !!s.completedAt).length

    return (
        <Stack c='white'>
            <Title order={6}>November Contest</Title>
            <Title order={2}>Join Our Syllabus Contest for a Chance to Win AirPods Pro!</Title>
            <Group gap='sm'>
                <Text>You have</Text>
                <Badge c={colors.text} size='lg' color={colors.gray50}>{completedCount}/{studies.length} Completed</Badge>
            </Group>
            <Text c={colors.gray70}>Steps:</Text>
            <List c={colors.gray50}>
                <List.Item>Complete both surveys</List.Item>
                <List.Item>Automatically entered into prize giveaway</List.Item>
                <List.Item>Next winner announced on: TODO: dynamic date</List.Item>
                <List.Item>Come back next month for another chance to win!</List.Item>
            </List>
        </Stack>
    )
}

export const ContestCards: FC<{ studies: ParticipantStudy[] }> = ({ studies }) => {
    const nav = useNavigate()
    const onStudySelect = useCallback((s: ParticipantStudy) => nav(`/studies/details/${s.id}`), [nav])

    if (!studies.length) return null
    return (
        <Group>
            {studies.map((study) => {
                return (
                    <StudyCard key={study.id} onSelect={onStudySelect} study={study} />
                )
            })}
        </Group>
    )
}
