const { expect } = require("chai");

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

    it("Should create a product and emit event with correct data", async function () {
      const productData = { cost: 100, rating: 5, stock: 10 };
  
      // Envia a transação e espera pela confirmação
      const tx = await product.create(productData);
      const receipt = await tx.wait();
  
      // Procura pelo evento ProductCreated no recibo da transação
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
      
      const tx = await product.update(1, productDataUpdate);
      const receipt = await tx.wait();

      // Procura pelo evento ProductCreated no recibo da transação
      const ProductUpdated = receipt.events.find(event => event.event === 'ProductUpdated');
      
      expect(ProductUpdated.args.id).to.equal(1);
      expect(ProductUpdated.args.product.cost).to.equal(productDataUpdate.cost);
      expect(ProductUpdated.args.product.rating).to.equal(productDataUpdate.rating);
      expect(ProductUpdated.args.product.stock).to.equal(productDataUpdate.stock);

      const updatedProduct = await product.read(1);

      expect(updatedProduct.cost).to.equal(200);
      expect(updatedProduct.rating).to.equal(4);
      expect(updatedProduct.stock).to.equal(5);
    });

    it("Should update stock a product and emit event with correct data", async function () {
      
      const productData = { cost: 100, rating: 5, stock: 10 }
      await product.create(productData);

      const productDataUpdateStock = [{ produtcId: 1, cost: 200, rating: 5, quantity: 2 }]
      
      const tx = await product.updateStock(productDataUpdateStock);
      const receipt = await tx.wait();

      // Procura pelo evento ProductCreated no recibo da transação
      const ProductUpdateStock = receipt.events.find(event => event.event === 'ProductUpdateStock');
      
      const shoppingCartProducts = ProductUpdateStock.args.shoppingCartProducts;

      expect(shoppingCartProducts[0].produtcId).to.equal(1);
      expect(shoppingCartProducts[0].cost).to.equal(productDataUpdateStock[0].cost);
      expect(shoppingCartProducts[0].rating).to.equal(productDataUpdateStock[0].rating);
      expect(shoppingCartProducts[0].quantity).to.equal(productDataUpdateStock[0].quantity);

      const updatedProduct = await product.read(1);

      expect(updatedProduct.cost).to.equal(productData.cost);
      expect(updatedProduct.rating).to.equal(productData.rating);
      expect(updatedProduct.stock).to.equal(productData.stock - productDataUpdateStock[0].quantity);
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
