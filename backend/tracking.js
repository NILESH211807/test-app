const { logs } = require("@opentelemetry/api-logs");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-http");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const {
  WinstonInstrumentation,
} = require("@opentelemetry/instrumentation-winston");
const { resourceFromAttributes } = require("@opentelemetry/resources");
const {
  BatchLogRecordProcessor,
  LoggerProvider,
} = require("@opentelemetry/sdk-logs");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ATTR_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");

const OTEL_EXPORTER_OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const OTEL_SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "node-service";

// traceExporter
const traceExporter = new OTLPTraceExporter({
  url: OTEL_EXPORTER_OTLP_ENDPOINT
    ? `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
    : "http://localhost:4318/v1/traces",
});

// logExporter
const logExporter = new OTLPLogExporter({
  url: OTEL_EXPORTER_OTLP_ENDPOINT
    ? `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`
    : "http://localhost:4318/v1/logs",
});

// Create resource with service name
const resource = new resourceFromAttributes({
  [ATTR_SERVICE_NAME]: OTEL_SERVICE_NAME,
});

// initialize logger provider
const loggerProvider = new LoggerProvider({
  resource,
  processors: [new BatchLogRecordProcessor(logExporter)],
});

logs.setGlobalLoggerProvider(loggerProvider);

const sdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": {
        enabled: false,
      },
    }),
    new WinstonInstrumentation({
      logHook: (span, record) => {
        record["resource.service.name"] = OTEL_SERVICE_NAME;
      },
    }),
  ],
});

try {
  sdk.start();
  console.log("OpenTelemetry SDK started successfully");
} catch (error) {
  console.error("Error starting OpenTelemetry SDK:", error);
}

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("OpenTelemetry SDK shut down successfully"))
    .catch((error) =>
      console.error("Error shutting down OpenTelemetry:", error),
    )
    .finally(() => process.exit(0));
});

module.exports = { loggerProvider };
