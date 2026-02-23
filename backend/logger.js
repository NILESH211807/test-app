const winston = require("winston");
const LokiTransport = require("winston-loki");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: {
    service: process.env.OTEL_SERVICE_NAME || "rolebase-app",
  },
  transports: [
    new winston.transports.Console(),

    new LokiTransport({
      host: "https://loki.nileshpaswan.site",
      labels: { app: "rolebase-app" },
      json: true,
      batching: true,
      interval: 5,
    }),
  ],
});

module.exports = logger;
