import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { AUDC_ADDRESS } from "../../../../test-deploy/constants";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";

async function main() {
  const signers = await ethers.getSigners();
  const usdcWhaleSigner = signers[0];

  const audc = await ethers.getContractAt("AUDC", AUDC_ADDRESS);

  console.log("audc==>", audc.address);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100));

  const gasLimit = 600000;

  try {
    const userSafe: string = "0xcADdc83e3deE71d680a3C2b029Ec04c4B0357a6b";

    const tx = await audc.connect(usdcWhaleSigner).transfer(userSafe, parseUnits("50000", 18), { gasPrice, gasLimit });
    await tx.wait();
    console.log("Transferred A$DC!");
  } catch (error) {
    console.error("Error during Safe setup or transaction:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});
