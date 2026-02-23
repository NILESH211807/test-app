const crypto = require("crypto");

const KEY = Buffer.from(process.env.ENCRYPTION_KEY);

// Encryption function
const encrypt = (text) => {
  try {
    if (!text) return null;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);

    let encrypted = cipher.update(String(text), "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  } catch (err) {
    return text;
  }
};

// Decryption function
const decrypt = (encryptedText) => {
  try {
    // Must be string
    if (typeof encryptedText !== "string") {
      return encryptedText;
    }

    if (!encryptedText.includes(":")) {
      return encryptedText; // already decrypted
    }

    const [ivHex, encrypted] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    return encryptedText;
  }
};

// auto encrypt and decrypt using mongoose plugin
const fieldEncryption = (schema, options = {}) => {
  const fields = options.fields || [];

  //   Encrypt on create
  schema.pre("save", function () {
    fields.forEach((field) => {
      if (this.isModified(field) && this[field]) {
        this[field] = encrypt(this[field]);
      }
    });
  });

  //   encrypt on update
  schema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function () {
    const update = this.getUpdate();
    fields.forEach((field) => {
      if (update[field]) update[field] = encrypt(update[field]);
      if (update.$set && update.$set[field]) {
        update.$set[field] = encrypt(update.$set[field]);
      }
    });
  });

  // auto decrypt on find
  schema.post(["find", "findOne", "findOneAndUpdate", "save"], function (docs) {
    if (!docs) return;
    const list = Array.isArray(docs) ? docs : [docs];
    // console.log("list", list);
    list.forEach((doc) => {
      fields.forEach((field) => {
        if (doc[field]) {
          doc[field] = decrypt(doc[field]);
        }
      });
    });
  });
};

module.exports = {
  encrypt,
  decrypt,
  fieldEncryption,
};
