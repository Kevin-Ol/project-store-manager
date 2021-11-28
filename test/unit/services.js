const sinon = require('sinon');
const { expect } = require('chai');

const productsModel = require('../../models/products');
const salesModel = require('../../models/sales');
const productsService = require('../../services/products');
const salesService = require('../../services/sales');
const productsOperationsService = require('../../services/productsOperations');

describe('Services de produtos', () => {
  describe('1 - Cadastro de produtos', () => {
    const expectedProduct = {
      name: "Produto do Batista",
      quantity: 100,
    }

    afterEach(() => {
      productsModel.findByName.restore();
    })

    it('Quando o produto já existe retorna objeto de erro', async () => {
      sinon.stub(productsModel, 'findByName').resolves(true);
  
      const expectedError = {
          code: 'invalid_data',
          message: 'Product already exists',
      }

      const product = await productsService.create(expectedProduct);
      expect(product).to.be.deep.equal(expectedError);
    });

    it('Quando o produto não existe retorna produto criado', async () => {
      sinon.stub(productsModel, 'findByName').resolves(null);
      sinon.stub(productsModel, 'create').resolves(expectedProduct);

      const product = await productsService.create(expectedProduct);
      expect(product).to.be.deep.equal(expectedProduct);
    })
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


    it('Retorna todos produtos cadastrados', async () => {
      sinon.stub(productsModel, 'findAll').resolves(expectedProducts);
      
      const products = await productsService.find();

      expect(products).to.be.deep.equal(expectedProducts);
      productsModel.findAll.restore();
    });


    it('Retorna erro quando não existe produto com o id informado', async () => {
      sinon.stub(productsModel, 'findById').resolves(null);

      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong id format',
      }
      
      const product = await productsService.find('6194ed2049de4fd18af325b7');

      expect(product).to.be.deep.equal(expectedError);
      productsModel.findById.restore();
    });

    it('Retorna produto de acordo com id informado', async () => {
      sinon.stub(productsModel, 'findById').resolves(expectedProducts[0]);
      
      const product = await productsService.find('6194ed2049de4fd18af325b7');

      expect(product).to.be.deep.equal(expectedProducts[0]);
      productsModel.findById.restore();
    });
  });

  describe('3 - Atualização de produtos', () => {
    const updatedProduct = {
      name: "Produto do Batista",
      quantity: 50,
    };

    afterEach(() => {
      productsModel.update.restore();
    });

    it('Retorna erro quando não existe produto com o id informado', async () => {
      sinon.stub(productsModel, 'update').resolves(null);

      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong id format',
      }
      
      const product = await productsService.update('6194ed2049de4fd18af325b7');

      expect(product).to.be.deep.equal(expectedError);
    });

    it('Retorna produto de acordo com id informado', async () => {
      sinon.stub(productsModel, 'update').resolves(updatedProduct);
      
      const product = await productsService.update('6194ed2049de4fd18af325b7');

      expect(product).to.be.deep.equal(updatedProduct);
    });
  });

  describe('4 - Remoção de produtos', () => {
    const expectedProduct = {
      name: "Produto do Batista",
      quantity: 100,
    };

    afterEach(() => {
      productsModel.remove.restore();
    });

    it('Retorna erro quando não existe produto com o id informado', async () => {
      sinon.stub(productsModel, 'remove').resolves(null);

      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong id format',
      }
      
      const product = await productsService.remove('6194ed2049de4fd18af325b7');

      expect(product).to.be.deep.equal(expectedError);
    });

    it('Retorna produto removido de acordo com id informado', async () => {
      sinon.stub(productsModel, 'remove').resolves(expectedProduct);
      
      const product = await productsService.remove('6194ed2049de4fd18af325b7');

      expect(product).to.be.deep.equal(expectedProduct);
    });
  });
});

