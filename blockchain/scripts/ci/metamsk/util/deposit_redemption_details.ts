import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const user = signers[0]; // Assuming the first signer is used to interact with the contract

  const ayfManager = await ethers.getContract("HYFManager");

  // Sample deposit ID and redemption ID (Replace these with actual IDs you want to check)
  const sampleDepositId = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);
  const sampleRedemptionId = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);

  // Get depositor details
  const depositor = await ayfManager.depositIdToDepositor(sampleDepositId);
  console.log("AyfManager:Depositor details for deposit ID:", sampleDepositId);
  console.log("AyfManager:User:", depositor.user);
  console.log("AyfManager:Amount Deposited Minus Fees:", depositor.amountDepositedMinusFees.toString());
  console.log("AyfManager:Price ID:", depositor.priceId.toString());

  // Get redeemer details
  const redeemer = await ayfManager.redemptionIdToRedeemer(sampleRedemptionId);
  console.log("AyfManager:Redeemer details for redemption ID:", sampleRedemptionId);
  console.log("AyfManager:User:", redeemer.user);
  console.log("AyfManager:Amount RWA Token Burned:", redeemer.amountRwaTokenBurned.toString());
  console.log("AyfManager:Price ID:", redeemer.priceId.toString());
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
