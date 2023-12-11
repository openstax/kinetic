import { React } from '@common'
import { ErrorPage, IncorrectUser, LoadingAnimation } from '@components'
import { ENV } from './env'
import { useApi } from './api-config'
import { useQuery } from 'react-query';
import { Environment } from '@api'
import { UserInfo } from '@models';
import { UnsupportedCountryModal } from '../screens/learner/unsupported-country-modal';

export const EnvironmentContext = React.createContext<Environment | null>(null)

export const useFetchEnvironment = () => {
    const api = useApi()
    return useQuery('fetchEnvironment', () => {
        return api.getEnvironment()
    }, {
        staleTime: Infinity,
    })
}

export const EnvironmentProvider: FCWC = ({ children }) => {
    const { data: env, error, isLoading } = useFetchEnvironment()

    if (error) {
        return <ErrorPage error={error} />
    }

    if (isLoading || !env) {
        return <LoadingAnimation />
    }

    if (env.isCountryEligible) {
        return <UnsupportedCountryModal />
    }

    if (!env.user.userId && (ENV.IS_PROD_MODE || !window.location.pathname.startsWith('/dev/user'))) {
        return (
            <EnvironmentContext.Provider value={env}>
                <IncorrectUser />
            </EnvironmentContext.Provider>
        )
    }

    return (
        <EnvironmentContext.Provider value={env}>
            {env ? children : <LoadingAnimation />}
        </EnvironmentContext.Provider>
    )
}

export const useEnvironment = () => React.useContext(EnvironmentContext) as Environment

export const useCurrentUser = () => {
    const env = useEnvironment()
    return env.user
}

export const useCurrentResearcher = () => {
    const env = useEnvironment()
    return env.researcher
}

export const useUserInfo = () => {
    const accountsApiURL = useAccountsApiURL()

    return useQuery('fetchUserInfo', async (): Promise<UserInfo> => {
        const resp = await fetch(`${accountsApiURL}`, { credentials: 'include' })
        return await resp.json()
    })
}

export const useUserPreferences = () => {
    const api = useApi()

    return useQuery('getPreferences', () => {
        return api.getPreferences()
    })
}

export const useLocationOrigin = () => {
    const env = useEnvironment()
    if (env.accountsEnvName === 'production') {
        return `https://openstax.org`;
    }
    return `https://${env.accountsEnvName}.openstax.org`;
}

export const useLoginURL = () => {
    const url = useAccountsURL()
    if (ENV.IS_DEV_MODE) return url

    return `${url}/login/?r=${encodeURIComponent(window.location.href)}`
}

export const useLogoutURL = () => {
    const locationOrigin = useLocationOrigin()
    const accountsURL = useAccountsURL()
    if (ENV.IS_DEV_MODE) return '/dev/user';
    const homepage = encodeURIComponent(`${locationOrigin}/kinetic`);
    return `${accountsURL}/signout?r=${homepage}`;
}

export const useAccountsURL = (): string => {
    const locationOrigin = useLocationOrigin()

    if (ENV.IS_DEV_MODE) return '/dev/user'
    return `${locationOrigin}/accounts`;
}

export const useAccountsApiURL = (): string => {
    const accountsURL = useAccountsURL()

    if (ENV.IS_DEV_MODE) return `${ENV.API_ADDRESS}/development/user/api/user`
    return `${accountsURL}/api/user`
}
