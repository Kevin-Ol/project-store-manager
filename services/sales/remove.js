const salesModel = require('../../models/sales');
const errorTypes = require('../../utils/errorTypes');
const productsOperationsServices = require('../productsOperations');

module.exports = async (id) => {
  const removedSale = await salesModel.remove(id);

  if (!removedSale) {
    return errorTypes.wrongSaleId;
  }

  const { itensSold } = removedSale;

  const productsChecked = await productsOperationsServices.validateProducts(itensSold);
  await productsOperationsServices.incrementProducts({ sales: itensSold, productsChecked });

  return removedSale;
};
