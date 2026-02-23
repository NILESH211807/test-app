const AppError = require("./appError");

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: true,
  });

  if (error) {
    const clearedMessage = error.details[0].message.replace(/"/g, "");
    throw new AppError(clearedMessage);
  }

  return value;
};

module.exports = validate;
