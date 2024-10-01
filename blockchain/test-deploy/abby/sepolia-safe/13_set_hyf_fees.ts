import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const managerAdmin = signers[2];

  const abbyManager = await ethers.getContract("HYFManager");

  console.log("abbyManager==>", abbyManager.address);

  // Setting up Gnosis Safe
  // const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;
  let gasPrice = await ethers.provider.getGasPrice();
// Increase the gas price by 20%
gasPrice = gasPrice.mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100));

  const mintFee = 20; // Example: 5%
  const redemptionFee = 20; // Example: 3%

  try {
    let tx = await abbyManager.connect(managerAdmin).setMintFee(mintFee, {
      gasLimit: 600000, // Manually specify gas limit for deployment
      // gasPrice: gasPrice
    });

    tx.wait();

    tx = await abbyManager.connect(managerAdmin).setRedemptionFee(redemptionFee, {
      gasLimit: 600000, // Manually specify gas limit for deployment
      // gasPrice: gasPrice
    });

    tx.wait();
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
