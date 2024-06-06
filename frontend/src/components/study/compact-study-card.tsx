import { Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import React from 'react';
import { ParticipantStudy } from '@api';
import { colors } from '@theme';
import { getLastCompletedStage, getNextAvailableStage, isMultiSession, isStudyLaunchable, launchStudy } from '@models';
import { IconCheck } from '@tabler/icons-react';
import { useApi } from '@lib';
import dayjs from 'dayjs';

export const CompactStudyCard: FC<{
    study: ParticipantStudy,
    onClick?: () => void
}> = ({ study, onClick }) => {
    const api = useApi()
    const canLaunch = isStudyLaunchable(study)
    const multiSession = isMultiSession(study)
    const launch = async () => {
        if (!canLaunch) return
        onClick?.()
        await launchStudy(api, study.id)
    }

    return (
        <Stack w={225}
            h={225}
            p='sm'
            justify='space-between'
            className={`compact-study-card ${canLaunch ? 'launchable' : ''}`}
            onClick={launch}
            style={{
                position: 'relative',
                border: `1px solid ${colors.purple}`,
                borderRadius: 4,
                cursor: canLaunch ? 'pointer' : 'inherit',
                backgroundColor: canLaunch ? 'inherit' : colors.gray30,
                boxShadow: !multiSession ? 'inherit' :
                    `10px 10px ${colors.gray30}, 10px 10px 0 2px ${colors.gray70}`,
            }}
        >
            <Completed study={study} />
            <Stack gap='xs'>
                <Title order={5} c='purple' textWrap='wrap'>
                    {study.titleForParticipants}
                </Title>

                <Description study={study} />
            </Stack>

            <Points study={study} />
        </Stack>
    )
}

const Points: FC<{study: ParticipantStudy}> = ({ study }) => {
    const nextStage = getNextAvailableStage(study)
    if (!nextStage) return null

    return (
        <Group c='purple' justify='space-between'>
            <Group>
                <Text size='xs'>{nextStage.durationMinutes} min | {nextStage.points} pts</Text>
            </Group>

            {isMultiSession(study) &&
                <Text size='xs'>
                    Session {nextStage?.order! + 1}/{study.stages?.length}
                </Text>
            }
        </Group>
    )
}

const Description: FC<{study: ParticipantStudy}> = ({ study }) => {
    const nextStage = getNextAvailableStage(study)
    const lastCompletedStage = getLastCompletedStage(study)

    if (!isStudyLaunchable(study) && !study.completedAt) {
        const availableOn = dayjs(lastCompletedStage?.completedAt)
            .add(nextStage?.availableAfterDays || 0, 'days')
            .format('MMMM D, YYYY')
        return (
            <Text size='sm' c='red'>
                Session {nextStage?.order! + 1} of this study is available on {availableOn}
            </Text>
        )
    }

    return (
        <Text size='sm' c={colors.text}>
            {study.shortDescription}
        </Text>
    )
}

const Completed: FC<{study: ParticipantStudy}> = ({ study }) => {
    if (!study.completedAt) return null
    return (
        <ThemeIcon radius='xl' size='lg' style={{
            backgroundColor: colors.pine,
            position: 'absolute',
            right: -15,
            top: -15,
        }}>
            <IconCheck />
        </ThemeIcon>
    )
}
