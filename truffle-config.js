const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
module.exports = {
    // Specify multiple networks for flexibility
    networks: {
      // Configuration for Ganache CLI (port 8545)
      ganacheCLI: {
        host: "127.0.0.1", // Localhost
        port: 8545,        // Ganache CLI default port
        network_id: "*",   // Match any network ID
      },
      // Configuration for Ganache UI (port 7545)
      ganacheUI: {
        host: "127.0.0.1", // Localhost
        port: 7545,        // Ganache UI default port
        network_id: "*",   // Match any network ID
      },
      // Sepolia testnet configuration
      sepolia: {
        provider: () => new HDWalletProvider (
          process.env.SEPOLIA_PRIVATE_KEY,
          process.env.INFURA_PROJECT_ID
        ),
        network_id: 11155111,
        // gas: 590000,      // Gas limit
        // gasPrice: 20986814982,
        confirmations: 2,   // Confirmations to wait between deployments
        timeoutBlocks: 5, // Timeout for deployment
        skipDryRun: false,
      },
      // Ethereum Mainnet (requires Infura or other RPC providers)
      mainnet: {
        provider: () => new HDWalletProvider(
          "YOUR_MNEMONIC",  // Replace with your mnemonic or private key
          `https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID` // Infura endpoint
        ),
        network_id: 1,      // Mainnet ID
        gas: 5500000,       // Gas limit
        confirmations: 2,   // Confirmations to wait between deployments
        timeoutBlocks: 200, // Timeout for deployment
        skipDryRun: false,   // Skip dry run before deployment
      },
      // Ethereum Rinkeby Testnet
      rinkeby: {
        provider: () => new HDWalletProvider(
          "YOUR_MNEMONIC",
          `https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID`
        ),
        network_id: 4,       // Rinkeby ID
        gas: 4500000,        // Gas limit
        confirmations: 2,
        timeoutBlocks: 200,
        skipDryRun: true,
      },
      // Ethereum Goerli Testnet
      goerli: {
        provider: () => new HDWalletProvider(
          "YOUR_MNEMONIC",
          `https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID`
        ),
        network_id: 5,       // Goerli ID
        gas: 4500000,
        confirmations: 2,
        timeoutBlocks: 200,
        skipDryRun: true,
      },
    },
    
    // Configure compilers
    compilers: {
      solc: {
        version: "0.8.0", // Solidity version
      },
    },
  };
  

  // 135239591407009468
  // 59757777995343568
  // 121500000000000000
  // 46018186588334100
