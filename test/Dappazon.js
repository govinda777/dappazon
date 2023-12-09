const { ethers } = require("hardhat");
const { expect } = require("chai");
const util = require("./util");

describe("Dappazon Contract", function () {
  let dappazon, product, order, shoppingCart;
  let owner;
  let ownerAddress;
  let productInfo1, productInfo2, shoppingCartInfo;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    ownerAddress = await owner.address;

    // Deploy the Product, Order, and ShoppingCart contracts
    const Product = await ethers.getContractFactory("Product", owner);
    const Order = await ethers.getContractFactory("Order", owner);
    const ShoppingCart = await ethers.getContractFactory("ShoppingCart", owner);
    const Dappazon = await ethers.getContractFactory("Dappazon", owner);

    product = await Product.deploy();
    order = await Order.deploy();
    shoppingCart = await ShoppingCart.deploy(product.address);
    dappazon = await Dappazon.deploy(product.address, order.address, shoppingCart.address);
    
    const productData = { cost: 100, rating: 5, stock: 10 }

    shoppingCartInfo = await util.safExecution(
      () => shoppingCart.create(ownerAddress), 'ShoppingCartCreated').then(
        result => result.id);

    productInfo1 = await util.safExecution(
      () => product.create(productData), 'ProductCreated')

    productInfo2 = await util.safExecution(
      () => product.create(productData), 'ProductCreated')

    await shoppingCart.addProduct(ownerAddress, shoppingCartInfo, productInfo1.id, 2);
    await shoppingCart.addProduct(ownerAddress, shoppingCartInfo, productInfo2.id, 3);
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
      console.log('shoppingCartInfo', shoppingCartInfo);

      const shoppingCartData = await shoppingCart.read(ownerAddress, shoppingCartInfo)
      const cartProductData = await shoppingCart.readProducts(ownerAddress, shoppingCartInfo)
      const totalCart = cartProductData.reduce((acc, cur) => acc + cur.cost * cur.quantity, 0)

      console.log('shoppingCartInfo', shoppingCartInfo);
      console.log('shoppingCartData', shoppingCartData);
      console.log('cartProductData', cartProductData);
      console.log('totalCart', totalCart);

      // Act
      const result = await util.safExecution(
        () => dappazon.buy(ownerAddress, shoppingCartInfo, {value: totalCart}), 'Buy');
      
      console.log('Buy Event', result);

      const productDataCheck = await product.read(productInfo1.id)

      // Assert
      expect(productDataCheck.stock).to.equal(productInfo1["product"].stock - 2);
      
    });



  });

});