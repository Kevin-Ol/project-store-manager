const salesModel = require('../../models/sales');
const productsOperationsServices = require('../productsOperations');

module.exports = async (sales) => {
  const productsChecked = await productsOperationsServices.validateProducts(sales);

  if (productsChecked.message) {
    return productsChecked;
  }

  const itensSold = await productsOperationsServices.decrementProducts({ sales, productsChecked });

  if (itensSold.message) {
    return itensSold;
  }

  const insertedSale = await salesModel.create({ itensSold });
  return insertedSale;
};
