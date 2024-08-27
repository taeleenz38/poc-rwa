import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const managerAdmin = signers[2];

  const abbyManager = await ethers.getContract("ABBYManager");

  console.log("abbyManager==>", abbyManager.address);

  // Setting up Gnosis Safe
  const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;

  const mintFee = 20; // Example: 5%
  const redemptionFee = 20; // Example: 3%

  try {
    await abbyManager.connect(managerAdmin).setMintFee(mintFee, {
      gasLimit: 200000, // Example: Manually specify gas limit for this transaction
    });

    await abbyManager.connect(managerAdmin).setRedemptionFee(redemptionFee, {
      gasLimit: 200000, // Example: Manually specify gas limit for this transaction
    });
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
