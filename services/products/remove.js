const productsModel = require('../../models/products');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (id) => {
  const removedProduct = await productsModel.remove(id);

  if (!removedProduct) {
    return errorTypes.productNotFound;
  }

  return removedProduct;
};
