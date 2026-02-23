const Redis = require("ioredis");

const redisConfig = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
});

redisConfig.on("connect", () => {
  console.log("✅ Redis connected");
});

redisConfig.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

module.exports = redisConfig;
