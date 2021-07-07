import { React } from '../common'
import { PageHeader } from '../PageHeader'
import { ENV } from '../lib/env'
import { Link } from 'react-router-dom'

export default function Homepage() {
    return (
        <div className="container homepage mt-4">
            <PageHeader />
            <h3>hello world</h3>
            <p>Api is: {ENV.API_URL}</p>
            <Link className="btn" to="/studies">Studies</Link>
            {ENV.IS_LOCAL && <Link className="btn btn-primary" to="/dev">Development Login</Link>}
        </div>
    )

}
