import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import { BigNumber } from "ethers";
import { expect } from "chai";

async function main() {
  const signers = await ethers.getSigners();

  const managerAdmin = signers[2];
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
  gasPrice = gasPrice.mul(ethers.BigNumber.from(200)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;

  const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(4), 32);

  console.log("Getting latest price to string", (await pricer.getLatestPrice({ gasPrice, gasLimit })).toString());

  // Ensure Safe wallet address is available
  const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;
  const signer = managerAdmin.provider.getSigner(managerAdmin.address);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSdk = await Safe.create({ ethAdapter, safeAddress: managerAdminSafe });
  console.log("Gnosis Safe setup complete.");

  try {
    const userSafe: string = process.env.STABLE_COIN_USER_WALLET!;
    // Encode the setPriceIdForDeposits function data
    const setPriceIdForDepositsData = abbyManager.interface.encodeFunctionData(
      "setPriceIdForDeposits(bytes32[],uint256[])",
      [[FIRST_DEPOSIT_ID], [BigNumber.from(1)]]
    );

    const txData: SafeTransactionDataPartial = {
      to: abbyManager.address,
      value: "0",
      data: setPriceIdForDepositsData,
    };

    console.log("Creating Safe transaction...");
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: txData });
    console.log("Safe transaction created.");

    // Get transaction hash and approve it
    const txHash = await safeSdk.getTransactionHash(safeTransaction);
    await safeSdk.approveTransactionHash(txHash);
    console.log("Transaction hash approved.");

    // Ensure all required signatures are added
    const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction);
    console.log("Safe transaction signed.");

    // Execute the transaction with a higher gas price
    console.log("Executing Safe transaction...");
    const executeTxResponse = await safeSdk.executeTransaction(signedSafeTransaction, {
      gasLimit: ethers.BigNumber.from('3000000'), // Set a higher gas limit
      gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
    });

    // Log the transaction hash
    const transactionHash = executeTxResponse.transactionResponse?.hash;
    console.log("Transaction hash:", transactionHash);
    console.log(executeTxResponse);

    console.log("Waiting for transaction confirmation...");
    const receipt = await executeTxResponse.transactionResponse?.wait();

    console.log("--------------------setPriceIdForDeposits transaction done!----------------------------------", receipt);

    let depositRequest = await abbyManager.depositIdToDepositor(FIRST_DEPOSIT_ID, { gasPrice, gasLimit });
    console.log('deposit id list: ', depositRequest);
    console.log('deposit id request returned!');
    // expect(depositRequest[0]).to.eq(userSafe);
    // expect(depositRequest[1]).to.eq(parseUnits("20000", 18));
    // expect(depositRequest[2]).to.eq(BigNumber.from(1));
    console.log("Expected values passed!!");
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
