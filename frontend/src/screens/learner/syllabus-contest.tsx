import React from 'react'
import { BackgroundImage, Badge, Box, Container, Grid, Group, List, Stack, Text, Title } from '@mantine/core';
import { Tag } from './card';
import SyllabusContestBackground from './syllabus-contest-background.svg'
import { styled } from '@common';
import { colors } from '@theme';

export const SyllabusContest: FC<{}> = () => {
    return (
        <BackgroundImage src={SyllabusContestBackground}>

            {/* TODO SVG background */}
            <Container size='xl' c='white' py='4rem' >
                <Grid grow>
                    <Grid.Col span={4}>
                        <ContestInfo />
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <ContestCards />
                    </Grid.Col>
                </Grid>
            </Container>
        </BackgroundImage>
    )
}

export const ContestInfo: FC<{}> = () => {
    return (
        <Stack>
            <Title order={6}>November Contest</Title>
            <Title order={2}>Join Our Syllabus Contest for a Chance to Win AirPods Pro!</Title>
            <Group gap='sm'>
                <Text>You have</Text>
                <Badge c={colors.text} size='lg' color={colors.gray50}>0/2 Completed</Badge>
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

export const ContestCards: FC<{}> = () => {
    return (
        <Group>
            {/* Card images */}
        </Group>
    )
}
