// scripts/testConnection.ts
import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/wgC_6RILBar_tWOU1IpbIxaRGZOb4JE6`);
  const blockNumber = await provider.getBlockNumber();
  console.log("Current block number:", blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
