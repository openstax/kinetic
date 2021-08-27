import { React } from '../common'
import { Button } from './button'
import { ENV, useCurrentUser } from '@lib'
import { useHistory } from 'react-router-dom'

export const LogoutButton: React.FC = () => {
    const user = useCurrentUser()
    const history = useHistory()
    if (!ENV.IS_LOCAL) {
        return null
    }

    const onClick = async () => {
        await user.logout()
        history.push('/')
    }

    return (
        <Button secondary onClick={onClick}>
            Logout
        </Button>
    )
}
