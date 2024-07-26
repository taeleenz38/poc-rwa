import { ethers } from "hardhat";
import Safe, { Eip1193Provider, RequestArguments, SafeTransactionOptionalProps } from '@safe-global/protocol-kit';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import SafeApiKit from '@safe-global/api-kit';
import { JsonRpcProvider } from '@ethersproject/providers';

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  // const guardian = signers[1];
  const deployerAddress = deployer.address;
  // const guardianAddress = guardian.address;

  // Using public RPC URL to create a JsonRpcProvider
  const publicRpcUrl = 'https://ethereum-sepolia-rpc.publicnode.com';
  // const publicRpcUrl = 'https://eth-sepolia.g.alchemy.com/v2/KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe'
  // const provider: Eip1193Provider = {request: {publicRpcUrl}};
  // const ethersProvider = new JsonRpcProvider(publicRpcUrl);
  
  // const eip1193Provider: Eip1193Provider = {
  //   request: async ({ method, params }: RequestArguments) => {
  //     // Ensure params is an array
  //     return ethersProvider.send(method, Array.isArray(params) ? params : []);
  //   }
  // };

  const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY!;
  // const signer = deployer.provider.getSigner(deployerAddress);

  // Initialize SafeApiKit
  const apiKit = new SafeApiKit({ chainId: 11155111n, txServiceUrl: 'https://safe-transaction.sepolia.gnosis.io' });

  // Initialize the Safe SDK with the public RPC provider
  const safeAddress = "0x63E411e5BeAA5A14bc902057742fE8aDad4B1Ee7";
  const protocolKit = await Safe.init({
    provider: publicRpcUrl,
    signer: deployerPrivateKey,
    safeAddress
  });

  console.log(await protocolKit.getAddress());
  console.log(await protocolKit.getBalance());
  console.log(await protocolKit.getChainId());
  console.log(await protocolKit.getOwners());
  console.log(await protocolKit.getSafeProvider());

  // console.log('Starting deployment of token with deployer:', deployerAddress);

  // try {
  //   // Prepare contract deployment data
  //   const ContractFactory = await ethers.getContractFactory("AUDC");
  //   const deploymentTx = ContractFactory.getDeployTransaction();

  //   const transactions: MetaTransactionData[] = [
  //     {
  //       to: ethers.constants.AddressZero,
  //       data: deploymentTx.data!.toString(),
  //       value: "0",
  //       operation: 0
  //     }
  //   ];

  //   const options: SafeTransactionOptionalProps = {
  //     gasPrice: ethers.utils.parseUnits('100', 'gwei').toString(), // Convert BigNumber to string
  //     gasToken: ethers.constants.AddressZero,
  //     refundReceiver: ethers.constants.AddressZero,
  //   };

  //   const safeTransaction = await protocolKit.createTransaction({ transactions, options });

  //   console.log("Transaction created successfully.");

  //   const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
  //   console.log("safeTxHash===>", safeTxHash);
  //   const senderSignature = await protocolKit.signHash(safeTxHash);
    
  //   await apiKit.proposeTransaction({
  //     safeAddress,
  //     safeTransactionData: safeTransaction.data,
  //     safeTxHash,
  //     senderAddress: deployerAddress,
  //     senderSignature: senderSignature.data
  //   });
  // } catch (error) {
  //   console.error("Error during Safe setup or transaction:", error);
  //   throw error;
  // }
}

main().catch((error) => {
  console.error("Error in deployment script:", error);
  process.exit(1);
});
