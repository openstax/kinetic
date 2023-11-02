import { ENV } from './env'
import * as Sentry from '@sentry/browser';

if (ENV.SENTRY_DSN) {
    Sentry.init({
        dsn: ENV.SENTRY_DSN,
        integrations: [
            new Sentry.BrowserTracing(),
        ],

        // Consider lowering if sentry starts to report too many instances of the same error
        tracesSampleRate: 1.0,
    });
}
