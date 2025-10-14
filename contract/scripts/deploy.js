const hre = require("hardhat");

async function main() {
  // Get the deployer account
  const accounts = await hre.ethers.getSigners();

  // Add a check to ensure accounts were found
  if (accounts.length === 0) {
    console.error("Error: No accounts found. Check your hardhat.config.js network settings and ensure your private keys are set correctly.");
    process.exitCode = 1;
    return;
  }

  const deployer = accounts[0];

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the Voting contract
  const voting = await hre.ethers.deployContract("Voting");

  await voting.waitForDeployment();

  // The contract address is available on the 'target' property in Hardhat Ethers v6
  console.log(`Voting contract deployed to: ${voting.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});