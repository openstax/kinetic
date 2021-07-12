import { React, useEffect } from '@common'
import { User } from '@models'
import { LoadingAnimation, OXColoredStripe } from '@components'
import { useLocation } from 'react-router-dom'
import { ENV } from './env'

export const CurrentUserContext = React.createContext<User | null>(null)


const LoginURL = ENV.IS_DEV_MODE ? '/dev/user' : ENV.ACCOUNTS_URL

const Unauthenticated = () => (
    <div className="homepage unauthenticated">
        <OXColoredStripe />
        <div className="container mt-4">
            <h1>Looks like you‘re not logged in.</h1>
            <p>Please <a data-test-id="login-link" href={LoginURL}>login</a> before using this site</p>
        </div>
    </div>
)


export const CurrentUserProvider:React.FC = ({ children }) => {
    const [currentUser, setCurrentUser] = React.useState<User|null>(null)
    const location = useLocation()
    useEffect(() => {
        User.fetchCurrentUser().then(setCurrentUser)
    }, [])

    if (
        currentUser?.isValid == false && (ENV.IS_PROD_MODE || !location.pathname.startsWith('/dev/user'))
    ) {
        return <Unauthenticated />
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            {currentUser ? children : <LoadingAnimation />}
        </CurrentUserContext.Provider>
    )
}

export const useCurrentUser = () => React.useContext(CurrentUserContext) as User
