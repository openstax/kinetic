import { React } from '@common';
import { useCreateLearningPath, useFetchLearningPaths, useUpdateLearningPath } from '../../models/learning-path';
import { Button, Group, Loader, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { Main } from './grid';
import { LearningPath } from '@api';
import * as yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';

export const ManageLearningPaths = () => {
    const { data: learningPaths, isLoading } = useFetchLearningPaths()

    if (isLoading) return <Loader />

    return (
        <Main className="container py-2">
            <Title order={4}>Manage learning paths</Title>
            <Stack>
                <CreateLearningPath key='create-learning-path' />

                {learningPaths?.map(learningPath => {
                    return (
                        <EditLearningPath key={learningPath.id} learningPath={learningPath} />
                    )
                })}
            </Stack>
        </Main>
    )
}

const validationSchema = yup.object().shape({
    label: yup.string().required(),
    description: yup.string().required(),
})

const CreateLearningPath = () => {
    const form = useForm<LearningPath>({
        initialValues: {
            label: '',
            description: '',
        },
        validate: yupResolver(validationSchema),
    })

    type FormValues = typeof form.values;

    const createLearningPath = useCreateLearningPath()

    const handleSubmit = (values: FormValues) => {
        createLearningPath.mutate({
            learningPath: values,
        }, {
            onSuccess: () => {
                form.reset()
            },
        })
    }

    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        withAsterisk
                        label="Label"
                        {...form.getInputProps('label')}
                    />

                    <Textarea
                        withAsterisk
                        label="Description"
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

const EditLearningPath: FC<{learningPath: LearningPath}> = ({ learningPath }) => {
    const form = useForm<LearningPath>({
        initialValues: {
            label: learningPath.label,
            description: learningPath.description,
        },
        validate: yupResolver(validationSchema),
    })

    type FormValues = typeof form.values;

    const updateLearningPath = useUpdateLearningPath()

    const handleSubmit = (values: FormValues) => {
        if (!learningPath.id) return
        updateLearningPath.mutate({
            id: learningPath.id,
            updateLearningPath: { learningPath: {
                ...learningPath,
                ...values,
            } },
        })
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput
                    withAsterisk
                    label="Label"
                    {...form.getInputProps('label')}
                />

                <Textarea
                    withAsterisk
                    label="Description"
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
