const Joi = require("joi");

const createBlogValidator = Joi.object({
  title: Joi.string().min(5).max(150).trim().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Title is required",
  }),

  content: Joi.string().min(50).required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content is required",
    "string.min": "Content must be at least 50 characters long",
    "any.required": "Content is required",
  }),

  category: Joi.string().trim().required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),

  tags: Joi.array().items(
    Joi.string().min(1).max(20).trim().messages({
      "string.base": "Each tag must be a string",
      "string.min": "Tags must be at least 2 characters",
      "string.max": "Tags cannot exceed 20 characters",
    }),
  ),
});

module.exports = { createBlogValidator };
