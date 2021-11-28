const { Router } = require('express');
const productControllers = require('../controllers/products');

const productRouter = Router();

productRouter.post('/', productControllers.create);

productRouter.get('/', productControllers.find);

productRouter.get('/:id', productControllers.find);

productRouter.put('/:id', productControllers.update);

productRouter.delete('/:id', productControllers.remove);

module.exports = { productRouter };
