// import "@nomicfoundation/hardhat-toolbox";
// import "dotenv/config";


// const { PRIVATE_KEY, SEPOLIA_URL ,AMOY_RPC_URL,POLYGONSCAN_API_KEY} = process.env;

// /** @type import('hardhat/config').HardhatUserConfig */
// const config = {
//   solidity: "0.8.19", // Using the version you specified
//   networks: {
//     // Configuration for a local Ganache instance
//     ganache: {
//       url: "http://127.0.0.1:7545",
//       accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
//     },
//     // Configuration for the Sepolia testnet
//     sepolia: {
//       url: SEPOLIA_URL || "",
//       accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
//     },
//     // This defines the "amoy" network
//     amoy: {
//       url: AMOY_RPC_URL || "", // Reads from your .env
//       accounts: [PRIVATE_KEY ? `0x${PRIVATE_KEY}` : ""], // Reads from .env
//       chainId: 80002,
//     },

//   },
//   etherscan: {
//     apiKey: {
//       polygonAmoy: POLYGONSCAN_API_KEY || " ", // Use the key here
//     },
//     customChains: [
//       {
//         network: "amoy",
//         chainId: 80002,
//         urls: {
//           apiURL: "https://api-amoy.polygonscan.com/api",
//           browserURL: "https://amoy.polygonscan.com"
//         }
//       }
//     ]
//   },
// };

// export default config;



require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); 

const { PRIVATE_KEY, SEPOLIA_URL, AMOY_RPC_URL, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    sepolia: {
      url: SEPOLIA_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    amoy: {
      url: AMOY_RPC_URL || "",
      accounts: [PRIVATE_KEY ? `0x${PRIVATE_KEY}` : ""],
      chainId: 80002,
    },
  },

  // --- THIS IS THE NEW, SIMPLIFIED V2 CONFIG ---
  etherscan: {
    // Pass the single, global Etherscan API key as a string
    apiKey: ETHERSCAN_API_KEY || ""
  },

  // (We remove the sourcify warning for a cleaner output)
  sourcify: {
    enabled: false
  }
};