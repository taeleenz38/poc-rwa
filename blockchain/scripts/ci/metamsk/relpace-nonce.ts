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
    const guardianSafe: string = process.env.MANAGER_ADMIN_WALLET!;
    console.log("guardianSafe==>", guardianSafe);
    const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;
    const userSafe: string = process.env.STABLE_COIN_USER_WALLET!;
    const safeSdk = await Safe.create({ ethAdapter, safeAddress: managerAdminSafe });
    console.log("Gnosis Safe setup complete.");

    for (let nonce = 276; nonce < 330; nonce++) {
      const txData: SafeTransactionDataPartial = {
        to: "0xbd8136866c184Acf2bf3c8E5d58081DAB49adA62",
        value: "0",
        data: "0x",  // No data, effectively a no-op
        operation: 0, // CALL
        safeTxGas: 200000,
        nonce: nonce,
      };
  
      console.log(`Creating no-op Safe transaction for nonce ${nonce}...`);
      const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: txData });
      console.log("No-op Safe transaction created.");
  
      console.log("Signing no-op transaction...");
      await safeSdk.signTransaction(safeTransaction);
      console.log(`No-op transaction signed for nonce ${nonce}.`);
  
      console.log("Executing no-op transaction...");
      const executeTxResponse = await safeSdk.executeTransaction(safeTransaction, {
        gasLimit: ethers.utils.parseUnits('3000000', 'wei'), // Set a higher gas limit
        gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
      });
  
      console.log("Transaction hash:", executeTxResponse.transactionResponse?.hash);
      await executeTxResponse.transactionResponse?.wait();
      console.log(`No-op transaction for nonce ${nonce} executed.`);
    }
  
    console.log(`Safe nonce is now set to ${210}.`);
  
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
