import { ethers } from "hardhat";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import {
  AUDC_ADDRESS,
} from "../../constants";

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const deployerAddress = deployer.address;
  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);

  console.log('Starting transfer of AUDC with deployer:', deployerAddress);

  // Custom Ethers Adapter Setup
  console.log("Setting up Gnosis Safe...");
  const signer = deployer.provider.getSigner(deployerAddress);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer, // Ensure we are using the signer
  });

  // Override the getChainId method to ensure it works correctly
  ethAdapter.getChainId = async () => {
    // Hardcode the chain ID for Sepolia (11155111)
    return 11155111;
  };

  // Mock isContractDeployed to always return true to bypass getCode call
  ethAdapter.isContractDeployed = async () => {
    return true;
  };

  try {
    const safeAddress = "0x63E411e5BeAA5A14bc902057742fE8aDad4B1Ee7";
    const safeSdk = await Safe.create({ ethAdapter, safeAddress });
    console.log("Gnosis Safe setup complete.");

    // Prepare transfer transaction data
    const toAddress = "0xC7257c10B5D809B7407f662523CF2E7C3Ea8E716";
    const transferAmount = ethers.utils.parseUnits("100", 18); // Change this amount as needed

    // Encode the transfer data
    const transferData = audc.interface.encodeFunctionData("transfer", [toAddress, transferAmount]);

    const txData: SafeTransactionDataPartial = {
      to: toAddress, // Address of the AUDC contract
      value: "0",
      data: transferData,
    };

    console.log("Creating Safe transaction...");
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: txData });
    console.log("Safe transaction created.");

    console.log("Signing Safe transaction...");
    await safeSdk.signTransaction(safeTransaction);
    console.log("Safe transaction signed.");

    // Execute the transaction with a higher gas price
    console.log("Executing Safe transaction...");
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction, {
      gasLimit: ethers.utils.parseUnits('3000000', 'wei'), // Set a higher gas limit
      gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
    });

    // Log the transaction hash
    const transactionHash = executeTxResponse.transactionResponse?.hash;
    console.log("Transaction hash:", transactionHash);
    console.log(executeTxResponse);

    console.log("Waiting for transaction confirmation...");
    const receipt = await executeTxResponse.transactionResponse?.wait();

    console.log("AUDC transferred via Safe, transaction hash:", transactionHash);

    console.log(receipt);
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in deployment script:", error);
  process.exit(1);
});