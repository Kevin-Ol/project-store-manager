const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoConnection = require('../../models/connection');
const productsModel = require('../../models/products');
const salesModel = require('../../models/sales');

describe('Models de produtos', () => {
  let connectionMock;
  const DBServer = new MongoMemoryServer();

  before(async () => {
    const URLMock = await DBServer.getUri();
    const client = await MongoClient.connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connectionMock = client.db('StoreManager');

    sinon.stub(mongoConnection, 'connection').resolves(connectionMock);
  });

  after(async () => {
    mongoConnection.connection.restore();
    await DBServer.stop();
  });

  describe('1 - Cadastro de produtos', () => {
    const expectedProduct = {
      name: "Produto do Batista",
      quantity: 100,
    };

    afterEach(async () => {
      await connectionMock.collection('products').drop();
    });

    it('Retorna todos os dados do produto cadastrado', async () => {
      await productsModel.create(expectedProduct);
      const product = await connectionMock.collection('products')
        .findOne({ name: expectedProduct.name});

      expect(product).to.be.deep.equal(expectedProduct);
    });

    it('Encontra o produto através de seu nome', async () => {
      await connectionMock.collection('products').insertOne(expectedProduct);
      const product = await productsModel.findByName(expectedProduct.name);
      expect(product).to.be.deep.equal(expectedProduct);
    });
  });

    describe('2 - Listagem de produtos', () => {
    const expectedProducts = [
      {
        name: "Produto do Batista",
        quantity: 100,
      },
      {
        name: "Produto do Silva",
        quantity: 100,
      }
    ];

    afterEach(async () => {
      await connectionMock.collection('products').drop();
    });

    it('Retorna todos produtos cadastrados', async () => {
      await connectionMock.collection('products').insertMany(expectedProducts);
      const products = await productsModel.findAll();

      expect(products).to.be.deep.equal(expectedProducts);
    });

    it('Retorna null quando não existe produto com o id informado', async () => {
      await connectionMock.collection('products').insertOne(expectedProducts[0]);
      const product = await productsModel.findById('6194ed2049de4fd18af325b7');

      expect(product).to.be.null;
    });

    it('Retorna produto de acordo com id informado', async () => {
      await connectionMock.collection('products').insertOne(expectedProducts[0]);
      const product = await productsModel.findById(expectedProducts[0]._id);

      expect(product).to.be.deep.equal(expectedProducts[0]);
    });
  });

  describe('3 - Atualização de produtos', () => {
    const expectedProduct = {
      name: "Produto do Batista",
      quantity: 100,
    };

    afterEach(async () => {
      await connectionMock.collection('products').drop();
    });

    it('Retorna null quando não existe produto com o id informado', async () => {
      await connectionMock.collection('products').insertOne(expectedProduct);
      const product = await productsModel.update('6194ed2049de4fd18af325b7', expectedProduct);

      expect(product).to.be.null;
    });

    it('Retorna produto atualizado de acordo com id informado', async () => {
      const updatedProduct = {
        name: "Produto do Batista",
        quantity: 50,
      };

      await connectionMock.collection('products').insertOne(expectedProduct);
      const product = await productsModel.update(expectedProduct._id, updatedProduct);

      expect(product).to.be.deep.equal({...expectedProduct, ...updatedProduct});
    });
  });

  describe('4 - Remoção de produtos', () => {
    const expectedProduct = {
      name: "Produto do Batista",
      quantity: 100,
    };

    afterEach(async () => {
      await connectionMock.collection('products').drop();
    });

    it('Retorna null quando não existe produto com o id informado', async () => {
      await connectionMock.collection('products').insertOne(expectedProduct);
      const product = await productsModel.remove('6194ed2049de4fd18af325b7');

      expect(product).to.be.null;
    });

    it('Retorna produto removido de acordo com id informado', async () => {
      await connectionMock.collection('products').insertOne(expectedProduct);
      const product = await productsModel.remove(expectedProduct._id);
      const products = await connectionMock.collection('products').find().toArray();
      
      expect(product).to.be.deep.equal(expectedProduct);
      expect(products).to.be.deep.equal([]);
    });
  });

  describe('5 - Listagem de vários produtos', () => {
    const expectedProducts = [
      {
        name: "Produto do Batista",
        quantity: 100,
      },
      {
        name: "Produto do Silva",
        quantity: 100,
      }
    ];

    after(async () => {
      await connectionMock.collection('products').drop();
    });

    it('Retorna array vazio quando não existe produto com os ids informados', async () => {
      const products = await productsModel.findManyById(
        ['6194ed2049de4fd18af325b7', '6194ed2049de4fd18af325b8']
      );

      expect(products).to.be.deep.equal([]);
    });

    it('Retorna um produto cadastrado', async () => {
      await connectionMock.collection('products').insertOne(expectedProducts[0]);
      const products = await productsModel.findManyById(
        [expectedProducts[0]._id]
      );

      expect(products).to.be.deep.equal([expectedProducts[0]]);
      await connectionMock.collection('products').drop();
    });

    it('Retorna todos produtos cadastrados', async () => {
      await connectionMock.collection('products').insertMany(expectedProducts);
      const products = await productsModel.findManyById(
        [expectedProducts[0]._id, expectedProducts[1]._id]
      );

      expect(products).to.be.deep.equal(expectedProducts);
    });
  });

  describe('9 - Atualização de produtos', () => {
    const insertedProduct = {
      name: "Produto do Batista",
      quantity: 100,
    };

    after(async () => {
      await connectionMock.collection('products').drop();
    });

    it('Atualiza a quantidade do produto corretamente', async () => {
    await connectionMock.collection('products').insertOne(insertedProduct);
    const product = await productsModel.updateQuantity(insertedProduct._id, { quantity: 80 });

    expect(product).to.be.deep.equal({...insertedProduct, quantity: 80});
    });
  });
});

