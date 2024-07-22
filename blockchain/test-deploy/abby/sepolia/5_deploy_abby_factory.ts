import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { KYC_REGISTRY, SANCTION_ADDRESS } from "../../mainnet_constants";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { save } = deployments;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();

  const guardian = signers[0];
  console.log('the guardian address is:', guardian.address);

  await deploy("ABBYFactory", {
    from: deployer,
    args: [guardian.address],
    log: true,
  });

  // USDY deps
  const factory = await ethers.getContract("ABBYFactory");
  const blocklist = await ethers.getContract("Blocklist");
  const allowlist = await ethers.getContract("Allowlist");

  const tx = await factory
    .connect(guardian)
    .deployABBY("ABBY", "ABBY", [
      blocklist.address,
      allowlist.address,
      SANCTION_ADDRESS,
    ]);
  
  const receipt = await tx.wait();

  const abbyProxy = await factory.abbyProxy();
  const abbyProxyAdmin = await factory.abbyProxyAdmin();
  const abbyImplementation = await factory.abbyImplementation();

  console.log(`\nThe ABBY proxy is deployed @: ${abbyProxy}`);
  console.log(`The ABBY proxy admin is deployed @: ${abbyProxyAdmin}`);
  console.log(`The ABBY Implementation is deployed @: ${abbyImplementation}\n`);

  const abbyArtifact = await deployments.getExtendedArtifact("ABBY");
  const paAtrifact = await deployments.getExtendedArtifact("ProxyAdmin");

  let abbyProxied = {
    address: abbyProxy,
    ...abbyArtifact,
  };
  let abbyAdmin = {
    address: abbyProxyAdmin,
    ...abbyProxyAdmin,
  };
  let abbyImpl = {
    address: abbyImplementation,
    ...abbyImplementation,
  };

  await save("ABBY", abbyProxied);
  await save("ProxyAdminUSDY", abbyAdmin);
  await save("USDYImplementation", abbyImpl);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
