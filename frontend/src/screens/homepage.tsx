import { React } from '../common'
import { PageHeader } from '../PageHeader'
import { ENV } from '../lib/env'

export const Home = () => {
    return (
        <div className="">
            <PageHeader />
            <h3>hello world</h3>
            <p>Api is: {ENV.API_URL}</p>
        </div>
    )
    
}
