import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const user = signers[0]; // Assuming the first signer is used to interact with the contract

  const pricer = await ethers.getContract("ABBY_Pricer");

  // Get all priceIds
  // const priceIdsLength = await pricer.priceIdsLength();
  // const priceIds: number[] = [];

  // for (let i = 0; i < priceIdsLength; i++) {
  //   const priceId = await pricer.priceIds(i);
  //   priceIds.push(priceId.toNumber());
  // }

  // console.log("All Price IDs:", priceIds);

  // Get price information for each priceId
  // for (const priceId of priceIds) {
    const priceInfo = await pricer.prices(2);
    console.log(`Price Info for Price ID ${2}:`);
    console.log("Price:", priceInfo.price.toString());
    console.log("Timestamp:", priceInfo.timestamp.toString());
  // }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
