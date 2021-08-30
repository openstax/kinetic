import { useRouteMatch, Route, Switch } from 'react-router-dom'
import { React } from '@common'
import { StudiesListing } from './listing'
import { EditStudy } from './edit'
import { StudyDetails } from './details'
import { IncorrectUser, PageNotFound } from '@components'
import { useCurrentUser } from '@lib'


export default function UsersStudies() {
    let { path } = useRouteMatch();
    const user = useCurrentUser()

    if (!user) {
        return <IncorrectUser />
    }

    return (
        <div className="studies">
            <Switch>
                <Route exact path={path}>
                    <StudiesListing />
                </Route>
                <Route path={'/study/edit/:id'} exact>
                    <EditStudy />
                </Route>
                <Route path={'/study/details/:id'} exact>
                    <StudyDetails />
                </Route>
                <Route path="*">
                    <PageNotFound />
                </Route>
            </Switch>
        </div>
    )

}