describe('Services de vendas', () => {
  describe('5 - Cadastro de vendas', () => {
    const sales = [
      {
        productId: '6194ed2049de4fd18af325b7',
        quantity: 2,
      },
      {
        productId: '6194ed2049de4fd18af325b8',
        quantity: 6,
      },
    ];

    
    describe('Validação dos produtos', () => {
      const dbProducts = [
        { _id: '6194ed2049de4fd18af325b7', name: 'Martelo de Thor', quantity: 10 },
        { _id: '6194ed2049de4fd18af325b8', name: 'Traje de encolhimento', quantity: 20 },
      ];

      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      }

      afterEach(() => {
        productsModel.findManyById.restore();
      });

      it('Retorna erro quando é fornecido id de produto não cadastrado', async () => {
        sinon.stub(productsModel, 'findManyById').resolves([]);

        const productsChecked = await productsOperationsService.validateProducts(sales);
        expect(productsChecked).to.be.deep.equal(expectedError);
      });

      it('Retorna produtos quando todos ids são válidos', async () => {
        sinon.stub(productsModel, 'findManyById').resolves(dbProducts);

        const productsChecked = await productsOperationsService.validateProducts(sales);
        expect(productsChecked).to.be.deep.equal(dbProducts);
      });
    });

    describe('Reduz produtos do estoque', () => {
      const expectedError = {
        code: 'stock_problem',
        message: 'Such amount is not permitted to sell',
      }

      after(() => {
        productsModel.updateQuantity.restore();
      });

      it('Retorna erro quando a quantidade é maior que o estoque', async () => {
        const dbProducts = [
          { _id: '6194ed2049de4fd18af325b7', name: 'Martelo de Thor', quantity: 10 },
          { _id: '6194ed2049de4fd18af325b8', name: 'Traje de encolhimento', quantity: 20 },
        ];

        const wrongSales = [
          {
            productId: '6194ed2049de4fd18af325b7',
            quantity: 2,
          },
          {
            productId: '6194ed2049de4fd18af325b8',
            quantity: 60,
          },
        ];

        const validSales = await productsOperationsService.decrementProducts(
          { sales: wrongSales, productsChecked: dbProducts }
        );
        expect(validSales).to.be.deep.equal(expectedError);
      });

      it('Retorna vendas quando há quantidade no estoque', async () => {
        const dbProducts = [
          { _id: '6194ed2049de4fd18af325b7', name: 'Martelo de Thor', quantity: 10 },
          { _id: '6194ed2049de4fd18af325b8', name: 'Traje de encolhimento', quantity: 20 },
        ];

        sinon.stub(productsModel, 'updateQuantity').resolves({});
        const validSales = await productsOperationsService.decrementProducts(
          { sales, productsChecked: dbProducts }
        );
        expect(validSales).to.be.deep.equal(sales);
      });
    });

    describe('Criação de venda', () => {

      afterEach(() => {
        productsOperationsService.validateProducts.restore();
      });

      after(() => {
        salesModel.create.restore();
      })

      it('Retorna erro caso haja mensagem de erro na validação dos produtos', async () => {
        sinon.stub(productsOperationsService, 'validateProducts').resolves({ message: true });
  
        const insertedSale = await salesService.create(sales);
        expect(insertedSale).to.be.deep.equal({ message: true });
      });
  
      it('Retorna erro caso haja mensagem de erro na quantidade de estoque', async () => {
        sinon.stub(productsOperationsService, 'validateProducts').resolves({});
        sinon.stub(productsOperationsService, 'decrementProducts').resolves({ message: true });
  
        const insertedSale = await salesService.create(sales);
        expect(insertedSale).to.be.deep.equal({ message: true });
        productsOperationsService.decrementProducts.restore();
      });

      it('Quando há produto em estoque retorna a venda criada', async () => {
        sinon.stub(productsOperationsService, 'validateProducts').resolves({});
        sinon.stub(productsOperationsService, 'decrementProducts').resolves(sales);
        sinon.stub(salesModel, 'create').resolves({ itensSold: sales });
  
        const insertedSale = await salesService.create(sales);
        expect(insertedSale).to.be.deep.equal({ itensSold: sales });
        productsOperationsService.decrementProducts.restore();
      });
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


    it('Retorna todas vendas cadastrados', async () => {
      sinon.stub(salesModel, 'findAll').resolves(expectedSales);
      
      const sales = await salesService.find();

      expect(sales).to.be.deep.equal(expectedSales);
      salesModel.findAll.restore();
    });


    it('Retorna erro quando não existe venda com o id informado', async () => {
      sinon.stub(salesModel, 'findById').resolves(null);

      const expectedError = {
        code: 'not_found',
        message: 'Sale not found',
      }
      
      const sale = await salesService.find('6194ed2049de4fd18af325b7');

      expect(sale).to.be.deep.equal(expectedError);
      salesModel.findById.restore();
    });

    it('Retorna produto de acordo com id informado', async () => {
      sinon.stub(salesModel, 'findById').resolves(expectedSales[0]);
      
      const sale = await salesService.find('6194ed2049de4fd18af325b7');

      expect(sale).to.be.deep.equal(expectedSales[0]);
      salesModel.findById.restore();
    });
  });

  describe('7 - Atualização de vendas', () => {
    const updatedSale = {
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

    afterEach(() => {
      salesModel.findById.restore();
    });

    after(() => {
      salesModel.update.restore()
    })

    it('Retorna erro quando não existe venda com o id informado', async () => {
      sinon.stub(salesModel, 'findById').resolves(null);

      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      }
      
      const sale = await salesService.update('6194ed2049de4fd18af325b7');

      expect(sale).to.be.deep.equal(expectedError);
    });

    it('Retorna mensagem de erro caso seja informado produto com id inválido', async () => {
      sinon.stub(salesModel, 'findById').resolves({ itensSold: [] });
      sinon.stub(productsOperationsService, 'validateProducts')
        .onCall(0).resolves([])
        .onCall(1).resolves({message: true});

      const sale = await salesService.update('6194ed2049de4fd18af325b7');

      expect(sale).to.be.deep.equal({message: true});
      productsOperationsService.validateProducts.restore();
    });

    it('Retorna mensagem de erro nao haja produto em estoque', async () => {
      const validSale = {
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

      const oldProducts = [
        {
          _id: "5f43ba273200020b101fe49f",
          quantity: 20
        },
        {
          _id: "5f43ba273200020b101fe49g",
          quantity: 20
        },
      ];


      const newProducts = [
        {
          _id: "5f43ba273200020b101fe49f",
          quantity: 20
        },
      ];

      const updatedSale = {
        itensSold: [
          {
            productId: "5f43ba273200020b101fe49f",
            quantity: 30
          },
        ]
      };

      const expectedError = {
        code: 'stock_problem',
        message: 'Such amount is not permitted to sell',
      }

      sinon.stub(salesModel, 'findById').resolves(validSale);
      sinon.stub(productsOperationsService, 'validateProducts')
        .onCall(0).resolves(oldProducts)
        .onCall(1).resolves(newProducts);

      const sale = await salesService.update('6194ed2049de4fd18af325b7', updatedSale.itensSold);

      expect(sale).to.be.deep.equal(expectedError);
      productsOperationsService.validateProducts.restore();
    });

    it('Retorna produto atualizado caso haja quantidade em estoque', async () => {
      sinon.stub(salesModel, 'findById').resolves({ itensSold: [] });
      sinon.stub(productsOperationsService, 'validateProducts')
        .onCall(0).resolves([])
        .onCall(1).resolves([]);
      sinon.stub(salesModel, 'update').resolves(updatedSale);

      const sale = await salesService.update('6194ed2049de4fd18af325b7', []);

      expect(sale).to.be.deep.equal(updatedSale);
      productsOperationsService.validateProducts.restore();
    });
  });


  describe('8 - Remoção de vendas', () => {
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


    afterEach(() => {
      salesModel.remove.restore();
    });

    it('Retorna erro quando não existe venda com o id informado', async () => {
      sinon.stub(salesModel, 'remove').resolves(null);

      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
      }
      
      const sale = await salesService.remove('6194ed2049de4fd18af325b7');

      expect(sale).to.be.deep.equal(expectedError);
    });

    it('Retorna venda removida de acordo com id informado', async () => {
      sinon.stub(salesModel, 'remove').resolves(expectedSale);

      sinon.stub(productsOperationsService, 'validateProducts').resolves({});
      sinon.stub(productsOperationsService, 'incrementProducts').resolves({});

      const removedSale = await salesService.remove('6194ed2049de4fd18af325b7');
      expect(removedSale).to.be.deep.equal(expectedSale);
      productsOperationsService.validateProducts.restore();
      productsOperationsService.incrementProducts.restore();
    });
  });
});
