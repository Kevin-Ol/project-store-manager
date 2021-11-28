const productsModel = require('../../models/products');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (id = '') => {
  if (id) {
    const product = await productsModel.findById(id);

    if (product) {
      return product;
    }

    return errorTypes.productNotFound;
  }

  const products = await productsModel.findAll();

  return products;
};
