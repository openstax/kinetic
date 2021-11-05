import { React, ReactDOM } from '@common'
import { BrowserRouter as Router } from 'react-router-dom'
import { whenDomReady } from '@lib'
import { CurrentUserProvider } from './lib/user-access'
import { AppRoutes } from './routes'
import './lib/sentry'
import './lib/gtm'
import './index.css'
import './styles/main.scss'

const App = () => (
    <React.StrictMode>
        <Router>
            <CurrentUserProvider>
                <AppRoutes />
            </CurrentUserProvider>
        </Router>
    </React.StrictMode>
)

whenDomReady().then(() => {
    ReactDOM.render(<App />, document.getElementById('root'))
})
