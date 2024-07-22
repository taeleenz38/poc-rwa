import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { KYC_REGISTRY, SANCTION_ADDRESS } from "../../mainnet_constants";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { save } = deployments;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();

  const guardian = signers[1];
  console.log('the guardian address is:', guardian.address);

  await deploy("USDYFactory", {
    from: deployer,
    args: [guardian.address],
    log: true,
  });

  // USDY deps
  const factory = await ethers.getContract("USDYFactory");
  const blocklist = await ethers.getContract("Blocklist");
  const allowlist = await ethers.getContract("Allowlist");

  const tx = await factory
    .connect(guardian)
    .deployUSDY("USDY", "USDY", [
      blocklist.address,
      allowlist.address,
      SANCTION_ADDRESS,
    ]);
  
  const receipt = await tx.wait();

  const usdyProxy = await factory.usdyProxy();
  const usdyProxyAdmin = await factory.usdyProxyAdmin();
  const usdyImplementation = await factory.usdyImplementation();

  console.log(`\nThe USDY proxy is deployed @: ${usdyProxy}`);
  console.log(`The USDY proxy admin is deployed @: ${usdyProxyAdmin}`);
  console.log(`The USDY Implementation is deployed @: ${usdyImplementation}\n`);

  const usdyArtifact = await deployments.getExtendedArtifact("USDY");
  const paAtrifact = await deployments.getExtendedArtifact("ProxyAdmin");

  let usdyProxied = {
    address: usdyProxy,
    ...usdyArtifact,
  };
  let usdyAdmin = {
    address: usdyProxyAdmin,
    ...usdyProxyAdmin,
  };
  let usdyImpl = {
    address: usdyImplementation,
    ...usdyImplementation,
  };

  await save("USDY", usdyProxied);
  await save("ProxyAdminUSDY", usdyAdmin);
  await save("USDYImplementation", usdyImpl);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
