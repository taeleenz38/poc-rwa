import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const guardian = signers[1];
  // const user = signers[6];
  // const ma = signers[1];

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);
  const abbyManager = await ethers.getContract("ABBYManager");
  const pricer = await ethers.getContract("ABBY_Pricer");
  const allowlist = await ethers.getContract("Allowlist");

  // Print the addresses for verification
  console.log("audc==>", audc.address);
  console.log("abbyManager==>", abbyManager.address);
  console.log("pricer==>", pricer.address);
  console.log("allowlist==>", allowlist.address);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(200)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;

  console.log("Setting up Gnosis Safe...");
  console.log("guardian==>", guardian.address);
  // console.log("user==>", user.address);
  // console.log("ma==>", ma.address);
  const signer = guardian.provider.getSigner(guardian.address);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
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
    const guardianSafe: string = process.env.GUARDIAN_WALLET!;
    console.log("guardianSafe==>", guardianSafe);
    const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;
    const userSafe: string = process.env.STABLE_COIN_USER_WALLET!;
    const safeSdk = await Safe.create({ ethAdapter, safeAddress: guardianSafe });
    console.log("Gnosis Safe setup complete.");

    // Encode and execute addTerm function
    const addTermData = allowlist.interface.encodeFunctionData("addTerm", ["Test Term 1"]);
    const setValidTermIndexesData = allowlist.interface.encodeFunctionData("setValidTermIndexes", [[0]]);
    const setAccountStatusUserData = allowlist.interface.encodeFunctionData("setAccountStatus", [userSafe, 0, true]);
    const setAccountStatusGuardianData = allowlist.interface.encodeFunctionData("setAccountStatus", [guardianSafe, 0, true]);
    const setAccountStatusManagerAdminSafeData = allowlist.interface.encodeFunctionData("setAccountStatus", [managerAdminSafe, 0, true]);
    const setAccountStatusAbbyManagerData = allowlist.interface.encodeFunctionData("setAccountStatus", [abbyManager.address, 0, true]);

    const txDataArray: SafeTransactionDataPartial[] = [
      { to: allowlist.address, value: "0", data: addTermData },
      { to: allowlist.address, value: "0", data: setValidTermIndexesData },
      { to: allowlist.address, value: "0", data: setAccountStatusUserData },
      { to: allowlist.address, value: "0", data: setAccountStatusGuardianData },
      { to: allowlist.address, value: "0", data: setAccountStatusAbbyManagerData },
      { to: allowlist.address, value: "0", data: setAccountStatusManagerAdminSafeData }
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
        gasLimit: ethers.utils.parseUnits('3000000', 'wei'), // Set a higher gas limit
        gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
      });

      // Log the transaction hash
      const transactionHash = executeTxResponse.transactionResponse?.hash;
      console.log("Transaction hash:", transactionHash);
      console.log(executeTxResponse);

      console.log("Waiting for transaction confirmation...");
      const receipt = await executeTxResponse.transactionResponse?.wait();

      console.log("Transaction confirmed, hash:", transactionHash);
      console.log(receipt);
    }

    console.log("All transactions executed via Safe.");

    const terms = await allowlist.getValidTermIndexes();
    console.log("terms ==> ", terms);
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
