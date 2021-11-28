const Joi = require('joi');

const productsSchema = Joi.object({
  name: Joi.string().min(5).required(),
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = productsSchema;
