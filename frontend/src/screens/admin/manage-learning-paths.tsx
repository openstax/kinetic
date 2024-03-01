import React, { useEffect, useState } from 'react';
import { useCreateLearningPath, useGetLearningPaths, useUpdateLearningPath } from '../../models/learning-path';
import { Button, Group, LoadingOverlay, MultiSelect, Select, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { Main } from './grid';
import { LearningPath } from '@api';
import * as yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { useUpdateFeaturedStudies } from '@models';

export const ManageLearningPaths = () => {
    const { data: learningPaths, isLoading } = useGetLearningPaths()
    const [selectedLearningPath, setSelectedLearningPath] = useState<string | null>('');

    if (isLoading) return <LoadingOverlay visible={true} />

    const options = learningPaths?.map(lp => lp.label || '') || []
    const currentLearningPath = learningPaths?.find(lp => lp.label == selectedLearningPath)

    return (
        <Main className="container py-2">
            <Title order={4}>Manage learning paths</Title>
            <Stack>
                <Select data={[...new Set(options)]}
                    value={selectedLearningPath}
                    clearable={true}
                    onChange={setSelectedLearningPath}
                    placeholder='Select a learning path, or create a new one below'
                />

                {currentLearningPath ?
                    <EditLearningPath setSelectedLearningPath={setSelectedLearningPath} learningPaths={learningPaths} learningPath={currentLearningPath} /> :
                    <CreateLearningPath setSelectedLearningPath={setSelectedLearningPath} learningPaths={learningPaths} />
                }

                {currentLearningPath && <EditFeaturedStudies learningPath={currentLearningPath} />}
            </Stack>
        </Main>
    )
}

const EditFeaturedStudies: FC<{learningPath: LearningPath}> = ({ learningPath }) => {
    const updateFeaturedStudies = useUpdateFeaturedStudies()

    const [featuredStudies, setFeaturedStudies] = useState<string[]>([]);

    useEffect(() => {
        setFeaturedStudies(
            learningPath.studies?.reduce<string[]>((filtered, study) => {
                if (study.isFeatured && study.titleForParticipants) filtered.push(study.titleForParticipants)
                return filtered
            }, []) || []
        )
    }, [learningPath]);

    const studyTitles = learningPath.studies?.reduce<string[]>((filtered, study) => {
        if (study.titleForParticipants) filtered.push(study.titleForParticipants)
        return filtered
    }, []) || []

    if (!learningPath.studies) return <Title order={4}>Learning path has no studies</Title>

    const onUpdate = () => {
        const featuredIds = learningPath.studies?.reduce<number[]>((prev, study) => {
            if (study.titleForParticipants && featuredStudies.includes(study.titleForParticipants)) prev.push(study.id)
            return prev
        }, [])

        const nonFeaturedIds = learningPath.studies?.reduce<number[]>((prev, study) => {
            if (study.titleForParticipants && !featuredStudies.includes(study.titleForParticipants)) prev.push(study.id)
            return prev
        }, [])

        updateFeaturedStudies.mutate({
            featuredIds: featuredIds,
            nonFeaturedIds: nonFeaturedIds,
        })
    }

    return (
        <Stack>
            <MultiSelect
                label={`Featured studies for ${learningPath.label}`}
                searchable
                placeholder="Select studies to feature"
                value={featuredStudies}
                onChange={setFeaturedStudies}
                data={[...new Set(studyTitles)]}
            />
            <Group justify="flex-end" mt="md">
                <Button onClick={onUpdate}>
                    Update featured studies
                </Button>
            </Group>
        </Stack>
    )
}

const getLearningPathValidationSchema = (learningPaths?: LearningPath[]) => {
    if (!learningPaths) return yup.object()

    return yup.object().shape({
        label: yup.string().required().test(
            'Unique',
            'Label must be unique',
            (value: string) => {
                if (!learningPaths.length) {
                    return true
                }
                return learningPaths.every(lp => lp.label?.toLowerCase().trim() !== value?.toLowerCase().trim())
            }
        ),
        description: yup.string().required(),
    })
}

const CreateLearningPath: FC<{
    learningPaths?: LearningPath[],
    setSelectedLearningPath: (label: string) => void,
}> = ({ learningPaths, setSelectedLearningPath }) => {
    const form = useForm<LearningPath>({
        initialValues: {
            label: '',
            description: '',
        },
        validate: yupResolver(getLearningPathValidationSchema(learningPaths)),
        validateInputOnChange: true,
    })

    const createLearningPath = useCreateLearningPath()

    const handleSubmit = form.onSubmit((values) => {
        createLearningPath.mutate({
            learningPath: values,
        }, {
            onSuccess: () => {
                if (values.label) {
                    setSelectedLearningPath(values.label)
                }
                form.reset()
            },
        })
    })

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack>
                    <TextInput
                        withAsterisk
                        label="Label"
                        error={form.errors['label']}
                        {...form.getInputProps('label')}
                    />

                    <Textarea
                        withAsterisk
                        label="Description"
                        error={form.errors['description']}
                        {...form.getInputProps('description')}
                    />
                </Stack>

                <Group justify="flex-end" mt="md">
                    <Button type="submit" disabled={!form.isValid()}>
                        Create Learning Path
                    </Button>
                </Group>
            </form>
        </>
    )
}

const EditLearningPath: FC<{
    learningPath?: LearningPath,
    learningPaths?: LearningPath[],
    setSelectedLearningPath: (label: string) => void,
}> = ({ learningPath, learningPaths, setSelectedLearningPath }) => {
    const form = useForm<LearningPath>({
        initialValues: {
            label: learningPath?.label || '',
            description: learningPath?.description || '',
        },
        validate: yupResolver(getLearningPathValidationSchema(learningPaths?.filter(lp => lp.id !== learningPath?.id))),
        validateInputOnChange: true,
    })

    const updateLearningPath = useUpdateLearningPath()

    const handleSubmit = form.onSubmit((values) => {
        if (!learningPath?.id) return
        updateLearningPath.mutate({
            id: learningPath.id,
            updateLearningPath: { learningPath: {
                ...learningPath,
                ...values,
            } },
        }, {
            onSuccess: () => {
                if (values.label) {
                    setSelectedLearningPath(values.label)
                }
            },
        })
    })

    return (
        <form onSubmit={handleSubmit}>
            <Stack>
                <TextInput
                    withAsterisk
                    label="Label"
                    error={form.errors['label']}
                    {...form.getInputProps('label')}
                />

                <Textarea
                    withAsterisk
                    label="Description"
                    error={form.errors['description']}
                    {...form.getInputProps('description')}
                />
            </Stack>

            <Group justify="flex-end" mt="md">
                <Button type="submit" disabled={!form.isDirty() || !form.isValid()}>
                    Update Learning Path
                </Button>
            </Group>
        </form>
    )
}
