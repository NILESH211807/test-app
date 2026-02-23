const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z\s]*$/) // only letters + spaces
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name must be at most 30 characters long",
      "string.pattern.base": "Name should contain only letters",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } }) // avoids strict domain checks
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
    }),

  password: Joi.string().min(6).max(50).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password cannot exceed 50 characters",
  }),
  role: Joi.string().valid("admin").default("user").messages({
    "any.only": "Invalid role",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email address",
    }),

  password: Joi.string().messages({
    "string.empty": "Password is required",
  }),
  role: Joi.string().valid("admin").default("user").messages({
    "any.only": "Invalid role",
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
};
