const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');
const productServices = require('../../services/products');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (req, res, next) => {
  const { id } = req.params;
  
  if (ObjectId.isValid(id)) {
    const product = await productServices.find(id);

    if (product.message) {
      return next(product);
    }

    return res.status(StatusCodes.OK).json(product);
  }
  if (id) return next(errorTypes.invalidId);

  const products = await productServices.find();

  return res.status(StatusCodes.OK).json({ products });
};
