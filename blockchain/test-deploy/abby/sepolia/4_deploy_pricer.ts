import { parseUnits } from "ethers/lib/utils";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();

  const guardian = signers[1]; //DEFAULT_ADMIN_ROLE
  const managerAdmin = signers[2]; //PRICE_UPDATE_ROLE - addPrice - updatePrice

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