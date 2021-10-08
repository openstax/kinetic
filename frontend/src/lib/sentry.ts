import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

Sentry.init({
    dsn: 'https://3dd51ac21db845e086fda90da2735ad3@o484761.ingest.sentry.io/5915135',
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});
