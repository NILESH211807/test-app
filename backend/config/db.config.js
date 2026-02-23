const mongoose = require("mongoose");
const logger = require("../logger");

const connectDb = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      logger.error("MONGODB_URI is not defined in environment variables");
      process.exit();
    }

    await mongoose.connect(MONGODB_URI);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database not connected", { message: error.message });
    process.exit();
  }
};

module.exports = connectDb;
