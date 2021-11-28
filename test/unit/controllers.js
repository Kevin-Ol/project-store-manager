const sinon = require('sinon');
const { expect } = require('chai');
const { ObjectId } = require('mongodb');

const schemasProduct = require('../../schemas/products');
const schemasSale = require('../../schemas/sales');
const productsService = require('../../services/products');
const salesService = require('../../services/sales');
const productsController = require('../../controllers/products');
const salesController = require('../../controllers/sales');

const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe('Controller de produtos', () => {
  describe('1 - Cadastro de produtos', () => {
    describe('Quando há erros de validação', () => {
      const response = {};
      const request = {};
      const next = sinon.stub().returns();
  
      
      beforeEach(() => {
        sinon.stub(schemasProduct, 'validate').returns({error: true});
      })
  
      afterEach(() => {
        schemasProduct.validate.restore();
      })
      
      it('Envia erro para o middleware quando o nome tem menos de 5 caracteres', async () => {
        request.body = {
          "name": "Prod"
        }

        await productsController.create(request, response, next);

        expect(next).to.be.calledWith(true);
      });

      it('Envia erro para o middleware quando a quantidade é menor que 0', async () => {
          request.body = {
            "name": "Produto do Batista",
            "quantity": -1,
          }

          await productsController.create(request, response, next);

          expect(next).to.be.calledWith(true);
        });

      it('Envia erro para o middleware quando a quantidade é igual a 0', async () => {
          request.body = {
            "name": "Produto do Batista",
            "quantity": 0,
          }

          await productsController.create(request, response, next);

          expect(next).to.be.calledWith(true);
        });

      it('Envia erro para o middleware quando a quantidade é uma string', async () => {
          request.body = {
            "name": "Produto do Batista",
            "quantity": '50',
          }

          await productsController.create(request, response, next);

          expect(next).to.be.calledWith(true);
        });
    });

    describe('Quando não há erros de validação', () => {
      const response = {};
      const request = {};
      const next = sinon.stub().returns();
  
      beforeEach(() => {
        request.body = {
          "name": "Produto do Batista",
          "quantity": 50,
        }

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(schemasProduct, 'validate').returns({});

      });

      afterEach(() => {
        productsService.create.restore();
        schemasProduct.validate.restore();
      });

      it('Envia erro para o middleware quando o nome ja está cadastrado', async () => {
        sinon.stub(productsService, 'create').resolves({message: true});

        await productsController.create(request, response, next);

        expect(next).to.be.calledWith({message: true});
      });

      it('Cria produto com sucesso', async () => {
        const expectedProduct = {
          name: "Produto do Batista",
          quantity: 100,
        }
        sinon.stub(productsService, 'create').resolves(expectedProduct);
        
        await productsController.create(request, response, next);
        expect(response.status).to.be.calledWith(201);
        expect(response.json).to.be.calledWith(expectedProduct);
      });
    });
  });

  describe('2 - Listagem de produtos', () => {
    const expectedProducts = [
      {
        _id: '6194ed2049de4fd18af325b7',
        name: "Produto do Batista",
        quantity: 100,
      },
      {
        _id: '6194ed2049de4fd18af325b8',
        name: "Produto do Silva",
        quantity: 100,
      }
    ];

    const response = {};
    const request = {};
    const next = sinon.stub().returns();

    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
    });
    
    afterEach(() => {
      productsService.find.restore();
      ObjectId.isValid.restore();
    })

    it('Lista todos produtos quando id não é informado', async () => {
      request.params = {}


      sinon.stub(productsService, 'find').resolves(expectedProducts);
      sinon.stub(ObjectId, 'isValid').returns(false);

      await productsController.find(request, response, next);
      expect(response.status).to.be.calledWith(200);
      expect(response.json).to.be.calledWith({ products: expectedProducts });
    });

    it('Envia erro para o middleware quando o id é inválido', async () => {
      request.params = { id: 'aaa' }
      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong id format',
      }

      sinon.stub(productsService, 'find').resolves(expectedProducts);
      sinon.stub(ObjectId, 'isValid').returns(false);

      await productsController.find(request, response, next);
      expect(next).to.be.calledWith(expectedError);
    });

    it('Envia erro para o middleware quando o id informado não está cadastrado', async () => {
      request.params = { id: '6194ed2049de4fd18af325b7'}
      sinon.stub(productsService, 'find').resolves({message: true});
      sinon.stub(ObjectId, 'isValid').returns(true);

      await productsController.find(request, response, next);
      expect(next).to.be.calledWith({message: true});
    });

    it('Retorna produto quando o id informado está cadastrado', async () => {
      request.params = { id: '6194ed2049de4fd18af325b7'}
      sinon.stub(productsService, 'find').resolves(expectedProducts[0]);
      sinon.stub(ObjectId, 'isValid').returns(true);

      await productsController.find(request, response, next);
      expect(response.status).to.be.calledWith(200);
      expect(response.json).to.be.calledWith(expectedProducts[0]);
    });
  });

  describe('3 - Atualização de produtos', () => {
    describe('Quando há erros de validação', () => {
      const response = {};
      const request = {};
      const next = sinon.stub().returns();
  
      
      beforeEach(() => {
        request.params = {}
        sinon.stub(schemasProduct, 'validate').returns({error: true});
      })
  
      afterEach(() => {
        schemasProduct.validate.restore();
      });
      
      it('Envia erro para o middleware quando o nome tem menos de 5 caracteres', async () => {
        request.body = {
          "name": "Prod"
        }

        await productsController.update(request, response, next);

        expect(next).to.be.calledWith(true);
      });

      it('Envia erro para o middleware quando a quantidade é menor que 0', async () => {
          request.body = {
            "name": "Produto do Batista",
            "quantity": -1,
          }

          await productsController.update(request, response, next);

          expect(next).to.be.calledWith(true);
        });

      it('Envia erro para o middleware quando a quantidade é igual a 0', async () => {
          request.body = {
            "name": "Produto do Batista",
            "quantity": 0,
          }

          await productsController.update(request, response, next);

          expect(next).to.be.calledWith(true);
        });

      it('Envia erro para o middleware quando a quantidade é uma string', async () => {
          request.body = {
            "name": "Produto do Batista",
            "quantity": '50',
          }

          await productsController.update(request, response, next);

          expect(next).to.be.calledWith(true);
        });
    });

    describe('Quando não há erros de validação', () => {
      const updatedProduct = {
        name: "Produto do Batista",
        quantity: 50,
      }

      const response = {};
      const request = {};
      const next = sinon.stub().returns();
  
      beforeEach(() => {
        request.body = updatedProduct;
        request.params = { id: '6194ed2049de4fd18af325b7' }

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
      });

      afterEach(() => {
        productsService.update.restore();
        ObjectId.isValid.restore();
      });

      it('Envia erro para o middleware quando o id é inválido', async () => {
        request.params = { id: 'aaa' }
        const expectedError = {
          code: 'invalid_data',
          message: 'Wrong id format',
        }

        sinon.stub(productsService, 'update').resolves(updatedProduct);
        sinon.stub(ObjectId, 'isValid').returns(false);
  
        await productsController.update(request, response, next);
        expect(next).to.be.calledWith(expectedError);
      });

      it('Envia erro para o middleware quando o id informado não está cadastrado', async () => {
        sinon.stub(productsService, 'update').resolves({message: true});
        sinon.stub(ObjectId, 'isValid').returns(true);
  
        await productsController.update(request, response, next);
        expect(next).to.be.calledWith({message: true});
      });

      it('Atualiza produto com sucesso', async () => {
        sinon.stub(productsService, 'update').resolves(updatedProduct);
        sinon.stub(ObjectId, 'isValid').returns(true);
        
        await productsController.update(request, response, next);
        expect(response.status).to.be.calledWith(200);
        expect(response.json).to.be.calledWith(updatedProduct);
      });
    });
  });

  describe('4 - Remoção de produtos', () => {
    const removedProduct = {
      name: "Produto do Batista",
      quantity: 50,
    }

    const response = {};
    const request = {};
    const next = sinon.stub().returns();

    beforeEach(() => {
      request.params = { id: '6194ed2049de4fd18af325b7' }

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
    });

    afterEach(() => {
      productsService.remove.restore();
      ObjectId.isValid.restore();
    });

    it('Envia erro para o middleware quando o id é inválido', async () => {
      request.params = { id: 'aaa' }
      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong id format',
      }

      sinon.stub(productsService, 'remove').resolves(removedProduct);
      sinon.stub(ObjectId, 'isValid').returns(false);

      await productsController.remove(request, response, next);
      expect(next).to.be.calledWith(expectedError);
    });

    it('Envia erro para o middleware quando o id informado não está cadastrado', async () => {
      sinon.stub(productsService, 'remove').resolves({message: true});
      sinon.stub(ObjectId, 'isValid').returns(true);

      await productsController.remove(request, response, next);
      expect(next).to.be.calledWith({message: true});
    });

    it('Remove produto com sucesso', async () => {
      sinon.stub(productsService, 'remove').resolves(removedProduct);
      sinon.stub(ObjectId, 'isValid').returns(true);
      
      await productsController.remove(request, response, next);
      expect(response.status).to.be.calledWith(200);
      expect(response.json).to.be.calledWith(removedProduct);
    });
  });
});

