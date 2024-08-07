import { ethers } from "hardhat";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
const { deployments, getNamedAccounts } = require("hardhat");

async function main() {
  // const { deployer } = await getNamedAccounts();
  const signers = await ethers.getSigners();
  const deployer = signers[0];

  const gasPrice = (await ethers.provider.getGasPrice()).mul(ethers.BigNumber.from(2)); // Increase gas price by 2 times
  const gasLimit = 600000;

  console.log("Setting up Gnosis Safe...");
  const signer = deployer.provider.getSigner(deployer.address);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  try {
    const deplopyerSafe: string = process.env.DEPLOYER_WALLET!;

    // Ensure the Safe has enough ETH for gas
    const safeBalance = await ethers.provider.getBalance(deplopyerSafe);
    const estimatedGasCost = gasPrice.mul(gasLimit);
    if (safeBalance.lt(estimatedGasCost)) {
      throw new Error(`Insufficient ETH balance in the Safe. Required: ${ethers.utils.formatEther(estimatedGasCost)} ETH, Available: ${ethers.utils.formatEther(safeBalance)} ETH`);
    }

    console.log('Starting deployment of AUDC token!');
    const safeSdk = await Safe.create({ ethAdapter, safeAddress: deplopyerSafe });

    // Prepare deployment transaction
    const deploymentData = (await ethers.getContractFactory("AUDC")).getDeployTransaction().data;
    const deployTxData: SafeTransactionDataPartial = {
      to: ethers.constants.AddressZero, // Special address for contract creation
      value: "0",
      data: deploymentData!,
      gasPrice: gasPrice.toString(),
    };

    console.log("Creating Safe deployment transaction...");
    const deployTransaction = await safeSdk.createTransaction({ safeTransactionData: deployTxData });
    console.log("Safe deployment transaction created.");

    console.log("Signing Safe deployment transaction...");
    await safeSdk.signTransaction(deployTransaction);
    console.log("Safe deployment transaction signed.");

    console.log("Executing Safe deployment transaction...");
    const executeDeployTxResponse = await safeSdk.executeTransaction(deployTransaction, {
      gasLimit: ethers.BigNumber.from('3000000'), // Set a higher gas limit
      gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
    });

    // // Log the deployment transaction hash
    const deployTransactionHash = executeDeployTxResponse.transactionResponse?.hash;
    console.log("Deployment transaction hash:", deployTransactionHash);
    console.log(executeDeployTxResponse);

    // console.log("Waiting for deployment transaction confirmation...");
    // const deployReceipt = await executeDeployTxResponse.transactionResponse?.wait();
    // console.log("--------------------Deployment done!----------------------------------", deployReceipt);

    // // Get the deployed AUDC contract instance
    // const audcAddress = deployReceipt.contractAddress!;
    // const audc = await ethers.getContractAt("AUDC", audcAddress);
    // console.log("Deployed AUDC address:", audc.address);

  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

async function getDeploymentData() {
  // Replace with your contract's name
  const ContractFactory = await ethers.getContractFactory("AUDC");
  
  // Get the deployment data (bytecode + constructor arguments)
  const deploymentData = ContractFactory.getDeployTransaction().data;
  
  return deploymentData;
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
