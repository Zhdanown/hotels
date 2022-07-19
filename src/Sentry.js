import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://21a5a7f6d05f4e5d97c22c56f59100f3@o1316997.ingest.sentry.io/6569943",
  integrations: [new Integrations.BrowserTracing()],

  tracesSampleRate: 1.0,
});
