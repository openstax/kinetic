import { React, useEffect } from '@common'
import { User } from '@models'
import { LoadingAnimation, IncorrectUser } from '@components'
import { useLocation } from 'react-router-dom'
import { ENV } from './env'

export const CurrentUserContext = React.createContext<User | null>(null)


export const CurrentUserProvider:React.FC = ({ children }) => {
    const [currentUser, setCurrentUser] = React.useState<User|null>(null)
    const location = useLocation()
    useEffect(() => {
        User.fetchCurrentUser().then(setCurrentUser)
    }, [])

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
