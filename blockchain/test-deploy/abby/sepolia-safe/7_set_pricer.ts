import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

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

  // Setting up Gnosis Safe
  // const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;
  // const signer = managerAdmin.provider.getSigner(managerAdmin.address);
  // const ethAdapter = new EthersAdapter({
  //   ethers,
  //   signerOrProvider: signer,
  // });

  // try {
  //   // const safeSdk = await Safe.create({ ethAdapter, safeAddress: managerAdminSafe });

  //   const safeSdk = await Safe.create({
  //     ethAdapter,
  //     safeAddress: managerAdminSafe,
  //     contractNetworks: {
  //       11155111: { // Sepolia network ID
  //         multiSendAddress: '0xMULTISEND_CONTRACT_ADDRESS',
  //         safeMasterCopyAddress: '0xSAFEMASTER_COPY_ADDRESS',
  //         safeProxyFactoryAddress: '0xSAFEPROXY_FACTORY_ADDRESS',
  //         multiSendCallOnlyAddress: '0xMULTISEND_CALL_ONLY_CONTRACT_ADDRESS', // Replace with actual address or same as multiSendAddress
  //         fallbackHandlerAddress: '0xFALLBACK_HANDLER_CONTRACT_ADDRESS', // Replace with actual address
  //         signMessageLibAddress: '0xSIGN_MESSAGE_LIB_CONTRACT_ADDRESS', // Replace with actual address
  //         createCallAddress: '0xCREATE_CALL_CONTRACT_ADDRESS' // Replace with actual address
  //       }
  //     }
  //   });

  //   console.log("Gnosis Safe setup complete.");

  //   // Encode the setPricer function data
  //   const setPricerData = abbyManager.interface.encodeFunctionData(
  //     "setPricer",
  //     [pricer.address]
  //   );

  //   const txData: SafeTransactionDataPartial = {
  //     to: abbyManager.address,
  //     value: "0",
  //     data: setPricerData,
  //     operation: 0, // CALL
  //     safeTxGas: 200000, // Manually specify gas limit for this transaction
  //   };

  //   console.log("Creating Safe transaction...");
  //   const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: txData });
  //   console.log("Safe transaction created.");

  //   console.log("Signing Safe transaction...");
  //   await safeSdk.signTransaction(safeTransaction);
  //   console.log("Safe transaction signed.");

  //   // Execute the transaction with a higher gas price
  //   console.log("Executing Safe transaction...");
  //   const executeTxResponse = await safeSdk.executeTransaction(safeTransaction, {
  //     gasLimit: ethers.BigNumber.from('3000000'), // Set a higher gas limit
  //     gasPrice: ethers.utils.parseUnits('100', 'gwei') // Set a higher gas price
  //   });

  //   // Log the transaction hash
  //   const transactionHash = executeTxResponse.transactionResponse?.hash;
  //   console.log("Transaction hash:", transactionHash);
  //   console.log(executeTxResponse);

  //   console.log("Waiting for transaction confirmation...");
  //   const receipt = await executeTxResponse.transactionResponse?.wait();

  //   console.log("--------------------setPricer transaction done!----------------------------------", receipt);
  // } catch (error) {
  //   console.error("Error during Safe setup or transaction:", error);
  //   throw error;
  // }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
