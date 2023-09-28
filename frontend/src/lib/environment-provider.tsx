import { React } from '@common'
import { UserInfo } from '@models'
import { ErrorPage, IncorrectUser, LoadingAnimation } from '@components'

import { ENV } from './env'
import { useApi } from './api-config'
import { useQuery } from 'react-query';
import { Environment } from '@api'

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
    return useQuery('fetchUserInfo', () => {
        return fetchUserInfo()
    })
}

export const useUserPreferences = () => {
    const api = useApi()

    return useQuery('getPreferences', () => {
        return api.getPreferences()
    })
}

export const locationOrigin = () => {
    const env = useEnvironment()
    if (env.accountsEnvName === 'production') {
        return `https://openstax.org`;
    }
    return `https://${env.accountsEnvName}.openstax.org`;
}

export const loginURL = () => {
    const url = accountsUrl()
    if (ENV.IS_DEV_MODE) return url

    return `${url}/login/?r=${encodeURIComponent(window.location.href)}`
}

export const logoutURL = () => {
    if (ENV.IS_DEV_MODE) return '/dev/user';
    const homepage = encodeURIComponent(`${locationOrigin()}/kinetic`);
    return `${accountsUrl()}/signout?r=${homepage}`;
}

export const accountsUrl = (): string => {
    if (ENV.IS_DEV_MODE) return '/dev/user'
    return `${locationOrigin()}/accounts`;
}

export const accountsApiUrl = (): string => {
    if (ENV.IS_DEV_MODE) return `${ENV.API_ADDRESS}/development/user/api/user`
    return `${accountsUrl()}/api/user`
}

export const fetchUserInfo = async (): Promise<UserInfo> => {
    const resp = await fetch(`${accountsApiUrl()}`, { credentials: 'include' })
    return resp.json()
}
