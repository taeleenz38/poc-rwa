import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../test-deploy/constants";
import { BigNumber } from "ethers";
import { expect } from "chai";

async function main() {
  const signers = await ethers.getSigners();

  const managerAdmin = signers[2];
  const user = signers[7];

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);
  const abbyManager = await ethers.getContract("ABBYManager");
  const pricer = await ethers.getContract("ABBY_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const abby = await ethers.getContract("ABBY");
  const blocklist = await ethers.getContract("Blocklist");

  console.log("audc==>", audc.address);
  console.log("abbyManager==>", abbyManager.address);
  console.log("pricer==>", pricer.address);
  console.log("allowlist==>", allowlist.address);
  console.log("abby==>", abby.address);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(200)).div(ethers.BigNumber.from(100));
  const gasLimit = 600000;

  const tx6 = await abby.connect(user).approve(abbyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await tx6.wait(); 
  console.log("approving to spend abby tokens!");

  const balBeforeRedemption = await abby.balanceOf(user.address, { gasPrice, gasLimit });
  expect(balBeforeRedemption).to.eq(parseUnits("2000", 18));
  console.log("balBeforeRedemption==>", balBeforeRedemption.toString());
  

  //requesting redemptions
  const tx7 = await abbyManager.connect(user).requestRedemption(parseUnits("1000", 18), { gasPrice, gasLimit });
  await tx7.wait(); 
  console.log('redemption requested successfully!!');

  const balAfterRedemption = await abby.balanceOf(user.address, { gasPrice, gasLimit });
  expect(balAfterRedemption).to.eq(parseUnits("1000", 18));
  console.log("balAfterRedemption==>", balAfterRedemption.toString());
}

main();
