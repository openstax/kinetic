import React, { useEffect, useState } from 'react';
import { Button, Group, LoadingOverlay, MultiSelect, Stack, Title } from '@mantine/core';
import { Main } from './grid';
import { useAdminGetStudies, useUpdateHighlightedStudies, useUpdateWelcomeStudies } from '@models';
import { Study } from '@api';

export const ManageStudies = () => {
    const { data: studies = [], isLoading } = useAdminGetStudies('active')

    if (isLoading) return <LoadingOverlay visible={true} />

    return (
        <Main className="container py-2">
            <ManageHighlightedStudies studies={studies} />
            <ManageWelcomeStudies studies={studies} />
        </Main>
    )
}

const ManageHighlightedStudies: FC<{studies: Study[]}> = ({ studies }) => {
    const [highlightedStudies, setHighlightedStudies] = useState<string[]>()
    const updateHighlightedStudies = useUpdateHighlightedStudies()

    useEffect(() => {
        setHighlightedStudies(
            studies?.reduce<string[]>((filtered, study) => {
                if (study.isHighlighted && study.titleForParticipants) filtered.push(study.titleForParticipants)
                return filtered
            }, []) || []
        )
    }, [studies]);

    const options = studies?.map(study => study.titleForParticipants || '') || []

    const onUpdate = () => {
        const highlightedIds = studies?.reduce<number[]>((prev, study) => {
            if (study.titleForParticipants && highlightedStudies?.includes(study.titleForParticipants)) prev.push(study.id)
            return prev
        }, [])

        updateHighlightedStudies.mutate({ highlightedIds })
    }

    return (
        <Stack>
            <Title order={4}>Manage highlighted studies</Title>
            <Stack>
                <MultiSelect
                    label='Highlighted Studies'
                    searchable
                    placeholder="Select studies to be highlighted"
                    value={highlightedStudies}
                    onChange={setHighlightedStudies}
                    data={[...new Set(options)]}
                />
                <Group justify="flex-end" mt="md">
                    <Button onClick={onUpdate}>
                        Set highlighted studies
                    </Button>
                </Group>
            </Stack>
        </Stack>
    )
}

export const ManageWelcomeStudies: FC<{studies: Study[]}> = ({ studies }) => {
    const [welcomeStudies, setWelcomeStudies] = useState<string[]>()
    const updateWelcomeStudies = useUpdateWelcomeStudies()

    useEffect(() => {
        setWelcomeStudies(
            studies?.reduce<string[]>((filtered, study) => {
                if (study.isWelcome && study.titleForParticipants) filtered.push(study.titleForParticipants)
                return filtered
            }, []) || []
        )
    }, [studies]);

    const options = studies?.map(study => study.titleForParticipants || '') || []

    const onUpdate = () => {
        const welcomeIds = studies?.reduce<number[]>((prev, study) => {
            if (study.titleForParticipants && welcomeStudies?.includes(study.titleForParticipants)) prev.push(study.id)
            return prev
        }, [])

        updateWelcomeStudies.mutate({ welcomeIds })
    }

    return (
        <Stack>
            <Title order={4}>Manage welcome studies</Title>
            <Stack>
                <MultiSelect
                    label='Welcome modal studies'
                    searchable
                    placeholder="Select studies for the welcome modal (max 2)"
                    value={welcomeStudies}
                    onChange={setWelcomeStudies}
                    maxValues={2}
                    data={[...new Set(options)]}
                />
                <Group justify="flex-end" mt="md">
                    <Button onClick={onUpdate}>
                        Set welcome studies
                    </Button>
                </Group>
            </Stack>
        </Stack>
    )
}
