const productsModel = require('../../models/products');
const errorTypes = require('../../utils/errorTypes');

module.exports = async ({ sales, productsChecked }) => {
  sales.forEach((sale) => {
    const product = productsChecked.find(({ _id }) => _id.toString() === sale.productId);
    product.quantity -= sale.quantity;
  });
  
  if (productsChecked.some((product) => product.quantity < 0)) {
    return errorTypes.outOfStock;
  }

  const updatedQuantity = productsChecked.map(({ _id, quantity }) => 
    productsModel.updateQuantity(_id, { quantity }));

  await Promise.all(updatedQuantity);

  return sales;
};
