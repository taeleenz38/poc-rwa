import { ethers } from "hardhat";
import {
  USDC_ADDRESS,
} from "../../constants";

async function main() {
  const signers = await ethers.getSigners();

  const managerAdmin = signers[2];
  const user = signers[7];

  const audc = await ethers.getContractAt("USDC", USDC_ADDRESS);
  const abbyManager = await ethers.getContract("HYFManager");
  const pricer = await ethers.getContract("AYF_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const abby = await ethers.getContract("HYF");
  const blocklist = await ethers.getContract("Blocklist");

  console.log("audc==>", audc.address);
  console.log("abbyManager==>", abbyManager.address);
  console.log("pricer==>", pricer.address);
  console.log("allowlist==>", allowlist.address);
  console.log("abby==>", abby.address);


  let gasPrice = await ethers.provider.getGasPrice();
// Increase the gas price by 20%
gasPrice = gasPrice.mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100));

  try {
    let tx = await abbyManager.connect(managerAdmin).setPricer(pricer.address, {
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
