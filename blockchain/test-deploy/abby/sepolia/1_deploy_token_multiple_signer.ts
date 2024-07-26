import { ethers } from "hardhat";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const guidian = signers[1];
  const deployerAddress = deployer.address;
  const guidianAddress = guidian.address;

  console.log('Starting deployment of token with deployer:', deployerAddress);
  console.log("2nd signer==>", guidian.address)

  // Custom Ethers Adapter Setup
  console.log("Setting up Gnosis Safe...");
  // const signer = deployer.provider.getSigner(deployerAddress);
  // const signer2 = guidian.provider.getSigner(guidian.address);
  // console.log("2nd signer test==>", signer2.address)
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: deployer.provider.getSigner(deployerAddress), // Ensure we are using the signer
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
    const safeAddress = "0x225540a329c350B5b0C08916A49f700DBEf4C411";
    const safeSdk = await Safe.create({ ethAdapter, safeAddress });
    console.log("Gnosis Safe setup complete.");

    // Prepare contract deployment data
    console.log('Preparing contract deployment data...');
    const ContractFactory = await ethers.getContractFactory("AUDC");
    const deploymentTx = ContractFactory.getDeployTransaction();

    // console.log('Deployment transaction data:', deploymentTx);

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
    console.log("Safe transaction signed by the first signer.");

    // Collect signatures from other signers
    // for (let i = 1; i < signers.length; i++) {
      // const otherSigner = signers[1].provider.getSigner(signers[1].address);
      // console.log("2nd signer==>", signer2.address)
      const otherEthAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: guidian.provider.getSigner(guidianAddress),
      });

      const otherSafeSdk = await Safe.create({ ethAdapter: otherEthAdapter, safeAddress });
      await otherSafeSdk.signTransaction(safeTransaction);
      console.log(`Safe transaction signed by other signer.`);
    // }

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
    const receipt = await executeTxResponse.transactionResponse?.wait();

    console.log("Contract deployed via Safe, transaction hash:", transactionHash);

    // Search for the contract creation address in the logs
    if (receipt && receipt.logs) {
      for (const log of receipt.logs) {
        if (log.address === ethers.constants.AddressZero) {
          const contractAddress = log.address;
          console.log("Contract deployed at address:", contractAddress);
          return;
        }
      }
    }

    console.log("No contract address found in the transaction receipt logs.");
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in deployment script:", error);
  process.exit(1);
});
