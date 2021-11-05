import { React } from '@common'
import { Route, Switch } from 'react-router-dom'
import { PageNotFound } from '@components'
import { loadAsync } from './components/async'
import { useCurrentUser } from './lib/user-access'

const Home = loadAsync('Homepage', () => import('./screens/homepage'))
const Dev = loadAsync('Dev', () => import('./screens/dev'))
const StudyLanding = loadAsync('Study Landing Page', () => import('./screens/study-landing'))
const EditStudy = loadAsync('Edit Study Details', () => import('./screens/study-edit'))
const StudyDetails = loadAsync('Study Details', () => import('./screens/study-details'))
const Researcher = loadAsync('Studies', () => import('./screens/researcher-home'))
const Participant = loadAsync('Studies', () => import('./screens/participant-home'))

const StudiesHomepage = () => {
    const user = useCurrentUser()
    return user.is_researcher ? <Researcher /> : <Participant />
}

export const AppRoutes = () => {
    const user = useCurrentUser()
    return (
        <div className="openstax-kinetic" data-user-id={user?.id}>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/dev">
                    <Dev />
                </Route>
                <Route path="/study/land/:studyId" exact>
                    <StudyLanding />
                </Route>
                <Route path={'/study/edit/:id'} exact>
                    <EditStudy />
                </Route>
                <Route path={'/study/details/:id'} exact>
                    <StudyDetails />
                </Route>
                <Route path="/studies" exact>
                    <StudiesHomepage />
                </Route>
                <Route path="*">
                    <PageNotFound />
                </Route>
            </Switch>
        </div>
    )
}
