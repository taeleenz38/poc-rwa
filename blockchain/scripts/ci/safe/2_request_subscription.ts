import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { AUDC_ADDRESS } from "../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const usdcWhaleSigner = signers[0];
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

    const tx = await audc.connect(usdcWhaleSigner).transfer(userSafe, parseUnits("20000", 18), { gasPrice, gasLimit });
    await tx.wait();
    console.log("Transferred A$DC!");

    const safeSdk = await Safe.create({ ethAdapter, safeAddress: userSafe });
    console.log("Gnosis Safe setup complete.");

    // Check balance and allowance
    const balance = await audc.balanceOf(userSafe);
    if (balance.lt(parseUnits("20000", 18))) {
      throw new Error("Insufficient balance in the Safe wallet.");
    }

    const allowance = await audc.allowance(userSafe, abbyManager.address);
    if (allowance.lt(parseUnits("20000", 18))) {
      // Approve A$DC tokens
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
      console.log("Approval provided for A$DC!");
    }

    const res = await allowlist.isAllowed(userSafe, { gasPrice, gasLimit });
    console.log(res);

    // Get the minimum deposit amount
    const minDeposit = await abbyManager.minimumDepositAmount();
    console.log("The value of min deposit is:", minDeposit.toString());

    // Encode the requestSubscription function data
    const requestSubscriptionData = abbyManager.interface.encodeFunctionData("requestSubscription", [parseUnits("20000", 18)]);

    const txData: SafeTransactionDataPartial = {
      to: abbyManager.address,
      value: "0",
      data: requestSubscriptionData,
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
      gasLimit: ethers.BigNumber.from('3000000'), // Set a higher gas limit
      gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
    });

    // Log the transaction hash
    const transactionHash = executeTxResponse.transactionResponse?.hash;
    console.log("Transaction hash:", transactionHash);
    console.log(executeTxResponse);

    console.log("Waiting for transaction confirmation...");
    const receipt = await executeTxResponse.transactionResponse?.wait();

    console.log("--------------------Request Subscription done!----------------------------------", receipt);
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
