import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../test-deploy/constants";
import { BigNumber } from "ethers";
import { expect } from "chai";

async function main() {
  const signers = await ethers.getSigners();

  const usdcWhaleSigner = signers[0];
  const assetSender = signers[4];
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

  const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(200)).div(ethers.BigNumber.from(100));
  
  const gasLimit = 600000;

  const tx10 = await audc.connect(usdcWhaleSigner).transfer(assetSender.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await tx10.wait();

  console.log("transferred A$DC!");
  const tx11 = await audc.connect(assetSender).approve(abbyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await tx11.wait();

  let beforeBalUSDC = await audc.balanceOf(user.address, { gasPrice, gasLimit });
  console.log("Balance of user before claiming A$DC", beforeBalUSDC.toString());

  console.log('starting claim redemption!!');
  const tx13 = await abbyManager.connect(user).claimRedemption([FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  await tx13.wait();
  console.log("claim redemption completed!!");
  let balUSDC = await audc.balanceOf(user.address, { gasPrice, gasLimit });
  console.log("Balance of user after claiming A$DC", balUSDC.toString());
}

main();
