import './index.css'
import { React, ReactDOM } from './common'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { loadAsync } from './components/async'
import './styles/main.scss'

const Home = loadAsync('Homepage', () => import('./screens/homepage'))
const Dev = loadAsync('Dev', () => import('./screens/dev'))
const Studies = loadAsync('Studies', () => import('./screens/studies'))

ReactDOM.render(
    <React.StrictMode>
        <div className="openstax-labs ">
            <Router>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/dev">
                    <Dev />
                </Route>
                <Route path="/studies">
                    <Studies />
                </Route>
            </Router>
        </div>

    </React.StrictMode>,
    document.getElementById('root')
)
