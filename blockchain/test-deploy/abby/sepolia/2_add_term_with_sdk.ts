import { ethers } from "hardhat";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import {
  AUDC_ADDRESS,
} from "../../constants";

async function main() {
  const signers = await ethers.getSigners();
  const guardian = signers[1];
  const guardianAddress = guardian.address;
  const allowList = await ethers.getContractAt("Allowlist", "0x96E979afeB557d230A6a5e17661Dd6Aa492d5d9D");

  // Custom Ethers Adapter Setup
  console.log("Setting up Gnosis Safe...");
  const signer = guardian.provider.getSigner(guardianAddress);
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
    const safeAddress = "0x8E5a0Fdbdd6a3901666065E3656b6A8B01F95c72"; // Ensure this is a valid address without the "sep:" prefix
    const safeSdk = await Safe.create({ ethAdapter, safeAddress });
    console.log("Gnosis Safe setup complete.");

    // Prepare the transaction data for `addTerm`
    const term = "Test Term 1";
    const gasPrice = ethers.utils.parseUnits('100', 'gwei'); // Set the gas price
    const gasLimit = ethers.utils.parseUnits('3000000', 'wei'); // Set the gas limit

    // Encode the `addTerm` data
    const addTermData = allowList.interface.encodeFunctionData("addTerm", [term]);

    const txData: SafeTransactionDataPartial = {
      to: allowList.address, // Address of the Allowlist contract
      value: "0",
      data: addTermData,
    };

    console.log("Creating Safe transaction...");
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: txData });
    console.log("Safe transaction created.");

    console.log("Signing Safe transaction...");
    await safeSdk.signTransaction(safeTransaction);
    console.log("Safe transaction signed.");

    // Execute the transaction with the specified gas price and limit
    console.log("Executing Safe transaction...");
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction, {
      gasLimit: gasLimit,
      gasPrice: gasPrice
    });

    // Log the transaction hash
    const transactionHash = executeTxResponse.transactionResponse?.hash;
    console.log("Transaction hash:", transactionHash);
    console.log(executeTxResponse);

    console.log("Waiting for transaction confirmation...");
    const receipt = await executeTxResponse.transactionResponse?.wait();

    console.log("Transaction executed via Safe, transaction hash:", transactionHash);
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
