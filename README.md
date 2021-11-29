# Projeto Store Manager

Projeto feito como critério avaliativo na escola de programação **Trybe**.

O projeto é uma API criada utilizando Node.JS juntamente com o pacote Express.JS para a criação das rotas, e a biblioteca Joi para validação dos dados enviados. 
Trata-se de uma API de estoque e vendas, capaz de criar, visualizar, alterar ou deletar produtos em estoque ou vendas realizadas, onde cada alteração de venda 
reflete no valor do estoque dos produtos, com os dados armazenados no banco de dados MongoDB. A API foi desenvolvida com a prática de TDD e testes unitários. 
Neste projeto aprendi como criar uma API RESTful em arquitetura MSC e como escrever seus testes utilizando as bibliotecas Mocha, Chain e Sinon.

## Instruções para reproduzir o projeto

1. Inicie o servidor do `mongodb`

2. Clone o repositório
  * `git clone git@github.com:Kevin-Ol/project-store-manager.git`.
  * Entre na pasta do repositório que você acabou de clonar:
    * `cd project-store-manager`

3. Instale as dependências
  * `npm install`

---

## Instruções para testar a API

1. Inicie o projeto
  * `npm start`
  
2. Para executar os testes unitários
  * `npm run test:unit`
  
3. Para executar os testes de integração
  * `npm test`
  
---

## Rotas

### Endpoint POST `/products`

- O corpo da requisição deve ter o seguinte formato:

```json
{
  "name": "product_name",
  "quantity": "product_quantity"
}
```

- `name` deve ser uma string com mais de 5 caracteres e deve ser único;

- `quantity` deve ser um número inteiro maior que 0;

- Caso haja falha na validação a requisição será respondida com o `status 422` e uma mensagem de erro como o exemplo abaixo

```json
{
  "err": {
    "code": "invalid_data",
    "message": "Product already exists"
  }
}
```

- Caso haja sucesso na validação a requisição será respondida com o `status 201` com o seguinte corpo:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

### Endpoint GET `/products`

- O endpoint retorna um array com todos os produtos cadastrados com o `status 200` e o seguinte corpo: 

```json
{
  "products": [
    {
      "_id": "5f43a7ca92d58904914656b6",
      "name": "Produto do Batista",
      "quantity": 100
    },
    {
      "_id": "5f43a7ca92d58904914656b7",
      "name": "Produto do Silva",
      "quantity": 10
    },
  ]
}
```

### Endpoint GET `/products/:id`

- O endpoint retorna o produto cadastrado de acordo com o id na url com o `status 200` e o seguinte corpo: 

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

- Caso o id não exista a requisição será respondida com o `status 422` com o seguinte corpo:

```json
{
  "err": {
    "code": "invalid_data",
    "message": "Wrong id format"
  }
}
```

### Endpoint PUT `/products/:id`

- O corpo da requisição deve ter o seguinte formato:

```json
{
  "name": "product_name",
  "quantity": "product_quantity"
}
```

- `name` deve ser uma string com mais de 5 caracteres e deve ser único;

- `quantity` deve ser um número inteiro maior que 0;

- o `id` do produto deve estar cadastrado;

- Caso haja falha na validação a requisição será respondida com o `status 422` e uma mensagem de erro como o exemplo abaixo

```json
{
  "err": {
    "code": "invalid_data",
    "message": "quantity must be a number"
  }
}
```

- Caso haja sucesso na validação a requisição será respondida com o `status 200` com o seguinte corpo:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

### Endpoint DELETE `/products/:id`

- O endpoint retorna o produto deletado de acordo com o id na url com o `status 200` e o seguinte corpo: 

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

- Caso o id não exista a requisição será respondida com o `status 422` com o seguinte corpo:

```json
{
  "err": {
    "code": "invalid_data",
    "message": "Wrong id format"
  }
}
```

### Endpoint POST `/sales`

- O corpo da requisição deve ter o seguinte formato:

```json
[
  {
    "productId": "product_id",
    "quantity": "product_quantity",
  },
  {
    "productId": "product_id",
    "quantity": "product_quantity",
  },
]
```

- `productId` deve ser o id de um produto cadastrado;

- `quantity` deve ser um número inteiro maior que 0;

- Caso haja falha na validação a requisição será respondida com o `status 422` e uma mensagem de erro como o exemplo abaixo

