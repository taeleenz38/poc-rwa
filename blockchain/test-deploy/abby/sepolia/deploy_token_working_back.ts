import { ethers } from "hardhat";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const deployerAddress = deployer.address;

  console.log('Starting deployment of token with deployer:', deployerAddress);

  // Custom Ethers Adapter Setup
  console.log("Setting up Gnosis Safe...");
  const signer = deployer.provider.getSigner(deployerAddress);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer, // Ensure we are using the signer
  });

  // Verify that the adapter has a signer
  if (!ethAdapter.getSigner()) {
    console.error("The EthersAdapter was not properly initialized with a signer.");
    process.exit(1);
  } else {
    console.log("Signer is properly initialized in the EthersAdapter:", ethAdapter.getSigner());
  }

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

    // Prepare contract deployment data
    console.log('Preparing contract deployment data...');
    const ContractFactory = await ethers.getContractFactory("AUDC");
    const deploymentTx = ContractFactory.getDeployTransaction();

    console.log('Deployment transaction data:', deploymentTx);

    const txData: SafeTransactionDataPartial = {
      to: ethers.constants.AddressZero, // AddressZero for contract creation
      value: "0",
      data: deploymentTx.data!.toString(),
    };

    console.log('Safe transaction data:', txData);

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

    console.log("Waiting for transaction confirmation...");
    await executeTxResponse.transactionResponse?.wait();

    console.log("Contract deployed via Safe, transaction hash:", transactionHash);
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in deployment script:", error);
  process.exit(1);
});
