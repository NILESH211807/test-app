const mongoose = require("mongoose");
const { fieldEncryption } = require("../utils/encryption");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

postSchema.plugin(fieldEncryption, {
  fields: ["title", "content", "category"],
});

const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;
