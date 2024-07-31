import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { AUDC_ADDRESS } from "../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const user = signers[7];

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);
  const abbyManager = await ethers.getContract("ABBYManager");
  const pricer = await ethers.getContract("ABBY_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const abby = await ethers.getContract("ABBY");
  const blocklist = await ethers.getContract("Blocklist");

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
  const signer = user.provider.getSigner(user.address);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  try {
    const userSafe: string = process.env.STABLE_COIN_USER_WALLET!;

    // Ensure the Safe has enough ETH for gas
    const safeBalance = await ethers.provider.getBalance(userSafe);
    const estimatedGasCost = gasPrice.mul(gasLimit);
    if (safeBalance.lt(estimatedGasCost)) {
      throw new Error(`Insufficient ETH balance in the Safe. Required: ${ethers.utils.formatEther(estimatedGasCost)} ETH, Available: ${ethers.utils.formatEther(safeBalance)} ETH`);
    }

    const safeSdk = await Safe.create({ ethAdapter, safeAddress: userSafe });
    console.log("Gnosis Safe setup complete.");

    // Check balance and allowance
    // const balance = await abby.balanceOf(userSafe);
    // if (balance.lt(parseUnits("2000", 18))) {
    //   throw new Error("Insufficient ABBY balance in the Safe wallet.");
    // }

    const allowance = await abby.allowance(userSafe, abbyManager.address);
    if (allowance.lt(parseUnits("20000", 18))) {
      // Approve ABBY tokens
      const approveData = abby.interface.encodeFunctionData("approve", [abbyManager.address, parseUnits("19000", 18)]);
      const approveTxData: SafeTransactionDataPartial = {
        to: abby.address,
        value: "0",
        data: approveData,
      };
      const approveTx = await safeSdk.createTransaction({ safeTransactionData: approveTxData });
      await safeSdk.signTransaction(approveTx);
      await safeSdk.executeTransaction(approveTx, {
        gasLimit: ethers.BigNumber.from('3000000'), // Set a higher gas limit
        gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
      });
      console.log("Approval provided for ABBY!");
    }

    // Requesting redemption
    const requestRedemptionData = abbyManager.interface.encodeFunctionData("requestRedemption", [parseUnits("100", 18)]);

    const redemptionTxData: SafeTransactionDataPartial = {
      to: abbyManager.address,
      value: "0",
      data: requestRedemptionData,
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

    console.log("Waiting for redemption transaction confirmation...");
    const redemptionReceipt = await executeRedemptionTxResponse.transactionResponse?.wait();

    console.log("--------------------Redemption requested successfully!!----------------------------", redemptionReceipt);

    // const balAfterRedemption = await abby.balanceOf(userSafe, { gasPrice, gasLimit });
    // expect(balAfterRedemption).to.eq(parseUnits("1000", 18));
    // console.log("balAfterRedemption==>", balAfterRedemption.toString());
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
