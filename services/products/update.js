const productsModel = require('../../models/products');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (id, product) => {
  const updatedProduct = await productsModel.update(id, product);

  if (!updatedProduct) {
    return errorTypes.productNotFound;
  }

  return updatedProduct;
};
