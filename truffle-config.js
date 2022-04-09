require('dotenv').config()
const path = require('path')
const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() { 
       return new HDWalletProvider(
         process.env.PRIVATE_KEY,
         `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT}`
        )
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0",
    }
  }
};
