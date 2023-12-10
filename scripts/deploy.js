// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { ethers } = require("hardhat");
const { products } = require("../src/products.json")

const [deployer] = await ethers.getSigners()

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
 
const sendTokens = async () => {
  // Definindo as contas
  const senderAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const recipientAddress = "0x17eDfB8a794ec4f13190401EF7aF1c17f3cc90c5";

  // Obtendo o signer para a conta do remetente
  const sender = await ethers.provider.getSigner(senderAddress);

  // Definindo a quantidade a ser enviada (por exemplo, 1 ETH)
  const amount = ethers.utils.parseEther("1"); // Altere "1" para a quantidade desejada

  // Enviando os tokens
  const tx = await sender.sendTransaction({
      to: recipientAddress,
      value: amount
  });

  console.log(`Transaction hash: ${tx.hash}`);

  await tx.wait(); // Aguardando a transação ser confirmada

  console.log(`Tokens enviados com sucesso para ${recipientAddress}!`);
}

const deploySmartContract = async (name) => {
  
  const Contract = await ethers.getContractFactory(name)
  const contract = await Contract.deploy()
  await contract.deployed()

  console.log(`Deployed ${name} Contract at: ${contract.address}\n`)

  return contract
}

const loadingProducts = async (product) => {

  // Listing items...
  for (let i = 0; i < products.length; i++) {

    const productData = { 
      cost: tokens(products[i].price), 
      rating: 5, 
      stock: products[i].stock 
    }

    const transaction = await product.connect(deployer).create(
      productData
    )

    await transaction.wait();

    console.log(`Product ${i + 1} created`)
  }
  
}

async function main() {
  // Setup accounts
  await sendTokens();

  // Deploy Dappazon
  const dappazon = await deploySmartContract("Dappazon") 
  const product = await deploySmartContract("Product") 
  const shoppingCart = await deploySmartContract("ShoppingCart")    
  const order = await deploySmartContract("Order")
  
  loadingProducts(product)
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
