const invalidData = (message) => ({
  code: 'invalid_data',
  message,
});

const stockProblem = (message) => ({
  code: 'stock_problem',
  message,
});

const notFound = (message) => ({
  code: 'not_found',
  message,
});

const serializeJoiProductValidation = (error) => {
  let { message } = error;
  if (message.includes('greater')) {
    message = message.replace('greater', 'larger');
  }
  const errorMessage = invalidData(message);
  return errorMessage;
};

module.exports = {
  duplicatedProduct: invalidData('Product already exists'),
  productNotFound: invalidData('Wrong id format'),
  invalidId: invalidData('Wrong id format'),
  invalidIdOrQuantity: invalidData('Wrong product ID or invalid quantity'),
  outOfStock: stockProblem('Such amount is not permitted to sell'),
  saleNotFound: notFound('Sale not found'),
  wrongSaleId: invalidData('Wrong sale ID format'),
  joiProductValidation: (error) => serializeJoiProductValidation(error),
};
