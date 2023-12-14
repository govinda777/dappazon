require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      // configurações da rede local
    }
  },
  paths: {
    artifacts: './src/abis',
  },
  mocha: {
    reporter: 'mochawesome'
  }
};