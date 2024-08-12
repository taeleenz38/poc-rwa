import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const guardian = signers[1];
  // const user = signers[6];
  // const ma = signers[1];

  const abby = await ethers.getContractAt("ABBY", "0x9ccb0F1950b1891691D48607Fe4a9E5C07fCc9D4");

  // Print the addresses for verification
  console.log("abby==>", abby.address);

  // Current gas price (in wei)
  // let gasPrice = await ethers.provider.getGasPrice();
  // // Increase the gas price by 10%
  // gasPrice = gasPrice.mul(ethers.BigNumber.from(200)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;

  console.log("totalSupply()==>", (await abby.totalSupply()).toString());
  

  
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
