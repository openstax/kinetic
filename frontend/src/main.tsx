import { React } from '@common'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react';
import { EnvironmentProvider, whenDomReady } from '@lib'
import { AppRoutes } from './routes'
import './lib/sentry'
import './index.css'
import './styles/main.scss'
import { theme } from '@theme'
import { QueryClient, QueryClientProvider } from 'react-query';

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
            <ThemeProvider theme={theme}>
                <EnvironmentProvider>
                    <QueryClientProvider client={queryClient}>
                        <AppRoutes />
                    </QueryClientProvider>
                </EnvironmentProvider>
            </ThemeProvider>
        </Router>
    </React.StrictMode>
)

whenDomReady().then(() => {
    const root = createRoot(document.getElementById('root')!)
    root.render(<App />,)
})
