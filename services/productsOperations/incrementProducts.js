const productsModel = require('../../models/products');

module.exports = async ({ sales, productsChecked }) => {
  sales.forEach((sale) => {
    const product = productsChecked.find(({ _id }) => _id.toString() === sale.productId);
    product.quantity += sale.quantity;
  });

  const updatedQuantity = productsChecked.map(({ _id, quantity }) => 
    productsModel.updateQuantity(_id, { quantity }));

  await Promise.all(updatedQuantity);
};
