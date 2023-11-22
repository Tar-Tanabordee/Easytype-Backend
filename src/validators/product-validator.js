const Joi = require("joi");

const createProductSchema = Joi.object({
  productImage: Joi.string(),
  productName: Joi.string().trim().required(),
  size: Joi.string().valid("small", "medium", "large"),
  description: Joi.string().trim().required(),
  price: Joi.number().required(),
});

const updateProductSchema = Joi.object({
  productImage: Joi.string(),
  productName: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().required(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
