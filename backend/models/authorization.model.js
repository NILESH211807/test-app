const mongoose = require("mongoose");

const authorizationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    scopes: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Authorization", authorizationSchema);
