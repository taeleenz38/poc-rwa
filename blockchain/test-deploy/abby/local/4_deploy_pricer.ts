import { parseUnits } from "ethers/lib/utils";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();

  const guardian = signers[1];
  const managerAdmin = signers[2];

  await deploy("ABBY_Pricer", {
    from: deployer,
    contract: "Pricer",
    args: [guardian.address, managerAdmin.address],
    log: true,
  });

  const pricer = await ethers.getContract("ABBY_Pricer");

  // Set price to $1
  // await pricer.connect(managerAdmin).addPrice(parseUnits("10", 18), "1");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});