const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const getDefaultPermissions = require("../helper/permissionGenerator");
const { fieldEncryption } = require("../utils/encryption");
// const { fieldEncryption } = require("mongoose-field-encryption");
// const { hashText } = require("../utils/hash");
const crypto = require("crypto");

// admin permissions
const PermissionSchema = new mongoose.Schema(
  {
    activeUser: {
      type: Boolean,
      default: true,
    },
    deleteUser: {
      type: Boolean,
      default: false,
    },
    activeAdmin: {
      type: Boolean,
      default: false,
    },
    deleteAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      min: 6,
      max: 64,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    permissions: {
      type: PermissionSchema,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.pre("save", function () {
  const permissions = getDefaultPermissions(this.role);

  if (permissions) {
    this.permissions = permissions;
  } else {
    this.permissions = undefined;
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// userSchema.plugin(fieldEncryption, {
//   fields: ["name", "role", "permissions"],
//   secret: process.env.ENCRYPTION_SECRET_KEY,
//   saltGenerator: function (secret) {
//     return crypto.randomBytes(16);
//   },
// });

// encryption and decryption using mongoose plugin
userSchema.plugin(fieldEncryption, {
  fields: ["name", "role", "permissions"],
});

module.exports = mongoose.model("User", userSchema);
