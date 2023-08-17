import { useEnvironment, toDayJS } from '@lib'
import { useCallback } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { BannerMessage } from '@api'

type RemoveBannerT = (b: BannerMessage) => void

type useBannersReturnT = [
    BannerMessage[],
    RemoveBannerT,
]

export const useBanners = (): useBannersReturnT => {
    const env= useEnvironment()

    const now = toDayJS(new Date)

    // TODO Replace with @rooks/useLocalStorageState,
    //  would allow us to remove another dependency
    const [removed, setRemoved] = useLocalStorageState('viewed-banners', {
        defaultValue: [] as string[],
    })

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
