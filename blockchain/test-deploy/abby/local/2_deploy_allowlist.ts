import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { KYC_REGISTRY } from "../../mainnet_constants";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main () {
  const { save } = deployments;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  
  console.log("The deployer is:", deployer.address);
  const guardian = signers[1];

  await deploy("AllowlistFactory", {
    from: deployer,
    args: [guardian.address],
    log: true,
  });

  const factory = await ethers.getContract("AllowlistFactory");

  const tx = await factory
    .connect(guardian)
    .deployAllowlist(guardian.address, guardian.address);

  const receipt = await tx.wait();
  
  const allowProxy = await factory.allowlistProxy();
  const allowProxyAdmin = await factory.allowlistProxyAdmin();
  const allowImplementation = await factory.allowlistImplementation();

  console.log(`\nThe Allowlist proxy is deployed @: ${allowProxy}`);
  console.log(`The Allowlist proxy admin is deployed @: ${allowProxyAdmin}`);
  console.log(
    `The Allowlist Implementation is deployed @: ${allowImplementation}\n`
  );

  const allowlistArtifact = await deployments.getExtendedArtifact(
    "AllowlistUpgradeable"
  );
  const paAtrifact = await deployments.getExtendedArtifact("ProxyAdmin");

  let allowlistProxied = {
    address: allowProxy,
    ...allowlistArtifact,
  };
  let allowlistAdmin = {
    address: allowProxyAdmin,
    ...paAtrifact,
  };
  let allowlistImpl = {
    address: allowImplementation,
    ...allowImplementation,
  };

  await save("Allowlist", allowlistProxied);
  await save("ProxyAdminAllowlist", allowlistAdmin);
  await save("AllowlistImplementation", allowlistImpl);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


