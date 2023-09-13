import { React } from '@common'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { EnvironmentProvider, whenDomReady } from '@lib'
import { AppRoutes } from './routes'
import './lib/sentry'
import './index.css'
import './styles/main.scss'
import { mantineTheme } from '@theme'
import { QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const App = () => (
    <React.StrictMode>
        <Router>
            <QueryClientProvider client={queryClient}>
                <EnvironmentProvider>
                    <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
                        <Notifications position='top-right' />
                        <AppRoutes />
                    </MantineProvider>
                </EnvironmentProvider>
            </QueryClientProvider>
        </Router>
    </React.StrictMode>
)

whenDomReady().then(() => {
    const root = createRoot(document.getElementById('root')!)
    root.render(<App />)
})
