import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";


const { PRIVATE_KEY, SEPOLIA_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.19", // Using the version you specified
  networks: {
    // Configuration for a local Ganache instance
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    // Configuration for the Sepolia testnet
    sepolia: {
      url: SEPOLIA_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;

