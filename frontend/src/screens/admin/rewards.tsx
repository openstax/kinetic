import { Reward } from '@api'
import { Main, Sidebar } from './grid'
import { colors } from '@theme';
import { useCreateReward, useDeleteReward, useFetchRewards, useUpdateReward } from '@models';
import {
    Button,
    Card,
    Group,
    Loader,
    LoadingOverlay,
    NumberInput,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import dayjs from 'dayjs';
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react'
import { DateInput } from '@mantine/dates';

const EditReward: FC<{ reward?: Reward }> = ({ reward }) => {
    const updateReward = useUpdateReward()
    const createReward = useCreateReward()

    const form = useForm({
        initialValues: {
            prize: reward?.prize || '',
            points: reward?.points || 0,
            description: reward?.description || '',
            startAt: reward?.startAt ? new Date(reward.startAt) : '',
            endAt: reward?.endAt ? new Date(reward.endAt) : '',
        },

        transformValues: (values) => {
            return ({
                ...values,
                startAt: values.startAt?.toString(),
                endAt: values.endAt?.toString(),
            })
        },

        validate: yupResolver(yup.object().shape({
            prize: yup.string().required(),
            points: yup.number().required().min(1),
            description: yup.string().required(),
            startAt: yup.date().required(),
            endAt: yup.date().required(),
        })),
    });

    useEffect(() => {
        if (reward) {
            form.setValues({
                ...reward,
                startAt: reward?.startAt ? new Date(reward.startAt) : '',
                endAt: reward?.endAt ? new Date(reward.endAt) : '',
            })
            form.resetDirty()
        } else {
            form.reset()
        }
    }, [reward]);

    const handleSubmit = form.onSubmit((values) => {
        if (reward?.id) {
            updateReward.mutate({
                id: reward.id,
                updateReward: {
                    reward: values,
                },
            })
        } else {
            createReward.mutate({
                reward: values,
            }, {
                onSuccess: () => {
                    form.reset()
                },
            })
        }
    })

    return (
        <form onSubmit={handleSubmit}>
            <Stack>
                <Group grow>
                    <TextInput placeholder='Prize' label='Prize' {...form.getInputProps('prize')} />
                    <NumberInput placeholder='Points' label='Points' {...form.getInputProps('points')} />
                </Group>
                <Textarea placeholder='Description' label='Description' {...form.getInputProps('description')} />

                <Group grow justify='space-between'>
                    <DateInput placeholder='Starts at'
                        maxDate={form.values.endAt ? new Date(form.values.endAt) : undefined}
                        label='Starts at'
                        clearable
                        {...form.getInputProps('startAt')}
                    />
                    <DateInput placeholder='Ends at'
                        minDate={form.values.startAt ? new Date(form.values.startAt) : undefined}
                        label='Ends at'
                        clearable
                        {...form.getInputProps('endAt')}
                    />
                </Group>
                <Group justify="flex-end">
                    <Button type="submit" disabled={!form.isDirty() || !form.isValid()}>
                        {reward?.id ? 'Update reward' : 'Create reward'}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}

const RewardCard: FC<{
    reward: Reward,
    setCurrentReward: (reward?: Reward) => void,
    active: boolean
}> = ({ reward, setCurrentReward, active }) => {
    const { mutate, isLoading: isDeleting } = useDeleteReward()

    if (!reward) return null
    if (isDeleting) return <Loader />

    const onDelete = () => {
        if (reward.id) {
            mutate(reward.id, {
                onSuccess: () => {
                    if (active) {
                        setCurrentReward(undefined)
                    }
                },
            })
        }
    }

    return (
        <Stack key={(reward.description || '') + ' ' + reward.prize}>
            <Card withBorder={active} p='lg'>
                <Stack>
                    <Card.Section>
                        <Group>
                            <Text>{reward.prize}</Text>
                            <Text>
                                {dayjs(reward.startAt).format('MMMM D, YYYY')} - {dayjs(reward.endAt).format('MMMM D, YYYY')}
                            </Text>
                        </Group>
                    </Card.Section>
                    <Card.Section>
                        <Text>Description: {reward.description}</Text>
                    </Card.Section>
                    <Card.Section>
                        <Group justify='flex-end'>
                            <Button onClick={() => setCurrentReward(reward)}>
                                Edit
                            </Button>
                            <Button color={colors.red} onClick={onDelete}>
                                Delete
                            </Button>
                        </Group>
                    </Card.Section>
                </Stack>
            </Card>
            <hr/>
        </Stack>
    )
}

export function AdminRewards() {
    const [currentReward, setCurrentReward] = useState<Reward | undefined>()

    const { data: rewards, isLoading } = useFetchRewards()

    if (isLoading) return <LoadingOverlay />

    return (
        <>
            <Sidebar>
                <Stack>
                    <Title order={3}>Scheduled Rewards</Title>
                    <Button onClick={() => setCurrentReward(undefined)}>
                        + Create new reward
                    </Button>
                    <Stack p='md' style={{ border: '1px solid black' }} data-testid='rewards-list'>
                        {rewards?.map(reward => (
                            <RewardCard reward={reward} active={currentReward?.id == reward.id} setCurrentReward={setCurrentReward} key={`${reward.prize}${reward.startAt}`} />
                        ))}
                    </Stack>
                </Stack>
            </Sidebar>
            <Main className="container pt-2">
                <EditReward reward={currentReward} />
            </Main>
        </>
    )
}
