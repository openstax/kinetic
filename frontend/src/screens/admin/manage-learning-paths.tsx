import React, { useEffect, useState } from 'react';
import {
    useCreateLearningPath,
    useDeleteLearningPath,
    useGetLearningPaths,
    useUpdateLearningPath,
} from '../../models/learning-path';
import {
    Button,
    Group,
    LoadingOverlay,
    MultiSelect,
    NumberInput,
    Select,
    Stack,
    TagsInput,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { Main } from './grid';
import { LearningPath, Study } from '@api';
import * as yup from 'yup';
import { useForm, UseFormReturnType, yupResolver } from '@mantine/form';
import { useAdminGetStudies, useUpdateFeaturedStudies } from '@models';
import { sortBy } from 'lodash-es';
import { colors } from '@theme';

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
                    searchable
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

const ManageLearningPathStudies: FC<{
    learningPath: LearningPath,
    form: UseFormReturnType<LearningPath>
}> = ({ learningPath, form }) => {
    const [studies, setStudies] = useState<string[]>([]);

    const { data: allStudies = [] } = useAdminGetStudies()

    const studyTitles = allStudies.map(s => s.titleForParticipants!)

    useEffect(() => {
        if (learningPath.studies) {
            setStudies(learningPath.studies.map(s => s.titleForParticipants!))
        }
    }, [learningPath.studies])

    return (
        <Stack>
            <MultiSelect
                {...form.getInputProps('studies')}
                label={`Add studies to ${learningPath.label}`}
                searchable
                placeholder="Add studies to this learning path"
                value={studies}
                onChange={(selectedStudies) => {
                    setStudies(selectedStudies)

                    const mapped = selectedStudies.reduce<Study[]>((result, title) => {
                        const study = allStudies.find(s => s.titleForParticipants === title)
                        if (study) result.push(study)
                        return result
                    }, [])
                    form.setFieldValue('studies', mapped)
                }}
                nothingFoundMessage='No studies found'
                data={[...new Set(studyTitles)]}
            />
        </Stack>
    )
}

const EditFeaturedStudies: FC<{learningPath: LearningPath}> = ({ learningPath }) => {
    const updateFeaturedStudies = useUpdateFeaturedStudies()

    const [featuredStudies, setFeaturedStudies] = useState<string[]>([]);

    const studyTitles = sortBy(learningPath.studies, 'featuredOrder').reduce<string[]>((filtered, study) => {
        if (study.titleForParticipants) filtered.push(study.titleForParticipants)
        return filtered
    }, [])

    useEffect(() => {
        if (!learningPath || !learningPath.studies) return setFeaturedStudies([])
        const featured = sortBy(learningPath.studies, 'featuredOrder').reduce<string[]>((filtered, study) => {
            if (study.isFeatured && study.titleForParticipants) filtered.push(study.titleForParticipants)
            return filtered
        }, [])
        setFeaturedStudies(featured)
    }, [learningPath]);

    const onUpdate = () => {
        const featuredIds = featuredStudies.map(featuredStudy => {
            const study = learningPath.studies?.find(study => study.titleForParticipants == featuredStudy)
            return study?.id!
        })

        updateFeaturedStudies.mutate({ featuredIds: featuredIds })
    }

    if (!learningPath.studies) return <Title order={4}>Learning path has no studies</Title>

    return (
        <Stack>
            <MultiSelect
                label={`Featured studies for ${learningPath.label}`}
                searchable
                placeholder="Select studies to feature"
                value={featuredStudies}
                onChange={setFeaturedStudies}
                nothingFoundMessage='No studies found'
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
        label: yup.string().required(),
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
            badgeId: '',
            studies: [],
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
        <form onSubmit={handleSubmit}>
            <LearningPathForm form={form} />

            <Group justify="flex-end" mt="md">
                <Button type="submit" disabled={!form.isValid()}>
                    Create Learning Path
                </Button>
            </Group>
        </form>
    )
}

const EditLearningPath: FC<{
    learningPath?: LearningPath,
    learningPaths?: LearningPath[],
    setSelectedLearningPath: (label: string | null) => void,
}> = ({ learningPath, learningPaths, setSelectedLearningPath }) => {
    const form = useForm<LearningPath>({
        initialValues: {
            label: learningPath?.label || '',
            description: learningPath?.description || '',
            badgeId: learningPath?.badgeId || '',
            level1Metadata: learningPath?.level1Metadata,
            level2Metadata: learningPath?.level2Metadata,
            order: learningPath?.order,
        },
        validate: yupResolver(getLearningPathValidationSchema(learningPaths?.filter(lp => lp.id !== learningPath?.id))),
        validateInputOnChange: true,
    })

    useEffect(() => {
        if (learningPath) {
            form.reset()
            form.setValues(learningPath)
        }
    }, [learningPath])

    const updateLearningPath = useUpdateLearningPath()
    const deleteLearningPath = useDeleteLearningPath()

    if (!learningPath?.id) return null

    const handleDelete = () => {
        deleteLearningPath.mutate({
            id: learningPath.id!,
        }, {
            onSuccess: () => {
                setSelectedLearningPath(null)
            },
        })
    }

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
            <LearningPathForm form={form} learningPath={learningPath} />

            <Group justify="flex-end" mt="md">
                <Button onClick={handleDelete} color={colors.red} disabled={!!learningPath?.studies?.length}>
                    Delete Learning Path
                </Button>
                <Button type="submit" disabled={!form.isDirty() || !form.isValid()}>
                    Update Learning Path
                </Button>
            </Group>
        </form>
    )
}

const LearningPathForm: FC<{
    form: UseFormReturnType<LearningPath>,
    learningPath?: LearningPath
}> = ({ form, learningPath }) => {
    return (
        <Stack>
            <Group grow>
                <TextInput
                    withAsterisk
                    label="Label"
                    error={form.errors['label']}
                    {...form.getInputProps('label')}
                />

                <TextInput
                    withAsterisk
                    label="Badge ID"
                    error={form.errors['badgeId']}
                    {...form.getInputProps('badgeId')}
                />

                <NumberInput
                    withAsterisk
                    label='Order'
                    {...form.getInputProps('order')}
                />
            </Group>

            <Textarea
                withAsterisk
                label="Description"
                error={form.errors['description']}
                {...form.getInputProps('description')}
            />
            <Group grow>
                <TagsInput label='Level 1 Metadata'
                    placeholder='Level 1 metadata'
                    {...form.getInputProps('level1Metadata')}
                />
                <TagsInput label='Level 2 Metadata'
                    placeholder='Level 2 metadata'
                    {...form.getInputProps('level2Metadata')}
                />
            </Group>


            {learningPath && <ManageLearningPathStudies form={form} learningPath={learningPath} />}
        </Stack>
    )
}
