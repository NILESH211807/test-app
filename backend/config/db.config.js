const mongoose = require("mongoose");
const logger = require("../logger");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/rolebase");
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database not connected", { message: error.message });
    process.exit();
  }
};

module.exports = connectDb;
