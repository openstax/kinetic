import React, { useEffect, useState } from 'react';
import { Button, Group, LoadingOverlay, MultiSelect, Stack, Title } from '@mantine/core';
import { Main } from './grid';
import { useAdminGetStudies, useUpdateHighlightedStudies } from '@models';

export const ManageHighlightedStudies = () => {
    const { data: studies, isLoading } = useAdminGetStudies('active')
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

    if (isLoading) return <LoadingOverlay visible={true} />

    const options = studies?.map(study => study.titleForParticipants || '') || []

    const onUpdate = () => {
        const highlightedIds = studies?.reduce<number[]>((prev, study) => {
            if (study.titleForParticipants && highlightedStudies?.includes(study.titleForParticipants)) prev.push(study.id)
            return prev
        }, [])

        updateHighlightedStudies.mutate({ highlightedIds })
    }

    return (
        <Main className="container py-2">
            <Title order={4}>Manage learning paths</Title>
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
        </Main>
    )
}
