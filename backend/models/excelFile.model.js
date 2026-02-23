const mongoose = require("mongoose");
const { fieldEncryption } = require("../utils/encryption");

const excelFileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    totalRows: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

excelFileSchema.plugin(fieldEncryption, {
  fields: ["filename", "visibility", "totalRows", "size"],
});

module.exports = mongoose.model("ExcelFile", excelFileSchema);