describe('Models de vendas', () => {
  let connectionMock;
  const DBServer = new MongoMemoryServer();

  before(async () => {
    const URLMock = await DBServer.getUri();
    const client = await MongoClient.connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connectionMock = client.db('StoreManager');

    sinon.stub(mongoConnection, 'connection').resolves(connectionMock);
  });

  after(async () => {
    mongoConnection.connection.restore();
    await DBServer.stop();
  });

  describe('5 - Cadastro de vendas', () => {
    const expectedSale = {
      itensSold: [
        {
          productId: "5f43ba273200020b101fe49f",
          quantity: 2
        }
      ]
    }

    afterEach(async () => {
      await connectionMock.collection('sales').drop();
    });

    it('Retorna todos os dados da venda cadastrada', async () => {
      await salesModel.create(expectedSale);
      const sale = await connectionMock.collection('sales')
        .findOne({ _id: expectedSale._id });

      expect(sale).to.be.deep.equal(expectedSale);
    });
  });

  describe('6 - Listagem de vendas', () => {
    const expectedSales = [{
      itensSold: [
        {
          productId: "5f43ba273200020b101fe49f",
          quantity: 2
        },
        {
          productId: "5f43ba273200020b101fe49g",
          quantity: 2
        },
      ]
    }];

    afterEach(async () => {
      await connectionMock.collection('sales').drop();
    });

    it('Retorna todas vendas cadastradas', async () => {
      await connectionMock.collection('sales').insertMany(expectedSales);
      const sales = await salesModel.findAll();

      expect(sales).to.be.deep.equal(expectedSales);
    });

    it('Retorna null quando não existe produto com o id informado', async () => {
      await connectionMock.collection('sales').insertOne(expectedSales[0]);
      const sale = await salesModel.findById('6194ed2049de4fd18af325b7');

      expect(sale).to.be.null;
    });

    it('Retorna produto de acordo com id informado', async () => {
      await connectionMock.collection('sales').insertOne(expectedSales[0]);
      const sale = await salesModel.findById(expectedSales[0]._id);

      expect(sale).to.be.deep.equal(expectedSales[0]);
    });
  });

  describe('7 - Atualização de vendas', () => {
    const expectedSale = {
      itensSold: [
        {
          productId: "5f43ba273200020b101fe49f",
          quantity: 2
        },
        {
          productId: "5f43ba273200020b101fe49g",
          quantity: 2
        },
      ]
    };

    afterEach(async () => {
      await connectionMock.collection('sales').drop();
    });

    it('Retorna null quando não existe venda com o id informado', async () => {
      await connectionMock.collection('sales').insertOne(expectedSale);
      const sale = await salesModel.update('6194ed2049de4fd18af325b7', expectedSale);

      expect(sale).to.be.null;
    });

    it('Retorna venda atualizada de acordo com id informado', async () => {
      const updatedSale = {
        itensSold: [
          {
            productId: "5f43ba273200020b101fe49f",
            quantity: 20
          },
        ]
      };

      await connectionMock.collection('sales').insertOne(expectedSale);
      const sale = await salesModel.update(expectedSale._id, updatedSale);

      expect(sale).to.be.deep.equal({...expectedSale, ...updatedSale});
    });
  });

  describe('8 - Remoção de vendas', () => {
    const expectedSale = {
      itensSold: [
        {
          productId: "5f43ba273200020b101fe49f",
          quantity: 2
        }
      ]
    }

    afterEach(async () => {
      await connectionMock.collection('sales').drop();
    });

    it('Retorna null quando não existe venda com o id informado', async () => {
      await connectionMock.collection('sales').insertOne(expectedSale);
      const sale = await salesModel.remove('6194ed2049de4fd18af325b7');

      expect(sale).to.be.null;
    });

    it('Retorna venda removida de acordo com id informado', async () => {
      await connectionMock.collection('sales').insertOne(expectedSale);
      const sale = await salesModel.remove(expectedSale._id);
      const sales = await connectionMock.collection('sales').find().toArray();
      
      expect(sale).to.be.deep.equal(expectedSale);
      expect(sales).to.be.deep.equal([]);
    });
  });
});
