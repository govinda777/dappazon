const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappazon", () => {
  let dappazon, product, order, shoppingCart
  let deployer, buyer
  let productInfo, shoppingCartInfo

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners()

    const Product = await ethers.getContractFactory("Product")
    product = await Product.deploy()
    
    console.log(`Product: ${product.address}`)
    
    const Order = await ethers.getContractFactory("Order")
    order = await Order.deploy()

    console.log(`Order: ${order.address}`)

    const ShoppingCart = await ethers.getContractFactory("ShoppingCart")
    shoppingCart = await ShoppingCart.deploy(product.address)

    console.log(`ShoppingCart: ${shoppingCart.address}`)

    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy(product.address, order.address, shoppingCart.address)

    console.log(`Dappazon: ${dappazon.address}`)
  })

  const createNewProduct = async () => {
    const productData = { cost: 100, rating: 5, stock: 10 };
    
    // Envia a transação e espera pela confirmação
    const tx = await product.create(productData);
    const receipt = await tx.wait();
  
    // Procura pelo evento ProductCreated no recibo da transação
    return receipt.events.find(event => event.event === 'ProductCreated');
  }

  const createNewShoppingCart = async (productData) => {
    
    // Envia a transação e espera pela confirmação
    const tx = await shoppingCart.create(productData);
    const receipt = await tx.wait();
  
    // Procura pelo evento ProductCreated no recibo da transação
    return receipt.events.find(event => event.event === 'ProductCreated');
  }
  

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address)
    })
  })

  describe("Buying", () => {
    let transaction

    beforeEach(async () => {
      productInfo = createNewProduct()
      shoppingCartInfo = createNewShoppingCart(productInfo)
    })

    it("Updates buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      expect(result).to.equal(COST)
    })

    it("Emits Buy event", () => {
      expect(transaction).to.emit(dappazon, "Buy")
    })
  })

  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      // List a item
      let transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // Withdraw
      transaction = await dappazon.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      expect(result).to.equal(0)
    })
  })
})
