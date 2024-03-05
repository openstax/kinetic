import { BannerNotice } from '@api'
import React from 'react'
import { Main } from './grid'
import { useCreateBanner, useDeleteBanner, useFetchBanners, useUpdateBanner } from '@models';
import { Button, Group, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, yupResolver } from '@mantine/form'
import * as yup from 'yup';
import { colors } from '@theme';

const EditBanner: FC<{banner?: BannerNotice}> = ({ banner }) => {
    const updateBanner = useUpdateBanner()
    const createBanner = useCreateBanner()
    const deleteBanner = useDeleteBanner()

    const form = useForm({
        initialValues: {
            message: banner?.message || '',
            startAt: banner?.startAt ? new Date(banner.startAt) : null,
            endAt: banner?.endAt ? new Date(banner.endAt) : null,
        },

        transformValues: (values) => ({
            ...values,
            startAt: values.startAt?.toString(),
            endAt: values.endAt?.toString(),
        }),

        validate: yupResolver(yup.object().shape({
            message: yup.string().required(),
            startAt: yup.date().required(),
            endAt: yup.date().required(),
        })),
    });

    const onDelete = (id?: number) => {
        id && deleteBanner.mutate(id)
    }

    const handleSubmit = form.onSubmit((values) => {
        if (banner?.id) {
            updateBanner.mutate({
                id: banner.id!,
                updateBanner: {
                    banner: values,
                },
            })
        } else {
            createBanner.mutate({
                banner: values,
            }, {
                onSuccess: () => {
                    form.reset()
                },
            })
        }
    })

    return (
        <form onSubmit={handleSubmit} data-testid={`${banner?.message || 'new-banner'}-form`}>
            <Stack>
                <TextInput placeholder='Banner message' label='Message' {...form.getInputProps('message')} />
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
                    {banner?.id && <Button color={colors.red} onClick={() => onDelete(banner.id)}>
                        Delete banner
                    </Button>}
                    <Button type="submit" disabled={!form.isDirty() || !form.isValid()}>
                        {banner?.id ? 'Update banner' : 'Create banner'}
                    </Button>
                </Group>
                <hr/>
            </Stack>
        </form>
    )
}

export function AdminBanners() {
    const { data: banners, isLoading } = useFetchBanners()

    if (isLoading) return <LoadingOverlay />

    return (
        <Main className='container'>
            <Stack py='lg'>
                <Group grow justify='space-between'>
                    <h4>Scheduled Banners</h4>
                </Group>
                <EditBanner />
                {banners?.map((banner) => <EditBanner banner={banner} key={banner.message} />)}
            </Stack>
        </Main>
    )
}
