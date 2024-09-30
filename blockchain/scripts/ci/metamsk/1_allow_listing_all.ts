import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../../test-deploy/constants";

async function main() {
  const signers = await ethers.getSigners();
  const guardian = signers[1];
  const managerAdmin = signers[2];
  const user = signers[7];

  console.log("guardian==>", guardian.address);

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);
  const hyfManager = await ethers.getContract("HYFManager");
  const ayfManager = await ethers.getContract("AYFManager");
  const pricer = await ethers.getContract("AYF_Pricer");
  const allowlist = await ethers.getContract("Allowlist");

  // Print the addresses for verification
  // console.log("audc==>", audc.address);
  // console.log("abbyManager==>", abbyManager.address);
  // console.log("pricer==>", pricer.address);
  // console.log("allowlist==>", allowlist.address);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%

  // Current gas price (in wei)
  // let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(400)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;

  await allowlist.connect(guardian).addTerm("Test Term 1", {
    gasLimit: 200000,
  });

  await allowlist.connect(guardian).setValidTermIndexes([0], {
    gasLimit: 200000,
  });

  let tx = await allowlist.connect(guardian).setAccountStatus(ayfManager.address, 0, true, {
    gasLimit: 200000, // Manually specify gas limit for deployment
    gasPrice: gasPrice
  });

  tx.wait();


  tx = await allowlist.connect(guardian).setAccountStatus(hyfManager.address, 0, true, {
    gasLimit: 200000, // Manually specify gas limit for deployment
    gasPrice: gasPrice
  });

  tx.wait();

  await allowlist.connect(guardian).setAccountStatus(guardian.address, 0, true, {
    gasLimit: 200000,
  });

  await allowlist.connect(guardian).setAccountStatus(managerAdmin.address, 0, true, {
    gasLimit: 200000,
  });

  await allowlist.connect(guardian).setAccountStatus(user.address, 0, true, {
    gasLimit: 200000,
  });

  await allowlist.connect(guardian).setAccountStatus("0x6223c2C68d1e786cd02A2eBbDF873e1f9d268D45", 0, true, {
    gasLimit: 200000,
  });

  await allowlist.connect(guardian).setAccountStatus("0x57456e089EEeb0D94736C23A30F130295A4F232B", 0, true, {
    gasLimit: 200000,
  });
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
