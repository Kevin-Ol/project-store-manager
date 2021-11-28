const productsModel = require('../../models/products');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (product) => {
  const productExists = await productsModel.findByName(product.name);

  if (productExists) return errorTypes.duplicatedProduct;

  const createdProduct = await productsModel.create(product);

  return createdProduct;
};
