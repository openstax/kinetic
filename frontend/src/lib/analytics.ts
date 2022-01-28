import { useEffect } from '@common'
import Analytics from 'analytics'
// @ts-ignore - lacks type definitions
import googleTagManager from '@analytics/google-tag-manager'
// @ts-ignore - lacks type definitions
import googleAnalytics from '@analytics/google-analytics'
import { ENV } from './env'
import { usePendingState } from './hooks'

const plugins:any = []

if (ENV.GTAG_ID) {
    plugins.push(
        googleTagManager({
            containerId: ENV.GTAG_ID,
        })
    )
}

if (ENV.GA_UA) {
    plugins.push(
        googleAnalytics({
            trackingId: ENV.GA_UA,
        })
    )
}

export const analytics = Analytics({
    app: 'Kinetic',
    plugins,
})


export const useAnalyticsTracking = (path: string) => {
    useEffect(() => {
        analytics.page()
    }, [path])

//     useEffect(() => {
//         analytics.track('optimize.callback', {
//             name: '<experiment_id>', // TODO: add id
//             callback: (value: string) => setRewardsState(
//                 value == '0' ? 'display' : 'hidden'
//             ),
//         })
//     }, [setRewardsState])
// console.log(ENV.IS_DEV_MODE, isPending)
//     useEffect(() => {
//         if (ENV.IS_DEV_MODE && !isPending) {
//             setRewardsState('display')
//         }
//     }, [ENV.IS_DEV_MODE, isPending])

}
