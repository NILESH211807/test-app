const redisConfig = require("../config/redis.config");

module.exports.addCache = async (key, value, exTime = 600) => {
  await redisConfig.set(key, value, "EX", exTime);
};

module.exports.getCache = async (key) => {
  return await redisConfig.get(key);
};

module.exports.deleteCache = async (key) => {
  return await redisConfig.del(key);
};
