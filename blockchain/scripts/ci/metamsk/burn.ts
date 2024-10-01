import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../../test-deploy/constants";

async function main() {
  const signers = await ethers.getSigners();
  const guardian = signers[1];
  const deployer = signers[0];
  // const user = signers[6];
  // const ma = signers[1];

  const abby = await ethers.getContractAt("ABB", "0x28b08C9523838aAf302Dc71aA486bEbF9020529d");

  // Print the addresses for verification
  console.log("abby==>", abby.address);

  const bal = await abby.balanceOf("0xce5031b9F1540904a94ee609CAE04142a86a04de");

  // Current gas price (in wei)
  // let gasPrice = await ethers.provider.getGasPrice();
  // // Increase the gas price by 10%
  // gasPrice = gasPrice.mul(ethers.BigNumber.from(200)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;

  console.log("bal()==>", bal.toString());

  await abby.connect(deployer).burn("0xce5031b9F1540904a94ee609CAE04142a86a04de", 1348148148148148148148, { gasLimit });
  console.log("Tokens burned successfully");

  console.log("totalSupply()==>", (await abby.totalSupply()).toString());
  

  
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
