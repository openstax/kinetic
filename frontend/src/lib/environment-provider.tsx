import { React, useEffect, useState } from '@common'
import { ANON_USER, Environment, UserInfo } from '@models'
import { ErrorPage, IncorrectUser, LoadingAnimation } from '@components'
import { useLocation } from 'react-router-dom'
import { ENV } from './env'
import { useApi } from './api-config'
import { useQuery } from 'react-query';

export const EnvironmentContext = React.createContext<Environment | null>(null)


export const EnvironmentProvider: FCWC = ({ children }) => {
    const [currentEnv, setEnvironment] = React.useState<Environment | null>(null)

    const [error, setError] = React.useState<any>(false)
    const location = useLocation()
    useEffect(() => {
        Environment
            .bootstrap()
            .then(setEnvironment)
            .catch(setError)
    }, [])
    if (error) {
        return <ErrorPage error={error} />
    }

    if (
        currentEnv?.user.isValid == false && (ENV.IS_PROD_MODE || !location.pathname.startsWith('/dev/user'))
    ) {
        return <EnvironmentContext.Provider value={currentEnv}><IncorrectUser /></EnvironmentContext.Provider>
    }

    return (
        <EnvironmentContext.Provider value={currentEnv}>
            {currentEnv ? children : <LoadingAnimation />}
        </EnvironmentContext.Provider>
    )
}

export const useEnvironment = () => React.useContext(EnvironmentContext) as Environment

export const useCurrentUser = () => useEnvironment()?.user || ANON_USER

export const useCurrentResearcher = () => useEnvironment()?.researcher

export const useUserInfo = () => {
    const env = useEnvironment()
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    useEffect(() => {
        env.fetchUserInfo().then(setUserInfo)
    }, [])
    return userInfo
}

export const useUserPreferences = () => {
    const api = useApi()

    return useQuery('getPreferences', () => {
        return api.getPreferences()
    })
}
