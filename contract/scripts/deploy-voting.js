const hre = require("hardhat");

async function main() {
  console.log("Deploying Voting contract...");

  // Get the contract factory
  const Voting = await hre.ethers.getContractFactory("Voting");

  // Deploy the contract
  const voting = await Voting.deploy();

  // Wait for deployment to complete
  await voting.waitForDeployment();

  // Get the deployed address
  const contractAddress = await voting.getAddress();

  console.log("✅ Voting contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);
  
  // Verify contract on Etherscan (optional)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await voting.deploymentTransaction().wait(6);
    
    try {
      console.log("🔍 Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("⚠️ Contract verification failed:", error.message);
    }
  }

  console.log("\n📋 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your frontend .env file:");
  console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("3. Restart your frontend development server");

  return contractAddress;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
