import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const user = signers[0]; // Assuming the first signer is used to interact with the contract

  const abbyManager = await ethers.getContract("ABBYManager");

  // Sample deposit ID and redemption ID (Replace these with actual IDs you want to check)
  const sampleDepositId = ethers.utils.hexZeroPad(ethers.utils.hexlify(4), 32);
  const sampleRedemptionId = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);

  // Get depositor details
  const depositor = await abbyManager.depositIdToDepositor(sampleDepositId);
  console.log("Depositor details for deposit ID:", sampleDepositId);
  console.log("User:", depositor.user);
  console.log("Amount Deposited Minus Fees:", depositor.amountDepositedMinusFees.toString());
  console.log("Price ID:", depositor.priceId.toString());

  // Get redeemer details
  const redeemer = await abbyManager.redemptionIdToRedeemer(sampleRedemptionId);
  console.log("Redeemer details for redemption ID:", sampleRedemptionId);
  console.log("User:", redeemer.user);
  console.log("Amount RWA Token Burned:", redeemer.amountRwaTokenBurned.toString());
  console.log("Price ID:", redeemer.priceId.toString());
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
