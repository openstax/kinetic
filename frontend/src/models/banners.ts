import { toDayJS, useApi, useEnvironment } from '@lib'
import { useCallback } from 'react'
import { useLocalstorageState } from 'rooks'
import { AddBanner, BannerMessage, UpdateBannerRequest } from '@api'
import { useMutation, useQuery, useQueryClient } from 'react-query';

type RemoveBannerT = (b: BannerMessage) => void

type useBannersReturnT = [
    BannerMessage[],
    RemoveBannerT,
]

export const useFetchBanners = () => {
    const api = useApi()
    return useQuery('fetchBanners', async () => {
        const res = await api.getBanners();
        return res.data || [];
    })
}

export const useCreateBanner = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (addBanner: AddBanner) => await api.createBanner({ addBanner }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['fetchBanners'] })
        },
    })
}

export const useUpdateBanner = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updateBannerRequest: UpdateBannerRequest) => await api.updateBanner({
            updateBanner: updateBannerRequest.updateBanner,
            id: updateBannerRequest.id,
        }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['fetchBanners'] })
        },
    })
}

export const useDeleteBanner = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => await api.deleteBanner({ id }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['fetchBanners'] })
        },
    })
}

export const useBanners = (): useBannersReturnT => {
    const env= useEnvironment()

    const now = toDayJS(new Date)

    const [removed, setRemoved] = useLocalstorageState<string[]>('viewed-banners', [])

    const removeBanner = useCallback((banner: BannerMessage) => {
        setRemoved(removed.concat(banner.id))
    }, [setRemoved, removed])

    const banners = env.bannersSchedule.filter(banner => {
        const sd = toDayJS(banner.startAt)
        const ed = toDayJS(banner.endAt)
        return !removed.includes(banner.id) && (
            sd.isSame(now, 'day') ||
                ed.isSame(now, 'day') ||
                (sd.isBefore(now) && ed.isAfter(now))
        )
    })

    return [banners, removeBanner]
}
