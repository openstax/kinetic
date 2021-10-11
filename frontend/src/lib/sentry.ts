import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ENV } from './env'

if (ENV.SENTRY_DSN) {
    Sentry.init({
        dsn: ENV.SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],

        // Consider lowering if sentry starts to report too many instances of the same error
        tracesSampleRate: 1.0,
    });
}
