import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { AUDC_ADDRESS } from "../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const assetSender = signers[4];

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);
  const abbyManager = await ethers.getContract("ABBYManager");
  const pricer = await ethers.getContract("ABBY_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const abby = await ethers.getContract("ABBY");
  const blocklist = await ethers.getContract("Blocklist");

  console.log("assetSender==>", assetSender.address);

  console.log("audc==>", audc.address);
  console.log("abbyManager==>", abbyManager.address);
  console.log("pricer==>", pricer.address);
  console.log("allowlist==>", allowlist.address);
  console.log("abby==>", abby.address);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;

  console.log("Setting up Gnosis Safe...");
  const signer = assetSender.provider.getSigner(assetSender.address);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  try {
    const assetSenderSafe: string = process.env.ASSET_SENDER_WALLET!;
    console.log("assetSenderSafe==>", assetSenderSafe);

    // Ensure the Safe has enough ETH for gas
    const safeBalance = await ethers.provider.getBalance(assetSenderSafe);
    const estimatedGasCost = gasPrice.mul(gasLimit);
    if (safeBalance.lt(estimatedGasCost)) {
      throw new Error(`Insufficient ETH balance in the Safe. Required: ${ethers.utils.formatEther(estimatedGasCost)} ETH, Available: ${ethers.utils.formatEther(safeBalance)} ETH`);
    }

    const safeSdk = await Safe.create({ ethAdapter, safeAddress: assetSenderSafe });
    console.log("Gnosis Safe setup complete.");

    const allowance = await audc.allowance(assetSenderSafe, abbyManager.address);
    const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);

    if (allowance.lt(parseUnits("20000", 18))) {
      // Approve AUDC tokens
      const approveData = audc.interface.encodeFunctionData("approve", [abbyManager.address, parseUnits("20000", 18)]);
      const approveTxData: SafeTransactionDataPartial = {
        to: audc.address,
        value: "0",
        data: approveData,
      };
      const approveTx = await safeSdk.createTransaction({ safeTransactionData: approveTxData });
      await safeSdk.signTransaction(approveTx);
      await safeSdk.executeTransaction(approveTx, {
        gasLimit: ethers.BigNumber.from('3000000'), // Set a higher gas limit
        gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
      });
      console.log("Approval provided for AUDC!");
    }

    // Requesting redemption approval
    const redemptionApprovalData = abbyManager.interface.encodeFunctionData(
      "approveRedemptionRequest",
      [[FIRST_DEPOSIT_ID]]
    );

    const redemptionTxData: SafeTransactionDataPartial = {
      to: abbyManager.address,
      value: "0",
      data: redemptionApprovalData,
    };

    console.log("Creating Safe redemption transaction...");
    const redemptionTransaction = await safeSdk.createTransaction({ safeTransactionData: redemptionTxData });
    console.log("Safe redemption transaction created.");

    console.log("Signing Safe redemption transaction...");
    await safeSdk.signTransaction(redemptionTransaction);
    console.log("Safe redemption transaction signed.");

    // Execute the redemption transaction with a higher gas price
    console.log("Executing Safe redemption transaction...");
    const executeRedemptionTxResponse = await safeSdk.executeTransaction(redemptionTransaction, {
      gasLimit: ethers.BigNumber.from('3000000'), // Set a higher gas limit
      gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
    });

    // Log the redemption transaction hash
    const redemptionTransactionHash = executeRedemptionTxResponse.transactionResponse?.hash;
    console.log("Redemption transaction hash:", redemptionTransactionHash);
    console.log(executeRedemptionTxResponse);
    
    console.log("Waiting for transaction confirmation...");
    const receipt = await executeRedemptionTxResponse.transactionResponse?.wait();
    console.log("Transaction confirmed, hash:", redemptionTransactionHash);
    console.log(receipt);

  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
