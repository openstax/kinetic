import { React, ReactDOM } from '@common'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { PageNotFound } from '@components'
import { loadAsync } from './components/async'
import { whenDomReady } from '@lib'
import { CurrentUserProvider } from './lib/user-access'
import './index.css'
import './styles/main.scss'

const Home = loadAsync('Homepage', () => import('./screens/homepage'))
const Dev = loadAsync('Dev', () => import('./screens/dev'))
const Studies = loadAsync('Studies', () => import('./screens/studies'))


const App = () => (
    <React.StrictMode>
        <Router>
            <CurrentUserProvider>
                <div className="openstax-labs ">
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/dev">
                            <Dev />
                        </Route>
                        <Route path="/studies">
                            <Studies />
                        </Route>
                        <Route path="*">
                            <PageNotFound />
                        </Route>
                    </Switch>
                </div>
            </CurrentUserProvider>
        </Router>
    </React.StrictMode>
)

whenDomReady().then(() => {
    ReactDOM.render(<App />, document.getElementById('root'))
})
