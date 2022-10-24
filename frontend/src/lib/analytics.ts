import Analytics from 'analytics'
// @ts-ignore - lacks type definitions
import googleTagManager from '@analytics/google-tag-manager'
// @ts-ignore - lacks type definitions
import googleAnalytics from '@analytics/google-analytics'
import { ENV } from './env'

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

if (ENV.OX_GA_UA) {
    plugins.push(
        googleAnalytics({
            trackingId: ENV.OX_GA_UA,
        })
    )
}

export const analytics = Analytics({
    app: 'Kinetic',
    plugins,
})
