const { ethers } = require("hardhat");
const { expect } = require("chai");
const util = require("./util");

describe("Dappazon Contract", function () {
  let dappazon, product, order;
  let owner;
  let ownerAddress;
  let productInfo1, productInfo2;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    ownerAddress = await owner.address;

    // Deploy the Product and Dappazon contracts
    const Product = await ethers.getContractFactory("Product", owner);
    const Dappazon = await ethers.getContractFactory("Dappazon", owner);

    product = await Product.deploy();
    dappazon = await Dappazon.deploy(product.address);
    
    const productData = { cost: 100, rating: 5, stock: 10 }

    productInfo1 = await util.safExecution(
      () => product.create(productData), 'ProductCreated')

    productInfo2 = await util.safExecution(
      () => product.create(productData), 'ProductCreated')
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await product.owner()).to.equal(owner.address);
      expect(await dappazon.owner()).to.equal(owner.address);
    });
  });

  describe("Dappazon management", function () {
    
    it("Should buy products and emit event with correct data", async function () {
      // Arrange
      const productIds = [productInfo1.id, productInfo2.id];
      const quantities = [2, 3]; // Assuming buying 2 of product1 and 3 of product2
      const totalCost = 100 * (quantities[0] + quantities[1]);

      // Act
      const result = await util.safExecution(
        () => dappazon.buy(productIds, quantities, { value: totalCost }), 'Buy');

      const productDataCheck1 = await product.read(productInfo1.id);
      const productDataCheck2 = await product.read(productInfo2.id);

      // Assert
      expect(productDataCheck1.stock).to.equal(productInfo1["product"].stock - quantities[0]);
      expect(productDataCheck2.stock).to.equal(productInfo2["product"].stock - quantities[1]);
    });

  });

});
