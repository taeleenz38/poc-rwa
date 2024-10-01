
import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
  USDC_ADDRESS
} from "../../test-deploy/constants";

async function main() {

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);
  const usdc = await ethers.getContractAt("USDC", USDC_ADDRESS);
  const ayfManager = await ethers.getContract("AYFManager");
  const hyfManager = await ethers.getContract("HYFManager");
  const pricer = await ethers.getContract("AYF_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const ayf = await ethers.getContract("AYF");
  const hyf = await ethers.getContract("HYF");
  const blocklist = await ethers.getContract("Blocklist");

  console.log("audc==>", audc.address);
  console.log("usdc==>", usdc.address);
  console.log("ayfManager==>", ayfManager.address);
  console.log("hyfManager==>", hyfManager.address);
  console.log("pricer==>", pricer.address);
  console.log("allowlist==>", allowlist.address);
  console.log("ayf==>", ayf.address);
  console.log("hyf==>", hyf.address);
  console.log("blocklist==>", blocklist.address);
}

main();
