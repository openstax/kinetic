import { React } from '@common'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react';
import { whenDomReady } from '@lib'
import { EnvironmentProvider } from './lib/environment-provider'
import { AppRoutes } from './routes'
import './lib/sentry'
import './index.css'
import './styles/bootstrap.scss'
import './styles/main.scss'
import { theme } from './theme'

const App = () => (
    <React.StrictMode>
        <Router>
            <ThemeProvider theme={theme}>
                <EnvironmentProvider>
                    <AppRoutes />
                </EnvironmentProvider>
            </ThemeProvider>
        </Router>
    </React.StrictMode>
)

whenDomReady().then(() => {
    const root = createRoot(document.getElementById('root')!)
    root.render(<App />,)
})
