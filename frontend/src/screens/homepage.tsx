import { React } from '../common'
import { PageHeader } from '../PageHeader'
import { Link } from 'react-router-dom'
import { ENV, useCurrentUser } from '@lib'


export default function Homepage() {
    const user = useCurrentUser()
    return (
        <div className="container homepage mt-4">
            <PageHeader />
            <h3>hello user {user.id}</h3>

            <Link className="btn" to="/studies">Studies</Link>
            {ENV.IS_LOCAL && <Link className="btn btn-primary" to="/dev">Development Login</Link>}
        </div>
    )

}
