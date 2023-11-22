const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),

  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

const adminLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().trim().required(),
});

const adminRegisterSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),

  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  role: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z0-9]{0,5}$/)
    .required(),
});
module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  adminLoginSchema,
  adminRegisterSchema,
};
