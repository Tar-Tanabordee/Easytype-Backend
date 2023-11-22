const Joi = require("joi");

const addressValidateSchema = Joi.object({
  addressInfo: Joi.string().required(),
  subDistrict: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
  postcode: Joi.string()
    .pattern(/^[0-9]{0,5}$/)
    .required(),
});

module.exports = { addressValidateSchema };
