import { React } from '@common'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { whenDomReady } from '@lib'
import { EnvironmentProvider } from './lib/environment-provider'
import { AppRoutes } from './routes'
import './lib/sentry'
import './index.css'
import './styles/main.scss'

const App = () => (
    <React.StrictMode>
        <Router>
            <EnvironmentProvider>
                <AppRoutes />
            </EnvironmentProvider>
        </Router>
    </React.StrictMode>
)

whenDomReady().then(() => {
    const root = createRoot(document.getElementById('root')!)
    root.render(<App />, )
})
