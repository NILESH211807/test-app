const dotenv = require("dotenv");
dotenv.config();

// require("./tracking");
// require("./telemetry/metrics");

const express = require("express");
const client = require("prom-client");
const responseTime = require("response-time");

const cookieParser = require("cookie-parser");
const { expressMiddleware } = require("@as-integrations/express5");
const { startServer } = require("./graphql/graphql");
const connectDb = require("./config/db.config");
const cors = require("cors");
const { verifyToken } = require("./utils/jtwToken");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const User = require("./models/user.model");
const frontendErrorRoute = require("./routes/frontendError.route");
const adminRoute = require("./routes/admin.route");
const oauthRoute = require("./routes/oauth.route");
const errorHandler = require("./middlewares/errorHandler");

const helmet = require("helmet");
const logger = require("./logger");
// const { encrypt } = require("./utils/encryption");
// const logger = require("./logger");

const app = express();
const PORT = process.env.PORT || 5000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// const options = {
//   transports: [
//     new LokiTransport({
//       host: "http://127.0.0.1:3100",
//     }),
//   ],
// };
// const logger = createLogger(options);

const register = new client.Registry();

client.collectDefaultMetrics({ register });

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://test-app-three-ochre.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
    xFrameOptions: {
      action: "deny",
    },
  }),
);

// Create a histogram metric to track request response times
const requestResponseTime = new client.Histogram({
  name: "http_request_response_time_seconds",
  help: "Histogram of request response times in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 200, 300, 400, 500, 1000, 2000],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

app.use(
  responseTime((req, res, time) => {
    const end = httpRequestDuration.startTimer();

    requestResponseTime
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .observe(time);

    res.on("finish", () => {
      end({
        method: req.method,
        route: req.route?.path || req.url,
        status_code: res.statusCode,
      });
    });

    logger.info(`Incoming request: ${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  }),
);

app.use("/api", frontendErrorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/oauth", oauthRoute);

const apolloServerStart = async () => {
  const apolloServer = await startServer();
  app.use(
    "/graphql",
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        const token = req?.cookies?.token;
        let user = null;

        if (token) {
          const decode = await verifyToken(token);
          if (decode) {
            const userFromDb = await User.findById(decode.id);
            if (!userFromDb) res.clearCookie("token");

            user = {
              id: userFromDb._id,
              email: userFromDb.email,
              role: userFromDb.role,
              permissions: userFromDb.permissions,
            };
          }
        }

        return { req, res, user };
      },
    }),
  );
};

apolloServerStart();

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

// saveUserToDatabase();

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

//
app.use(errorHandler);

connectDb();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
