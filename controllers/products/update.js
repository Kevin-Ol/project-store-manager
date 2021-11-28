const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');
const productSchema = require('../../schemas/products');
const productServices = require('../../services/products');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (req, res, next) => {
  const { name, quantity } = req.body;
  const { id } = req.params;

  const { error } = productSchema.validate({ name, quantity });
  if (error) return next(error);

  if (!ObjectId.isValid(id)) {
    return next(errorTypes.invalidId);
  }

  const product = await productServices.update(id, { name, quantity });

  if (product.message) return next(product);

  return res.status(StatusCodes.OK).json(product);
};
