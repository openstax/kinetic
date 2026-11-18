import Analytics from 'analytics'
// @ts-ignore - lacks type definitions
import googleTagManager from '@analytics/google-tag-manager'
import { ENV } from './env'

const plugins:any = []

if (ENV.GTAG_ID) {
    plugins.push(
        googleTagManager({
            containerId: ENV.GTAG_ID,
        })
    )
}

export const analytics = Analytics({
    app: 'Kinetic',
    plugins,
})
