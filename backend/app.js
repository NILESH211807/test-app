const dotenv = require("dotenv");
dotenv.config();

// require("./tracking");
// require("./telemetry/metrics");

const express = require("express");

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
const { encrypt } = require("./utils/encryption");
const logger = require("./logger");

const app = express();
const PORT = process.env.PORT || 5000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
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

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

app.use("/api", frontendErrorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/oauth", oauthRoute);

const apolloServerStart = async () => {
  const apolloServer = await startServer();
  app.use(
    "/graphql",
    cors({
      origin: "http://localhost:5173",
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
  res.send("Hello World!");
});

// saveUserToDatabase();

//
app.use(errorHandler);

connectDb();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
