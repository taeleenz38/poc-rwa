import { parseUnits } from "ethers/lib/utils";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  // const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const signers = await ethers.getSigners();
  const deployerSigner = signers[0];
  // const guardian = process.env.GUARDIAN_WALLET!;
  const guardian = signers[1].address;
  // const managerAdmin = process.env.MANAGER_ADMIN_WALLET!; //PRICE_UPDATE_ROLE - addPrice - updatePrice
  const managerAdmin = signers[2].address;

  console.log("The deployer is:", deployer.address);
  console.log("The guargian is:", guardian);
  console.log("The managerAdmin is:", managerAdmin);


  await deploy("AYF_Pricer", {
    from: deployer,
    contract: "Pricer",
    args: [guardian, managerAdmin],
    log: true,
  });

  const pricer = await ethers.getContract("AYF_Pricer");
  console.log(pricer)

  // Set price to $1
  // await pricer.connect(managerAdmin).addPrice(parseUnits("10", 18), "1");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});