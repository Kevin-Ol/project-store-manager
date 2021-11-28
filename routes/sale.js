const { Router } = require('express');
const saleControllers = require('../controllers/sales');

const saleRouter = Router();

saleRouter.post('/', saleControllers.create);

saleRouter.get('/', saleControllers.find);

saleRouter.get('/:id', saleControllers.find);

saleRouter.put('/:id', saleControllers.update);

saleRouter.delete('/:id', saleControllers.remove);

module.exports = { saleRouter };
