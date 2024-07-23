import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();

  const guardian = signers[0];
  const managerAdmin = signers[0];

  console.log("signers====> ", signers);

  console.log("guardian====> ", guardian.address);
  console.log("managerAdmin====> ", managerAdmin.address);

  await deploy("ABBY_Pricer", {
    from: deployer,
    contract: "Pricer",
    args: [guardian.address, managerAdmin.address],
    log: true,
  });

  const pricer = await ethers.getContract("ABBY_Pricer");

  // Set price to $1
  await pricer.connect(managerAdmin).addPrice(parseUnits("10", 18), "1");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});