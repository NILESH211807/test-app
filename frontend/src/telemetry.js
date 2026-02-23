import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { trace } from "@opentelemetry/api";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const exporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: "frontend-vite-app",
});

const provider = new WebTracerProvider({
  resource,
  spanProcessors: [new BatchSpanProcessor(exporter)],
});

provider.register();

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation(),
    new DocumentLoadInstrumentation(),
  ],
});

const tracer = trace.getTracer("frontend-errors");

window.addEventListener("error", (event) => {
  const span = tracer.startSpan("js-error");
  span.recordException(event.error);
  span.end();
});

window.addEventListener("unhandledrejection", (event) => {
  const span = tracer.startSpan("promise-rejection");
  span.recordException(event.reason);
  span.end();
});
