import { BannerNotice } from '@api'
import React, { useEffect, useState } from 'react'
import { Main } from './grid'
import { useCreateBanner, useDeleteBanner, useFetchBanners, useUpdateBanner } from '@models';
import { Button, Group, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, yupResolver } from '@mantine/form'
import * as yup from 'yup';
import { colors } from '@theme';
import { IconTrash, IconTrashFilled, IconTrashX } from '@tabler/icons-react';

const EditBanner: FC<{banner?: BannerNotice}> = ({ banner }) => {
    const [bannerDateRange, setBannerDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const updateBanner = useUpdateBanner()
    const createBanner = useCreateBanner()
    const deleteBanner = useDeleteBanner()

    const form = useForm<BannerNotice>({
        initialValues: {
            message: banner?.message || '',
            startAt: banner?.startAt || '',
            endAt: banner?.endAt || '',
        },

        validate: yupResolver(yup.object().shape({
            message: yup.string().required(),
        })),
    });

    useEffect(() => {
        if (banner?.id && banner.startAt && banner.endAt) {
            setBannerDateRange([
                new Date(banner.startAt),
                new Date(banner.endAt),
            ])
        }
    }, [banner]);

    const onDelete = (id?: number) => {
        id && deleteBanner.mutate(id)
    }

    const handleSubmit = form.onSubmit((values) => {
        const [startAt, endAt] = bannerDateRange
        if (banner?.id) {
            updateBanner.mutate({
                id: banner.id!,
                updateBanner: {
                    banner: {
                        ...values,
                        startAt: startAt?.toString(),
                        endAt: endAt?.toString(),
                    },
                },
            })
        } else {
            createBanner.mutate({
                banner: {
                    ...values,
                    startAt: startAt?.toString(),
                    endAt: endAt?.toString(),
                },
            }, {
                onSuccess: () => {
                    setBannerDateRange([null, null])
                    form.reset()
                },
            })
        }
    })

    return (
        <form onSubmit={handleSubmit}>
            <Stack>
                <TextInput placeholder='New banner message' label='Message' {...form.getInputProps('message')} />
                <DatePickerInput placeholder='New banner date range' label='Date Range' type="range" value={bannerDateRange} onChange={setBannerDateRange} />
                <Group justify="flex-end">
                    {banner?.id && <Button color={colors.red} onClick={() => onDelete(banner.id)}>
                        Delete Banner
                    </Button>}
                    <Button type="submit" disabled={!form.isDirty() || !form.isValid()}>
                        {banner?.id ? 'Update banner' : 'Create banner'}
                    </Button>
                </Group>
            </Stack>
            <hr/>
        </form>
    )
}


export function AdminBanners() {
    const { data: banners, isLoading } = useFetchBanners()

    if (isLoading) return <LoadingOverlay />

    return (
        <Main className='container'>
            <Stack py='lg'>
                <h4>Scheduled Banners</h4>
                <EditBanner />
                {banners?.map((banner) => <EditBanner banner={banner} key={banner.startAt} />)}
            </Stack>
        </Main>
    )
}
