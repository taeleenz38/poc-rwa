import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { AUDC_ADDRESS, USDC_ADDRESS } from "../../../test-deploy/constants";

async function main() {
  const signers = await ethers.getSigners();
  const assetSender = signers[4];
  const user = signers[7];

  const usdc = await ethers.getContractAt("USDC", USDC_ADDRESS);
  const abbyManager = await ethers.getContract("HYFManager");
  // const pricer = await ethers.getContract("AYF_Pricer");
  // const allowlist = await ethers.getContract("Allowlist");
  const hyf = await ethers.getContract("HYF");
  // const blocklist = await ethers.getContract("Blocklist");

  console.log("assetSender==>", assetSender.address);

  // console.log("audc==>", audc.address);
  // console.log("abbyManager==>", abbyManager.address);
  // console.log("pricer==>", pricer.address);
  // console.log("allowlist==>", allowlist.address);
  // console.log("abby==>", abby.address);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;
  const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);


  let tx = await usdc.connect(assetSender).approve(abbyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await tx.wait();

  tx = await hyf.connect(assetSender).approve(abbyManager.address, parseUnits("100", 18), { gasPrice, gasLimit });
  await tx.wait();

  tx = await abbyManager.connect(assetSender).approveRedemptionRequest([FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  await tx.wait();
  console.log("Price set for redemption");
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
