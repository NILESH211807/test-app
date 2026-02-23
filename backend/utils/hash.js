const crypto = require("crypto");

module.exports.hashText = async (text) => {
  return crypto.createHash("sha256").update(text.toLowerCase()).digest("hex");
};
