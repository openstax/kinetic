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
import { mantineTheme } from '@theme'
import { QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ImpersonatingBanner } from './components/impersonating-banner';
import { TourProvider } from '@reactour/tour';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const steps = [
    {
        selector: '[data-tour="highlighted-studies"]',
        content: 'The best studies on the site',
    },
    {
        selector: '[data-tour="study-filters"]',
        content: 'Filter different studies',
    },
    {
        selector: '[data-tour="account-info"]',
        content: 'Access your account info here',
    },
];

const App = () => (
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={mantineTheme}>
                <EnvironmentProvider>
                    <TourProvider steps={steps}>
                        <Notifications position='top-right' />
                        <ImpersonatingBanner />
                        <AppRoutes />
                    </TourProvider>
                </EnvironmentProvider>
            </MantineProvider>
        </QueryClientProvider>
    </React.StrictMode>
)

whenDomReady().then(() => {
    const root = createRoot(document.getElementById('root')!)
    root.render(<App />)
})
