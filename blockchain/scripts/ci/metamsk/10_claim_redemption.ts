import { ethers } from "hardhat";
import { AUDC_ADDRESS } from "../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();

  const usdcWhaleSigner = signers[0];
  const assetSender = signers[4];
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

  const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(200)).div(ethers.BigNumber.from(100));
  
  const gasLimit = 600000;

  let tx = await abbyManager.connect(user).claimRedemption([FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  await tx.wait();
  console.log("Price set for redemption");
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
