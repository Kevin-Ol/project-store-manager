const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');
const saleSchema = require('../../schemas/sales');
const saleServices = require('../../services/sales');

const errorTypes = require('../../utils/errorTypes');

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const { error } = saleSchema.validate(req.body);

  if (error) return next(errorTypes.invalidIdOrQuantity);

  if (!ObjectId.isValid(id)) {
    return next(errorTypes.invalidId);
  }

  const product = await saleServices.update(id, req.body);

  if (product.message) return next(product);

  return res.status(StatusCodes.OK).json(product);
};
