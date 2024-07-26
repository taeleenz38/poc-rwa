import { ethers } from "hardhat";

async function main() {
  const txHash = "0x345d8063d351a9f8b309d72a9d600e7bad3da26dccc2fe98f65f58382941d534";
  const receipt = await ethers.provider.getTransactionReceipt(txHash);

  if (receipt.logs.length > 0) {
    console.log("Logs found in the transaction receipt. Analyzing logs...");
    for (const log of receipt.logs) {
      console.log(`Log Address: ${log.address}`);
      console.log(`Log Data: ${log.data}`);
      console.log(`Log Topics: ${log.topics}`);
    }
  } else {
    console.log("No logs found in the transaction receipt.");
  }

  const contractAddress = receipt.contractAddress;

  if (contractAddress) {
    console.log("Deployed contract address:", contractAddress);
  } else {
    console.log("No contract address found in the transaction receipt. This might not be a contract creation transaction.");
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exit(1);
});
