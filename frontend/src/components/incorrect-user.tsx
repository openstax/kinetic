import { React, useState, useEffect } from '@common'
import { OXColoredStripe, LoadingAnimation } from '@components'
import { Environment } from '../models/environment'

export interface IncorrectUserProps {
    desiredRole?: string
}
export const IncorrectUser:React.FC<IncorrectUserProps> = ({ desiredRole }) => {
    const [env, setEnv] = useState<Environment>()
    useEffect(() => {
        Environment.fetch().then(e => setEnv(e))
    }, [])

    if (!env) return <LoadingAnimation />

    return (
        <div className="incorrect-user" data-test-id="incorrect-user-panel">
            <OXColoredStripe />
            <div className="container mt-4">
                <h1>Looks like you‘re not  logged in{desiredRole ? ` as a ${desiredRole}` : ''}.</h1>
                <p>Please <a data-test-id="login-link" href={env.loginURL}>log in</a> before using this site</p>
            </div>
        </div>
    )
}
