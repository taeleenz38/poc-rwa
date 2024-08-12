import { ethers } from "hardhat";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const managerAdmin = signers[2];

  const abbyManager = await ethers.getContract("ABBYManager");

  console.log("abbyManager==>", abbyManager.address);

  // Setting up Gnosis Safe
  const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;
  const signer = managerAdmin.provider.getSigner(managerAdmin.address);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSdk = await Safe.create({ ethAdapter, safeAddress: managerAdminSafe });
  console.log("Gnosis Safe setup complete.");

  const mintFee = 20; // Example: 5%
  const redemptionFee = 20; // Example: 3%

  try {
    // Encode the setMintFee function data
    const setMintFeeData = abbyManager.interface.encodeFunctionData(
      "setMintFee",
      [mintFee]
    );

    // Encode the setRedemptionFee function data
    const setRedemptionFeeData = abbyManager.interface.encodeFunctionData(
      "setRedemptionFee",
      [redemptionFee]
    );

    const txDataArray: SafeTransactionDataPartial[] = [
      { to: abbyManager.address, value: "0", data: setMintFeeData },
      { to: abbyManager.address, value: "0", data: setRedemptionFeeData },
    ];

    for (const txData of txDataArray) {
      console.log("Creating Safe transaction...");
      const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: txData });
      console.log("Safe transaction created.");

      console.log("Signing Safe transaction...");
      await safeSdk.signTransaction(safeTransaction);
      console.log("Safe transaction signed.");

      // Execute the transaction with a higher gas price
      console.log("Executing Safe transaction...");
      const executeTxResponse = await safeSdk.executeTransaction(safeTransaction, {
        gasLimit: ethers.BigNumber.from('3000000'), // Set a higher gas limit
        gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
      });

      // Log the transaction hash
      const transactionHash = executeTxResponse.transactionResponse?.hash;
      console.log("Transaction hash:", transactionHash);
      console.log(executeTxResponse);

      console.log("Waiting for transaction confirmation...");
      const receipt = await executeTxResponse.transactionResponse?.wait();

      console.log("--------------------Fee setting transaction done!----------------------------------", receipt);
    }
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
