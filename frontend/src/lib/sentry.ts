import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ENV } from './env'

if (ENV.SENTRY_DSN) {
    Sentry.init({
        dsn: ENV.SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
    });
}
