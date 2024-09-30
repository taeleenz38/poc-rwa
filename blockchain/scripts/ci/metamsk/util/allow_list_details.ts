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


  const isSenderAllowed = await allowlist.isAllowed("0x3b48ec114dDf77040D3948Fc8736191835377B1C");
console.log("Is sender allowed:", isSenderAllowed);

const isFromAllowed = await allowlist.isAllowed("0xD1aa74797C5aefA8CEAbAfDD0dAb488E47D9BcBE");
console.log("Is 'from' allowed:", isFromAllowed);

const isToAllowed = await allowlist.isAllowed("0x6223c2C68d1e786cd02A2eBbDF873e1f9d268D45");
console.log("Is 'to' allowed:", isToAllowed);
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
