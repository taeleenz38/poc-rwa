import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const user = signers[0]; // Assuming the first signer is used to interact with the contract

  const allowlist = await ethers.getContract("Allowlist");
  console.log("allowlist==>", allowlist.address);//0xF84d1677A43536de5cadFB6EEE5414BdA050842a


  // Get the terms
  const termsCount = await allowlist.terms.length;
  const terms: string[] = [];
  for (let i = 0; i < termsCount; i++) {
    terms.push(await allowlist.terms(i));
  }
  console.log("Terms:", terms);

  // Get the current term index
  const currentTermIndex = await allowlist.currentTermIndex();
  console.log("Current Term Index:", currentTermIndex.toString());

  // Get the verifications for a specific address and term index
  const addressToCheck = user.address; // You can change this to any address you want to check
  const verifications: { [key: number]: boolean } = {};
  for (let i = 0; i < termsCount; i++) {
    verifications[i] = await allowlist.verifications(addressToCheck, i);
  }
  console.log(`Verifications for address ${addressToCheck}:`, verifications);
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