describe('Controllers de vendas', () => {
  describe('5 - Cadastro de vendas', () => {
    describe('Quando há erros de validação', () => {
      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      }

      const response = {};
      const request = {};
      const next = sinon.stub().returns();
  
      
      beforeEach(() => {
        sinon.stub(schemasSale, 'validate').returns({error: true});
      })
  
      afterEach(() => {
        schemasSale.validate.restore();
      })
      
      it('Envia erro para o middleware quando o productId tem menos de 24 caracteres', async () => {
        request.body = [
          {
            productId: 'a'
          }
        ]

        await salesController.create(request, response, next);

        expect(next).to.be.calledWith(expectedError);
      });

      it('Envia erro para o middleware quando a quantidade é menor que 0', async () => {
          request.body = [
            {
              productId: '6194ed2049de4fd18af325b7',
              quantity: -1,
            }
          ]

          await productsController.create(request, response, next);

          expect(next).to.be.calledWith(expectedError);
        });

      it('Envia erro para o middleware quando a quantidade é igual a 0', async () => {
          request.body = [
            {
              productId: '6194ed2049de4fd18af325b7',
              quantity: 0,
            }
          ]

          await productsController.create(request, response, next);

          expect(next).to.be.calledWith(expectedError);
        });

      it('Envia erro para o middleware quando a quantidade é uma string', async () => {
          request.body = [
            {
              productId: '6194ed2049de4fd18af325b7',
              quantity: '50',
            }
          ]

          await productsController.create(request, response, next);

          expect(next).to.be.calledWith(expectedError);
        });
    });

    describe('Quando não há erros de validação', () => {
      const response = {};
      const request = {};
      const next = sinon.stub().returns();
  
      beforeEach(() => {
        request.body = [
          {
            productId: '6194ed2049de4fd18af325b7',
            quantity: 50,
          }
        ]

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(schemasSale, 'validate').returns({});
      });

      afterEach(() => {
        salesService.create.restore();
        schemasSale.validate.restore();
      });

      it('Envia erro para o middleware quando o nome ja está cadastrado', async () => {
        sinon.stub(salesService, 'create').resolves({message: true});

        await salesController.create(request, response, next);

        expect(next).to.be.calledWith({message: true});
      });

      it('Cria venda com sucesso', async () => {
        const expectedSale = {
          itensSold: [
            {
              productId: '6194ed2049de4fd18af325b7',
              quantity: 50,
            }
          ]
        }
        sinon.stub(salesService, 'create').resolves(expectedSale);
        
        await salesController.create(request, response, next);
        expect(response.status).to.be.calledWith(200);
        expect(response.json).to.be.calledWith(expectedSale);
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

    const response = {};
    const request = {};
    const next = sinon.stub().returns();

    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
    });
    
    afterEach(() => {
      salesService.find.restore();
      ObjectId.isValid.restore();
    })

    it('Lista todas vendas quando id não é informado', async () => {
      request.params = {}

      sinon.stub(salesService, 'find').resolves(expectedSales);
      sinon.stub(ObjectId, 'isValid').returns(false);

      await salesController.find(request, response, next);
      expect(response.status).to.be.calledWith(200);
      expect(response.json).to.be.calledWith({ sales: expectedSales });
    });

    it('Envia erro para o middleware quando o id é inválido', async () => {
      request.params = { id: 'aaa' }
      const expectedError = {
        code: 'not_found',
        message: 'Sale not found',
      }

      sinon.stub(salesService, 'find').resolves(expectedSales);
      sinon.stub(ObjectId, 'isValid').returns(false);

      await salesController.find(request, response, next);
      expect(next).to.be.calledWith(expectedError);
    });

    it('Envia erro para o middleware quando o id informado não está cadastrado', async () => {
      request.params = { id: '6194ed2049de4fd18af325b7'}
      sinon.stub(salesService, 'find').resolves({message: true});
      sinon.stub(ObjectId, 'isValid').returns(true);

      await salesController.find(request, response, next);
      expect(next).to.be.calledWith({message: true});
    });

    it('Retorna produto quando o id informado está cadastrado', async () => {
      request.params = { id: '6194ed2049de4fd18af325b7'}
      sinon.stub(salesService, 'find').resolves(expectedSales[0]);
      sinon.stub(ObjectId, 'isValid').returns(true);

      await salesController.find(request, response, next);
      expect(response.status).to.be.calledWith(200);
      expect(response.json).to.be.calledWith(expectedSales[0]);
    });
  });

  describe('7 - Atualização de vendas', () => {
    describe('Quando há erros de validação', () => {
      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      }

      const response = {};
      const request = {};
      const next = sinon.stub().returns();
  
      afterEach(() => {
        schemasSale.validate.restore();
      })
      
      it('Envia erro para o middleware quando o productId tem menos de 24 caracteres', async () => {
        request.params = { id: '6194ed2049de4fd18af325b7'}
        request.body = [
          {
            productId: 'a'
          }
        ]

        sinon.stub(schemasSale, 'validate').returns({error: true});

        await salesController.update(request, response, next);

        expect(next).to.be.calledWith(expectedError);
      });

      it('Envia erro para o middleware quando a quantidade é menor que 0', async () => {
        request.params = { id: '6194ed2049de4fd18af325b7'}
        request.body = [
          {
            productId: '6194ed2049de4fd18af325b7',
            quantity: -1,
          }
        ]

        sinon.stub(schemasSale, 'validate').returns({error: true});

        await productsController.update(request, response, next);

        expect(next).to.be.calledWith(expectedError);
      });

      it('Envia erro para o middleware quando a quantidade é igual a 0', async () => {
        request.params = { id: '6194ed2049de4fd18af325b7'}
        request.body = [
          {
            productId: '6194ed2049de4fd18af325b7',
            quantity: 0,
          }
        ]

        sinon.stub(schemasSale, 'validate').returns({error: true});

        await productsController.update(request, response, next);

        expect(next).to.be.calledWith(expectedError);
      });

      it('Envia erro para o middleware quando a quantidade é uma string', async () => {
        request.params = { id: '6194ed2049de4fd18af325b7'}
        request.body = [
          {
            productId: '6194ed2049de4fd18af325b7',
            quantity: '50',
          }
        ]

        sinon.stub(schemasSale, 'validate').returns({error: true});

        await productsController.update(request, response, next);

        expect(next).to.be.calledWith(expectedError);
      });

      it('Envia erro para o middleware quando o id é inválido', async () => {
        request.params = { id: 'aaa' }
        const expectedError = {
          code: 'not_found',
          message: 'Sale not found',
        }
  
        sinon.stub(schemasSale, 'validate').returns({});

        sinon.stub(ObjectId, 'isValid').returns(false);
  
        await salesController.find(request, response, next);
        expect(next).to.be.calledWith(expectedError);
        ObjectId.isValid.restore();
      });
    });

    describe('Quando não há erros de validação', () => {
      const response = {};
      const request = {};
      const next = sinon.stub().returns();
  
      beforeEach(() => {
        request.body = [
          {
            productId: '6194ed2049de4fd18af325b7',
            quantity: 50,
          }
        ]

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(schemasSale, 'validate').returns({});
        sinon.stub(ObjectId, 'isValid').returns(true);
      });

      afterEach(() => {
        salesService.update.restore();
        schemasSale.validate.restore();
        ObjectId.isValid.restore();
      });

      it('Envia erro para o middleware quando não é possivel efetuar a mudança', async () => {
        request.params = { id: '6194ed2049de4fd18af325b7'}
        sinon.stub(salesService, 'update').resolves({message: true});

        await salesController.update(request, response, next);

        expect(next).to.be.calledWith({message: true});
      });

      it('Atualiza venda com sucesso', async () => {
        request.params = { id: '6194ed2049de4fd18af325b7'}
        const expectedSale = {
          itensSold: [
            {
              productId: '6194ed2049de4fd18af325b7',
              quantity: 50,
            }
          ]
        }
        sinon.stub(salesService, 'update').resolves(expectedSale);
        
        await salesController.update(request, response, next);
        expect(response.status).to.be.calledWith(200);
        expect(response.json).to.be.calledWith(expectedSale);
      });
    });
  });

  describe('8 - Remoção de vendas', () => {
    const removedSale = [{
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

    const response = {};
    const request = {};
    const next = sinon.stub().returns();

    beforeEach(() => {
      request.params = { id: '6194ed2049de4fd18af325b7' }

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
    });

    afterEach(() => {
      salesService.remove.restore();
      ObjectId.isValid.restore();
    });

    it('Envia erro para o middleware quando o id é inválido', async () => {
      request.params = { id: 'aaa' }
      const expectedError = {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
      }

      sinon.stub(salesService, 'remove').resolves(removedSale);
      sinon.stub(ObjectId, 'isValid').returns(false);

      await salesController.remove(request, response, next);
      expect(next).to.be.calledWith(expectedError);
    });

    it('Envia erro para o middleware quando o id informado não está cadastrado', async () => {
      sinon.stub(salesService, 'remove').resolves({message: true});
      sinon.stub(ObjectId, 'isValid').returns(true);

      await salesController.remove(request, response, next);
      expect(next).to.be.calledWith({message: true});
    });

    it('Remove produto com sucesso', async () => {
      sinon.stub(salesService, 'remove').resolves(removedSale);
      sinon.stub(ObjectId, 'isValid').returns(true);
      
      await salesController.remove(request, response, next);
      expect(response.status).to.be.calledWith(200);
      expect(response.json).to.be.calledWith(removedSale);
    });
  });
});
