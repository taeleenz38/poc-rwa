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

  const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);

  const block = (await ethers.provider.getBlock()).timestamp;
  console.log(block);

  const tx2 = await abbyManager
    .connect(managerAdmin)
    .setClaimableTimestamp(block + 100, [FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  
  await tx2.wait(); 
  console.log("setClaimableTimestamp done!!");
  
  
}

main();
