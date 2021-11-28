const salesModel = require('../../models/sales');
const productsModel = require('../../models/products');
const productsOperationsServices = require('../productsOperations');
const errorTypes = require('../../utils/errorTypes');

const checkProductsBalance = (oldProducts, newProducts, sales) => {
  const allProducts = [...oldProducts];

  newProducts.forEach((newProduct) => {
    const { _id: newProductId } = newProduct;
    const productAlreadyOnSale = oldProducts.some(({ _id: oldProductId }) => 
      oldProductId.toString() === newProductId.toString());
    if (!productAlreadyOnSale) {
      allProducts.push(newProduct);
    }
  });

  sales.forEach((sale) => {
    const product = allProducts.find(({ _id }) => _id.toString() === sale.productId);
    product.quantity -= sale.quantity;
  });

  if (allProducts.some((product) => product.quantity < 0)) return errorTypes.outOfStock;

  return allProducts;
};

module.exports = async (id, sales) => {
  const validSale = await salesModel.findById(id);

  if (!validSale) return errorTypes.invalidIdOrQuantity;

  const oldProducts = await productsOperationsServices.validateProducts(validSale.itensSold);

  validSale.itensSold.forEach((sale) => {
    const product = oldProducts.find(({ _id }) => _id.toString() === sale.productId);
    product.quantity += sale.quantity;
  });

  const newProducts = await productsOperationsServices.validateProducts(sales);

  if (newProducts.message) return newProducts;

  const allProducts = checkProductsBalance(oldProducts, newProducts, sales);

  if (allProducts.message) return allProducts;

  const updatedQuantity = allProducts.map(({ _id, quantity }) => 
    productsModel.updateQuantity(_id, { quantity }));

  await Promise.all(updatedQuantity);

  const updatedSale = await salesModel.update(id, { itensSold: sales });

  return updatedSale;
};
