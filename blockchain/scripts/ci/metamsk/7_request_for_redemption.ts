import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { AUDC_ADDRESS } from "../../../test-deploy/constants";

async function main() {
  const signers = await ethers.getSigners();
  const user = signers[7];

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);
  const abbyManager = await ethers.getContract("AYFManager");
  const pricer = await ethers.getContract("AYF_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const abby = await ethers.getContract("AYF");
  const blocklist = await ethers.getContract("Blocklist");

  console.log("audc==>", audc.address);
  console.log("abbyManager==>", abbyManager.address);
  console.log("pricer==>", pricer.address);
  console.log("allowlist==>", allowlist.address);
  console.log("abby==>", abby.address);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;

  let tx = await abby.connect(user).approve(abbyManager.address, parseUnits("100", 18), { gasPrice, gasLimit });
  await tx.wait();
  console.log("Price set for deposit");

  tx = await abbyManager.connect(user).requestRedemption(parseUnits("10", 18), { gasPrice, gasLimit });
  await tx.wait();
  console.log("Price set for deposit");

  
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
