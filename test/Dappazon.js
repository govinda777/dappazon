const { ethers } = require("hardhat");
const { expect } = require("chai");
const util = require("./util");

describe("Dappazon Contract", function () {
  let dappazon, product, order, shoppingCart;
  let owner;
  let productInfo1, productInfo2, shoppingCartId;
  
  const createData = async () => {
    const productData = { cost: 100, rating: 5, stock: 10 }

    shoppingCartId = await util.safExecution(
      () => shoppingCart.create(), 'ShoppingCartCreated').then(
        result => result.id);

    productInfo1 = await util.safExecution(
      () => product.create(productData), 'ProductCreated')

    productInfo2 = await util.safExecution(
      () => product.create(productData), 'ProductCreated')

    await shoppingCart.addProduct(shoppingCartId, productInfo1.id, 2);
    await shoppingCart.addProduct(shoppingCartId, productInfo2.id, 3);
  }

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Deploy the Product, Order, and ShoppingCart contracts
    const Product = await ethers.getContractFactory("Product", owner);
    const Order = await ethers.getContractFactory("Order", owner);
    const ShoppingCart = await ethers.getContractFactory("ShoppingCart", owner);
    const Dappazon = await ethers.getContractFactory("Dappazon", owner);

    product = await Product.deploy();
    order = await Order.deploy();
    shoppingCart = await ShoppingCart.deploy(product.address);
    dappazon = await Dappazon.deploy(order.address, shoppingCart.address);
    
    createData();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await order.owner()).to.equal(owner.address);
      expect(await product.owner()).to.equal(owner.address);
      expect(await shoppingCart.owner()).to.equal(owner.address);
      expect(await dappazon.owner()).to.equal(owner.address);
    });
  });

  describe("Dappazon management", function () {
    
    it("Should buy a products and emit event with correct data", async function () {
      // Arrange
      console.log('shoppingCartId', shoppingCartId);

      /*
        uint256 productId;
        uint256 cost;
        uint256 rating;
        uint256 quantity;
      */

      const shoppingCartData = await shoppingCart.read(shoppingCartId)
      const cartProductData = await shoppingCart.readProducts(shoppingCartId)
      const totalCart = cartProductData.reduce((acc, cur) => acc + cur.cost * cur.quantity, 0)
      console.log('shoppingCartData', shoppingCartData)
      console.log('cartProductData', cartProductData)
      console.log('totalCart', totalCart)

      const product1DataCheck0 = await product.read(productInfo1.id)

      console.log('product1DataCheck', product1DataCheck0)

      // Act
      const result = await util.safExecution(
        () => dappazon.buy(shoppingCartId, {value: totalCart}), 'Buy');
      
      console.log('Buy Event', result);


      const product1DataCheck = await product.read(productInfo1.id)

      console.log('product1DataCheck', product1DataCheck)
      
      // Assert
      expect(result).to.equal(1);
    });



  });

});