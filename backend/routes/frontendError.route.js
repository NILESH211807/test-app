const express = require("express");
const { trace } = require("@opentelemetry/api");

const router = express.Router();
const tracer = trace.getTracer("frontend-monitoring");

router.post("/frontend-error", (req, res) => {
  const span = tracer.startSpan("frontend-error");

  span.recordException({
    message: req.body.message,
    stack: req.body.stack,
  });

  span.setAttribute("url", req.body.url);
  span.setAttribute("userAgent", req.body.userAgent);

  span.end();

  res.status(200).json({ success: true });
});

module.exports = router;
