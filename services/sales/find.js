const salesModel = require('../../models/sales');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (id = '') => {
  if (id) {
    const sale = await salesModel.findById(id);

    if (sale) {
      return sale;
    }

    return errorTypes.saleNotFound;
  }

  const sales = await salesModel.findAll();

  return sales;
};
