import { useRouteMatch, Route, Switch } from 'react-router-dom'
import { React } from '@common'
import { StudiesListing } from './listing'
import { StudyDetails } from './details'
import { LinkButton } from '@components'

export default function UsersStudies() {
    let { path } = useRouteMatch();

    return (
        <div className="container studies mt-8">
            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
                <div className="container-fluid">
                    <LinkButton icon="back" secondary to="/">
                        Home
                    </LinkButton>
                </div>
            </nav>
            <Switch>
                <Route exact path={path}>
                    <StudiesListing />
                </Route>
                <Route path={`${path}/:id`} exact>
                    <StudyDetails />
                </Route>
            </Switch>
        </div>
    )

}
