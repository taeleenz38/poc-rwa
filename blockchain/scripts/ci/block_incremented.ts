import { network, ethers } from "hardhat";
async function waitForNextBlock(): Promise<void> {
    const provider = ethers.provider;
    const currentBlock = await provider.getBlockNumber();
  
    console.log(`Current block number: ${currentBlock}`);
    console.log("Waiting for the next block...");
  
    return new Promise<void>((resolve) => {
      const onBlock = (blockNumber: number) => {
        if (blockNumber > currentBlock) {
          console.log(`New block mined: ${blockNumber}`);
          provider.off("block", onBlock); // Stop listening for new blocks
          resolve();
        }
      };
  
      provider.on("block", onBlock);
    });
  }

  async function main() {
    // Example usage of waitForNextBlock
    await waitForNextBlock();
    console.log("Block incremented by one.");
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });