const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');
const saleServices = require('../../services/sales');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (req, res, next) => {
  const { id } = req.params;
  
  if (ObjectId.isValid(id)) {
    const sale = await saleServices.find(id);

    if (sale.message) {
      return next(sale);
    }

    return res.status(StatusCodes.OK).json(sale);
  }
  if (id) return next(errorTypes.saleNotFound);

  const sales = await saleServices.find();

  return res.status(StatusCodes.OK).json({ sales });
};
