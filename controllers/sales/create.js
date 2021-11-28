const { StatusCodes } = require('http-status-codes');
const salesSchema = require('../../schemas/sales');
const saleServices = require('../../services/sales');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (req, res, next) => {
  try {
  const { error } = salesSchema.validate(req.body);

  if (error) return next(errorTypes.invalidIdOrQuantity);

  const sale = await saleServices.create(req.body);

  if (sale.message) return next(sale);

  return res.status(StatusCodes.OK).json(sale);
  } catch (error) {
    next(error);
  }
};
