import { Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import { ParticipantStudy } from '@api';
import { colors } from '@theme';
import { getStudyDuration, getStudyPoints, studyIsMultipart } from '@models';

export const CompactStudyCard: FC<{study: ParticipantStudy}> = ({ study }) => {
    return (
        <Stack w={200}
            h={200}
            p='sm'
            justify='space-between'
            style={{
                border: `2px solid ${colors.purple}`,
                borderRadius: 4,
            }}
        >
            <Stack gap='xs'>
                <Title order={5} c='purple'>
                    {study.titleForParticipants}
                </Title>

                <Text size='sm' c={colors.gray70}>
                    {study.shortDescription}
                </Text>
            </Stack>

            <Group c='purple'>
                {studyIsMultipart(study) && <Text span>*Total</Text>}
                <Text span>{getStudyDuration(study)} min</Text>
                &middot;
                <Text span>{getStudyPoints(study)} pts</Text>
            </Group>
        </Stack>
    )
}
