const { expect } = require("chai");

describe("ShoppingCart", function () {
  let ShoppingCart, shoppingCart;
  let Product, product;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    Product = await ethers.getContractFactory("Product");
    product = await Product.deploy();
    ShoppingCart = await ethers.getContractFactory("ShoppingCart");
    shoppingCart = await ShoppingCart.deploy(product.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await shoppingCart.owner()).to.equal(owner.address);
    });
  });

  describe("ShoppingCart management", function () {
    it("Should create a shopping cart and emit event with correct data", async function () {
      // Create a new shopping cart
      const shoppingCartData = { id: 1, total_cost: 0 };
      const tx = await shoppingCart.create(shoppingCartData);
      const receipt = await tx.wait();

      // Find the ShoppingCartCreated event in the transaction receipt
      const ShoppingCartCreatedEvent = receipt.events.find(event => event.event === 'ShoppingCartCreated');

      expect(ShoppingCartCreatedEvent.args.id).to.equal(1);
      expect(ShoppingCartCreatedEvent.args.shoppingCartInfo.total_cost).to.equal(shoppingCartData.total_cost);

      // Ensure the shopping cart is stored with the correct info
      const createdShoppingCart = await shoppingCart.read(1);
      expect(createdShoppingCart.total_cost).to.equal(shoppingCartData.total_cost);
    });

    it("Should add a product to the shopping cart and emit event with correct data", async function () {
      // Create a product before testing shopping cart functionality
      await product.create({ cost: 100, rating: 5, stock: 10 });
      await shoppingCart.create({ id: 1, total_cost: 0 });

      // Add product to the shopping cart
      const tx = await shoppingCart.addProduct(1, 1, 1); // Shopping cart ID, product ID, quantity
      const receipt = await tx.wait();

      // Find the ShoppingCartAddProduct event in the transaction receipt
      const ShoppingCartAddProductEvent = receipt.events.find(event => event.event === 'ShoppingCartAddProduct');

      expect(ShoppingCartAddProductEvent.args.id).to.equal(1);
      expect(ShoppingCartAddProductEvent.args.shoppingCartInfo.total_cost).to.equal(100); // Assuming cost is cumulative

      const itemsInfo = ShoppingCartAddProductEvent.args.itemsInfo;
      expect(itemsInfo[0].productId).to.equal(1);
      expect(itemsInfo[0].cost).to.equal(100);
      expect(itemsInfo[0].rating).to.equal(5);
      expect(itemsInfo[0].quantity).to.equal(1);

      // Ensure the shopping cart has the product with correct info
      const shoppingCartItems = await shoppingCart.readProducts(1);
      expect(shoppingCartItems[0].productId).to.equal(1);
      expect(shoppingCartItems[0].cost).to.equal(100);
      expect(shoppingCartItems[0].rating).to.equal(5);
      expect(shoppingCartItems[0].quantity).to.equal(1);
    });
  });
});
