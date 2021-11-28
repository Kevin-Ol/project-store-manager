const { StatusCodes } = require('http-status-codes');
const productSchema = require('../../schemas/products');
const productServices = require('../../services/products');

module.exports = async (req, res, next) => {
  const { name, quantity } = req.body;

  const { error } = productSchema.validate({ name, quantity });
  if (error) return next(error);

  const product = await productServices.create({ name, quantity });

  if (product.message) return next(product);

  return res.status(StatusCodes.CREATED).json(product);
};
