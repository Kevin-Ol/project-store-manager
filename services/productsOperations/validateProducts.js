const productsModel = require('../../models/products');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (sales) => {
  const products = sales.map((sale) => sale.productId);
  const productsRegistered = await productsModel.findManyById(products);
  
  const productsChecked = products.map((product) => 
  productsRegistered.find(({ _id }) => product === _id.toString()));
  
  if (productsChecked.some((product) => product === undefined)) {
    return errorTypes.invalidIdOrQuantity;
  }

  return productsChecked;
};
