import { React } from '@common'
import { createRoot } from 'react-dom/client'
import { EnvironmentProvider, whenDomReady } from '@lib'
import { AppRoutes } from './routes'
import './lib/sentry'
import './index.css'
import './styles/main.scss'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import { mantineTheme } from '@theme'
import { AnalyticsHelpers } from './lib/analytics-helpers'
import { QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ImpersonatingBanner } from './components/impersonating-banner';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const App = () => (
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={mantineTheme}>
                <EnvironmentProvider>
                    <AnalyticsHelpers />
                    <Notifications position='top-right' />
                    <ImpersonatingBanner />
                    <AppRoutes />
                </EnvironmentProvider>
            </MantineProvider>
        </QueryClientProvider>
    </React.StrictMode>
)

whenDomReady().then(() => {
    const root = createRoot(document.getElementById('root')!)
    root.render(<App />)
})
