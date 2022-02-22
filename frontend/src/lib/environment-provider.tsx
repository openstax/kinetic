import { React, useEffect } from '@common'
import { Environment, ANON_USER } from '@models'
import { LoadingAnimation, IncorrectUser, ErrorPage } from '@components'
import { useLocation } from 'react-router-dom'
import { ENV } from './env'

export const EnvironmentContext = React.createContext<Environment | null>(null)


export const EnvironmentProvider:React.FC = ({ children }) => {
    const [currentEnv, setEnvironment] = React.useState<Environment|null>(null)

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
