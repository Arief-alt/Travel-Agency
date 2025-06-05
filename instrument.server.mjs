import * as Sentry from "@sentry/react-router";

import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
    dsn: "https://b00e1a18ac7f8e2ebb494153c454b6b9@o4509377782415365.ingest.de.sentry.io/4509377785692240",

    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    profilesSampleRate: 1.0, // profile every transaction
});
