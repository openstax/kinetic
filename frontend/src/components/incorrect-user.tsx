import { React } from '@common'
import { OXColoredStripe } from '@components'
import { useLoginURL } from '@lib'
import { Container } from '@mantine/core';

export interface IncorrectUserProps {
    desiredRole?: string
}
export const IncorrectUser:React.FC<IncorrectUserProps> = ({ desiredRole }) => {
    const loginURL = useLoginURL()

    return (
        <div className="incorrect-user" data-testid="incorrect-user-panel">
            <OXColoredStripe />
            <Container mt='xl'>
                <h1>Looks like you're not logged in{desiredRole ? ` as a ${desiredRole}` : ''}.</h1>
                <p>Please <a data-testid="login-link" href={loginURL}>log in</a> before using this site</p>
            </Container>
        </div>
    )
}
