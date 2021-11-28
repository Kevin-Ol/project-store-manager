const express = require('express');
const { error } = require('./middlewares/error');
const { productRouter } = require('./routes/product');
const { saleRouter } = require('./routes/sale');

const app = express();

app.use(express.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use('/products', productRouter);

app.use('/sales', saleRouter);

app.use(error);

app.listen(3000, () => console.log('Running on port 3000'));
