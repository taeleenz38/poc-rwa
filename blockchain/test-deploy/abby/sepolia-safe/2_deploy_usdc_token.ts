import { ethers } from "hardhat";
const { deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  console.log('starting deployment of token!', deployer.address); 

  const gasPrice = (await ethers.provider.getGasPrice()).mul(ethers.BigNumber.from(2)); // Increase gas price by 2 times

  try {
    // Deploy the Blocklist contract
    await deploy("USDC", {
      from: deployer,
      args: [],
      log: true,
      gasPrice, // Add the increased gas price here
    });

    // Get the deployed A$DC contract instance
    const audc = await ethers.getContract("USDC");
    console.log("deployed USDC address:", audc.address);

  } catch (error) {
    console.error("Deployment error:", error);
    if (error.message.includes("Exact same transaction already in the pool")) {
      console.error("Transaction is already in the pool. Try increasing the gas price or wait for the transaction to be mined.");
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
