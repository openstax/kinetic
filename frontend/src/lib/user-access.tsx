import { React, useEffect } from '@common'
import { User } from '@models'
import { LoadingAnimation, IncorrectUser, ErrorPage } from '@components'
import { useLocation } from 'react-router-dom'
import { ENV } from './env'
import { retry } from './util'
import { analytics } from './analytics'
export const CurrentUserContext = React.createContext<User | null>(null)


export const CurrentUserProvider:React.FC = ({ children }) => {
    const [currentUser, setCurrentUser] = React.useState<User|null>(null)
    const [error, setError] = React.useState<any>(false)
    const location = useLocation()
    useEffect(() => {
        retry(User.fetchCurrentUser)
            .then((u) => {
                analytics.identify(u.id)
                setCurrentUser(u)
            })
            .catch((err) => setError(err))
    }, [])
    if (error) {
        return <ErrorPage error={error} />
    }
    if (
        currentUser?.isValid == false && (ENV.IS_PROD_MODE || !location.pathname.startsWith('/dev/user'))
    ) {
        return <IncorrectUser />
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            {currentUser ? children : <LoadingAnimation />}
        </CurrentUserContext.Provider>
    )
}

export const useCurrentUser = () => React.useContext(CurrentUserContext) as User
