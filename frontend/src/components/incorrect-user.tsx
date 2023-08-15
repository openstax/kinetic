import { React } from '@common'
import { OXColoredStripe } from '@components'
import { loginURL } from '@lib'

export interface IncorrectUserProps {
    desiredRole?: string
}
export const IncorrectUser:React.FC<IncorrectUserProps> = ({ desiredRole }) => {
    return (
        <div className="incorrect-user" data-testid="incorrect-user-panel">
            <OXColoredStripe />
            <div className="container mt-4">
                <h1>Looks like you‘re not logged in{desiredRole ? ` as a ${desiredRole}` : ''}.</h1>
                <p>Please <a data-testid="login-link" href={loginURL()}>log in</a> before using this site</p>
            </div>
        </div>
    )
}
