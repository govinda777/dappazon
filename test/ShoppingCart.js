// Importe os pacotes necessários e quaisquer utilitários.
const { ethers } = require("hardhat");
const { expect } = require("chai");
const util = require("./util");

describe("ShoppingCart Contract", function () {
  let product, shoppingCart
  let owner
  let productInfo1, productInfo2

  // Antes de cada teste, faça o deploy dos contratos necessários e configure o estado inicial.
  beforeEach(async function () {
    [owner] = await ethers.getSigners()

    const Product = await ethers.getContractFactory("Product")
    product = await Product.deploy()

    const productData = { cost: 100, rating: 5, stock: 10 }

    productInfo1 = await util.safExecution(
      () => product.create(productData), 'ProductCreated')

    productInfo2 = await util.safExecution(
      () => product.create(productData), 'ProductCreated')

    await util.safExecution(
      () => product.create(productData), 'ProductCreated')

    const ShoppingCart = await ethers.getContractFactory("ShoppingCart")
    shoppingCart = await ShoppingCart.deploy(product.address)

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await product.owner()).to.equal(owner.address)
      expect(await shoppingCart.owner()).to.equal(owner.address)
    });
  });

  describe("Shopping management", function () {

    it("Should create a shopping cart", async function () {
      //Arrange
      
      //Act
      const shoppingCartCreated = await util.safExecution(
        () => shoppingCart.create(), 'ShoppingCartCreated')

      //Assert
      expect(shoppingCartCreated.id).to.equal(1);
    });
  
    it("Should read a product to the shopping cart", async function () {
      //Arrange
      const shoppingCartCreated = await util.safExecution(
        () => shoppingCart.create(), 'ShoppingCartCreated')

      //Act
      const items = await shoppingCart.readProducts(shoppingCartCreated.id)
      console.log("items", items)
      
      //Assert
      expect(items).to.equal([]);
    });

    // Test cases
    const TEST_CASE_1__ADD_PRODUCT_TO_CART = {
      input: 
          [ 
            {shoppingCartId: 1, productId: 1, quantity: 2},
            {shoppingCartId: 1, productId: 2, quantity: 2},
            {shoppingCartId: 1, productId: 3, quantity: 3}
          ]
      ,
      expected: {
          id: 1,
          totalCost: 700 // Supondo que o custo do produto seja 100
      }
    };

    const TEST_CASE_2__ADD_PRODUCT_TO_CART = {
      input: 
          [ 
            {shoppingCartId: 1, productId: 1, quantity: 4},
            {shoppingCartId: 1, productId: 3, quantity: 4} 
          ]
      ,
      expected: {
          id: 1,
          totalCost: 800 // Supondo que o custo do produto seja 100
      }
    };

    const TEST_CASE_3__ADD_PRODUCT_TO_CART = {
      input: 
          [ 
            {shoppingCartId: 1, productId: 1, quantity: 1}
          ]
      ,
      expected: {
          id: 1,
          totalCost: 100 // Supondo que o custo do produto seja 100
      }
    };

    const testCases = [
      TEST_CASE_1__ADD_PRODUCT_TO_CART,
      TEST_CASE_2__ADD_PRODUCT_TO_CART,
      TEST_CASE_3__ADD_PRODUCT_TO_CART
    ];

    testCases.forEach(function (testCase) {
      it(`Should add a product to the shopping cart ${testCase.input.length}`, async function () {
        // Arrange
        const shoppingCartCreated = await util.safExecution(
            () => shoppingCart.create(), 'ShoppingCartCreated');

        var totalCostCalc = 0
        var totalCostInCartCalc = 0;
        
        // Act
        for (const item of testCase.input) {
      
          const totalCost = (await product.read(item.productId)).cost * item.quantity;

          await shoppingCart.addProduct(shoppingCartCreated.id, item.productId, item.quantity);

          totalCostCalc += totalCost;
        }

        const shoppingCartInfo = await shoppingCart.read(shoppingCartCreated.id)
        const items = await shoppingCart.readProducts(shoppingCartCreated.id)

        for (const item of items) {

          const response = await product.read(item.productId)

          totalCostInCartCalc += response.cost * item.quantity
        }

        // Assert
        expect(totalCostCalc === totalCostInCartCalc).to.equal(true)        
        expect(util.isEqual(shoppingCartInfo.totalCost, totalCostCalc)).to.equal(true)
        expect(util.isEqual(shoppingCartInfo.totalCost, testCase.expected.totalCost)).to.equal(true)
      });
    });

    it("Should remove a product from the shopping cart", async function () {
  
    });
  
  });

});