```json
{
  "err": {
    "code": "invalid_data",
    "message": "Wrong product ID or invalid quantity"
  }
}
```

- Caso a quantidade do produto inserida seja maior que o estoque a requisição será respondida com o `status 404` e uma mensagem de erro como o exemplo abaixo

```json
{
  "err": {
    "code": "stock_problem",
    "message": "Such amount is not permitted to sell"
  }
}
```

- Caso haja sucesso na validação a requisição será respondida com o `status 200` com o seguinte corpo:

```json
{
  "_id": "5f43a7ca92d58904914656b0",
  "itensSold": [
    {
      "productId": "5f43a7ca92d58904914656b6",
      "quantity": "30",
    },
    {
      "productId": "5f43a7ca92d58904914656b7",
      "quantity": "8",
    },
  ]
}
```

### Endpoint GET `/sales`

- O endpoint retorna um array com todos as vendas cadastradas com o `status 200` e o seguinte corpo: 

```json
{
  "sales": [
    {
      "_id": "5f43a7ca92d58904914656b0",
      "itensSold": [
        {
          "productId": "5f43a7ca92d58904914656b6",
          "quantity": "30",
        },
        {
          "productId": "5f43a7ca92d58904914656b7",
          "quantity": "8",
        },
      ]
    },
    {
      "_id": "5f43a7ca92d58904914656b1",
      "itensSold": [
        {
          "productId": "5f43a7ca92d58904914656b6",
          "quantity": "30",
        },
        {
          "productId": "5f43a7ca92d58904914656b7",
          "quantity": "8",
        },
      ]
    },
  ]
}
```

### Endpoint GET `/sales/:id`

- O endpoint retorna a venda cadastrada de acordo com o id na url com o `status 200` e o seguinte corpo: 

```json
{
  "_id": "5f43a7ca92d58904914656b0",
  "itensSold": [
    {
      "productId": "5f43a7ca92d58904914656b6",
      "quantity": "30",
    },
    {
      "productId": "5f43a7ca92d58904914656b7",
      "quantity": "8",
    },
  ]
}
```

- Caso o id não exista a requisição será respondida com o `status 422` com o seguinte corpo:

```json
{
  "err": {
    "code": "not_found",
    "message": "Sale not found"
  }
}
```

### Endpoint PUT `/sales/:id`

- O corpo da requisição deve ter o seguinte formato:

```json
[
  {
    "productId": "product_id",
    "quantity": "product_quantity",
  },
  {
    "productId": "product_id",
    "quantity": "product_quantity",
  },
]
```

- `productId` deve ser o id de um produto cadastrado;

- `quantity` deve ser um número inteiro maior que 0;

- o `id` da venda deve estar cadastrado;

- Caso haja falha na validação a requisição será respondida com o `status 422` e uma mensagem de erro como o exemplo abaixo

```json
{
  "err": {
    "code": "invalid_data",
    "message": "Wrong product ID or invalid quantity"
  }
}
```

- Caso a quantidade do produto inserida seja maior que o estoque a requisição será respondida com o `status 404` e uma mensagem de erro como o exemplo abaixo

```json
{
  "err": {
    "code": "stock_problem",
    "message": "Such amount is not permitted to sell"
  }
}
```

- Caso haja sucesso na validação a requisição será respondida com o `status 200` com o seguinte corpo:

```json
{
  "_id": "5f43a7ca92d58904914656b0",
  "itensSold": [
    {
      "productId": "5f43a7ca92d58904914656b6",
      "quantity": "30",
    },
    {
      "productId": "5f43a7ca92d58904914656b7",
      "quantity": "8",
    },
  ]
}
```

### Endpoint DELETE `/sales/:id`

- O endpoint retorna a venda deletada de acordo com o id na url com o `status 200` e o seguinte corpo: 

```json
{
  "_id": "5f43a7ca92d58904914656b0",
  "itensSold": [
    {
      "productId": "5f43a7ca92d58904914656b6",
      "quantity": "30",
    },
    {
      "productId": "5f43a7ca92d58904914656b7",
      "quantity": "8",
    },
  ]
}
```

- Caso o id não exista a requisição será respondida com o `status 422` com o seguinte corpo:

```json
{
  "err": {
    "code": "not_found",
    "message": "Sale not found"
  }
}
```
