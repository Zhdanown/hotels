import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn:
    "https://9824a8145e724ab582eb2947fbc96d29@o474413.ingest.sentry.io/5515565",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});
