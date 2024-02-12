const { ethers } = require("hardhat");
const { expect } = require("chai");
const util = require("./util");
const { BigNumber } = require('ethers');

describe("Product", function () {
  let Product, product;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    Product = await ethers.getContractFactory("Product");
    product = await Product.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await product.owner()).to.equal(owner.address);
    });
  });

  describe("Product management", function () {

    const TEST_CASE_1__READ_ALL = {
      input: { 
        products: [{cost: 100, rating: 5, stock: 10}],
      },
      
      expected: {
          total: 1,
      }
    };

    const TEST_CASE_2__READ_ALL = {
      input: { 
        products: [
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10}
        ],
      },
      expected: {
          total: 2,
      }
    };

    const TEST_CASE_3__READ_ALL = {
      input: { 
        products: [
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10}
        ],
      },
      expected: {
          total: 3,
      }
    };

    const TEST_CASE_4__READ_ALL = {
      input: { 
        products: [
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10},
          {cost: 100, rating: 5, stock: 10}
        ],
      },
      expected: {
          total: 12,
      }
    };

    const testCases = [
      TEST_CASE_1__READ_ALL, 
      TEST_CASE_2__READ_ALL, 
      TEST_CASE_3__READ_ALL,
      TEST_CASE_4__READ_ALL];

    testCases.forEach(function (testCase) {
      it(`Should read all products ${testCase.input.products.length}`, async function () {
        
        //Arrange
        testCase.input.products.forEach(async function (item) {
          await util.safExecution(
            () => product.create(item), 'ProductCreated')
        });

        //Act
        const result = await product.readAll();

        //Assert
        expect(result.length).to.equal(testCase.expected.total);
      });
    });

    it("Should create a product and emit event with correct data", async function () {
      const productData = { cost: 100, rating: 5, stock: 10 }
  
      // Envia a transação e espera pela confirmação
      const tx = await product.create(productData);
      const receipt = await tx.wait();
  
      const ProductCreatedEvent = receipt.events.find(event => event.event === 'ProductCreated');
  
      const createdProduct = await product.read(ProductCreatedEvent.args.id);

      expect(createdProduct.cost).to.equal(productData.cost);
      expect(createdProduct.rating).to.equal(productData.rating);
      expect(createdProduct.stock).to.equal(productData.stock);

      // Verifica os dados do evento
      expect(ProductCreatedEvent.args.id).to.equal(1);
      expect(ProductCreatedEvent.args.product.cost).to.equal(productData.cost);
      expect(ProductCreatedEvent.args.product.rating).to.equal(productData.rating);
      expect(ProductCreatedEvent.args.product.stock).to.equal(productData.stock);

    });

    it("Should update a product and emit event with correct data", async function () {
      await product.create({ cost: 100, rating: 5, stock: 10 });
      
      const productDataUpdate = { cost: 200, rating: 4, stock: 5 }
      
      const ProductUpdated = await util.safExecution(() => product.update(1, productDataUpdate), 'ProductUpdated')
      
      expect(ProductUpdated.id).to.equal(1);
      expect(ProductUpdated.product.cost).to.equal(productDataUpdate.cost);
      expect(ProductUpdated.product.rating).to.equal(productDataUpdate.rating);
      expect(ProductUpdated.product.stock).to.equal(productDataUpdate.stock);

      const updatedProduct = await product.read(1);

      expect(updatedProduct.cost).to.equal(200);
      expect(updatedProduct.rating).to.equal(4);
      expect(updatedProduct.stock).to.equal(5);
    });

    it("Should update stock a product and emit event with correct data", async function () {
  
      const productData = { 
        cost: ethers.BigNumber.from(100), 
        rating: ethers.BigNumber.from(5), 
        stock: ethers.BigNumber.from(10) 
      }
    
      // Criação do produto
      const createTx = await product.create(productData);
      const createReceipt = await createTx.wait();
      const createdEvent = createReceipt.events.find(event => event.event === 'ProductCreated');
      const productId = createdEvent.args.id;
    
      const quantityToReduce = 2;
      
      // Atualização do estoque
      const updateTx = await product.updateStock(productId, quantityToReduce);
      const updateReceipt = await updateTx.wait();
    
      // Procura pelo evento ProductUpdateStock no recibo da transação
      const updateStockEvent = updateReceipt.events.find(event => event.event === 'ProductUpdateStock');
    
      expect(updateStockEvent.args.id).to.equal(productId);
      expect(updateStockEvent.args.stock).to.equal(productData.stock.sub(quantityToReduce));
    
      // Verifica o produto atualizado
      const updatedProduct = await product.read(productId);
    
      expect(updatedProduct.cost).to.equal(productData.cost);
      expect(updatedProduct.rating).to.equal(productData.rating);
      expect(updatedProduct.stock).to.equal(productData.stock.sub(quantityToReduce));
    });
    
    it("Should delete a product and emit event with correct data", async function () {
      await product.create({ cost: 100, rating: 5, stock: 10 });
      
      const tx = await product.del(1);
      const receipt = await tx.wait();

      const ProductDeleted = receipt.events.find(event => event.event === 'ProductDeleted');

      expect(ProductDeleted.args.id).to.equal(1);

      const result = await product.read(1);

      expect(result.cost).to.equal(ethers.constants.Zero);
    });
  });

});
