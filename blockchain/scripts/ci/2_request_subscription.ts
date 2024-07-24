import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../test-deploy/constants";

async function main() {
  const signers = await ethers.getSigners();

  const usdcWhaleSigner = signers[0];
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

  console.log("Request Subscription!");

  await audc.connect(usdcWhaleSigner).transfer(user.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("transferred A$DC!");
  await audc.connect(user).approve(abbyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("Approval provided for A$DC!");
  const res = await allowlist.isAllowed(user.address, { gasPrice, gasLimit });
  console.log(res);

  const minDeposit = await abbyManager.connect(user).minimumDepositAmount();
  console.log("The value of min deposit is:", minDeposit.toString());
  console.log("Request Subscription!");
  const tx = await abbyManager.connect(user).requestSubscription(parseUnits("20000", 18), { gasPrice, gasLimit });
  const receipt = await tx.wait();
  console.log("--------------------Request Subscription done!----------------------------------", receipt);
  
}

main();
