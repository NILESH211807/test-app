const mongoose = require("mongoose");
const { fieldEncryption } = require("../utils/encryption");

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  redirectUri: {
    type: String,
    required: true,
  },
  scopes: [String],
});

productSchema.plugin(fieldEncryption, {
  fields: ["name", "clientId", "clientSecret", "redirectUri"],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
