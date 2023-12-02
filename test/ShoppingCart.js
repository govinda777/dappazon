// Importe os pacotes necessários e quaisquer utilitários.
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ShoppingCart Contract", function () {
  let product
  let owner

  // Antes de cada teste, faça o deploy dos contratos necessários e configure o estado inicial.
  beforeEach(async function () {
    [owner] = await ethers.getSigners()

    const Product = await ethers.getContractFactory("Product")
    product = await Product.deploy()

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await product.owner()).to.equal(owner.address);
    });
  });

  describe("Shopping management", function () {

    it("Should create a shopping cart", async function () {

    });
  
    it("Should add a product to the shopping cart", async function () {
  
    });
  
    it("Should remove a product from the shopping cart", async function () {
  
    });
  
  });

});
