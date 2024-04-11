import { useEffect} from '@common'
import { ENV } from './env'
import { useEnvironment } from './environment-provider'

export const AnalyticsHelpers = () => {
    const env = useEnvironment()

    useEffect(() => {
        if (!ENV.IS_PRODUCTION) return

        window.dataLayer?.push({
            app: 'Kinetic',
            user_tags: `,role=${env.user.selfReportedRole},faculty=${env.user.facultyStatus},`,
        });

    }, [env, ENV])

    return null
}
