const { ethers, upgrades } = require("hardhat")

async function main() {

  // Deploy Dappazon
  const Dappazon = await ethers.getContractFactory("Dappazon")
  const dappazon = await upgrades.deployProxy(Dappazon, [], { initializer: 'initialize' })
  await dappazon.waitForDeployment()
  console.log(`Deployed Dappazon Contract at: ${dappazon.address}\n`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
