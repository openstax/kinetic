import { useRouteMatch, Route, Switch } from 'react-router-dom'
import { React } from '@common'
import { StudiesListing } from './listing'
import { EditStudy } from './edit'
import { IncorrectUser } from '@components'
import { useCurrentUser } from '@lib'


export default function UsersStudies() {
    let { path } = useRouteMatch();
    const user = useCurrentUser()

    if (!user) {
        return <IncorrectUser />
    }

    return (
        <div className="container studies mt-8">
            <Switch>
                <Route exact path={path}>
                    <StudiesListing />
                </Route>
                <Route path={`${path}/:id`} exact>
                    <EditStudy />
                </Route>
            </Switch>
        </div>
    )

}
