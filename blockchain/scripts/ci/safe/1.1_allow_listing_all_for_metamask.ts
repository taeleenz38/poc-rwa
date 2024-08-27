import { ethers } from "hardhat";
import {
  AUDC_ADDRESS,
} from "../../../test-deploy/constants";

async function main() {
  const signers = await ethers.getSigners();
  const guardian = signers[1];
  // const user = signers[6];
  // const ma = signers[1];

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);
  const abbyManager = await ethers.getContract("ABBYManager");
  const pricer = await ethers.getContract("ABBY_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const abby = await ethers.getContract("ABBY");

  // Print the addresses for verification
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

  console.log("Setting up Gnosis Safe...");
  console.log("guardian==>", guardian.address);
  
  try {
    const guardianSafe: string = process.env.GUARDIAN_WALLET!;
    console.log("guardianSafe==>", guardianSafe);
    const managerAdminSafe: string = process.env.MANAGER_ADMIN_WALLET!;
    const userSafe: string = process.env.STABLE_COIN_USER_WALLET!;

    // Encode and execute addTerm function
    const addTermData = allowlist.interface.encodeFunctionData("addTerm", ["Test Term 1"]);
    const setValidTermIndexesData = allowlist.interface.encodeFunctionData("setValidTermIndexes", [[0]]);
    const setAccountStatusUserData = allowlist.interface.encodeFunctionData("setAccountStatus", [userSafe, 0, true]);
    const setAccountStatusGuardianData = allowlist.interface.encodeFunctionData("setAccountStatus", [guardianSafe, 0, true]);
    const setAccountStatusManagerAdminSafeData = allowlist.interface.encodeFunctionData("setAccountStatus", [managerAdminSafe, 0, true]);
    const setAccountStatusAbbyManagerData = allowlist.interface.encodeFunctionData("setAccountStatus", [abbyManager.address, 0, true]);

    
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
