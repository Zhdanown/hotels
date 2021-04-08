import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://93a43fdf79184bd4bb45f648a7112f90@o507234.ingest.sentry.io/5710625",
  integrations: [new Integrations.BrowserTracing()],
  
  tracesSampleRate: 1.0,
});
