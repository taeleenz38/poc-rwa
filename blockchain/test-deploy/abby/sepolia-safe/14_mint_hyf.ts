import { ethers } from "hardhat";
import { keccak256, parseUnits } from "ethers/lib/utils";

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0];

  console.log("deployer==>", deployer.address);

  const hyf = await ethers.getContract("HYF");

  console.log("hyf==>", hyf.address);

  // Setting up Gnosis Safe
  // const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;
  let gasPrice = await ethers.provider.getGasPrice();
// Increase the gas price by 20%
gasPrice = gasPrice.mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100));

  const mintFee = 20; // Example: 5%
  const redemptionFee = 20; // Example: 3%

  try {

    await hyf
    .connect(deployer)
    .grantRole(
      keccak256(Buffer.from("MINTER_ROLE", "utf-8")),
      deployer.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

    let tx = await hyf.connect(deployer).mint("0xB473DeE33A20aDb36Cd5BA6BD68f115a285fa528", parseUnits("20000", 18), {
      gasLimit: 600000, // Manually specify gas limit for deployment
      gasPrice: gasPrice
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
