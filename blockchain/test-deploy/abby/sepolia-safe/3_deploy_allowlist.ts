const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main () {
  const { save } = deployments;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  const deployerSigner = signers[0];
  // const guardian = process.env.GUARDIAN_WALLET!;
  const guardian = signers[1].address;
  
  console.log("The deployer is:", deployerSigner.address);
  console.log("The guardian is:", guardian);

  // Define a gas limit
  const gasLimit = 600000;

  // Deploy AllowlistFactory contract
  const deployResult = await deploy("AllowlistFactory", {
    from: deployer,
    args: [deployerSigner.address],  // Pass args as an array
    log: true
  });

  const factory = await ethers.getContract("AllowlistFactory");

  // Deploy Allowlist via the factory contract
  const tx = await factory
    .connect(deployerSigner)
    .deployAllowlist(guardian, guardian); // admin - DEFAULT_ADMIN_ROLE - ALLOWLIST_ADMIN - addTerm - setCurrentTermIndex - setValidTermIndexes
                                          // setter - ALLOWLIST_SETTER - setAccountStatus

  const receipt = await tx.wait();
  
  const allowProxy = await factory.allowlistProxy();
  const allowProxyAdmin = await factory.allowlistProxyAdmin();
  const allowImplementation = await factory.allowlistImplementation();

  console.log(`\nThe Allowlist proxy is deployed @: ${allowProxy}`);
  console.log(`The Allowlist proxy admin is deployed @: ${allowProxyAdmin}`);
  console.log(`The Allowlist Implementation is deployed @: ${allowImplementation}\n`);

  const allowlistArtifact = await deployments.getExtendedArtifact("AllowlistUpgradeable");
  const paArtifact = await deployments.getExtendedArtifact("ProxyAdmin");

  let allowlistProxied = {
    address: allowProxy,
    ...allowlistArtifact,
  };
  let allowlistAdmin = {
    address: allowProxyAdmin,
    ...paArtifact,
  };
  let allowlistImpl = {
    address: allowImplementation,
    ...allowlistArtifact,  // Use the correct artifact
  };

  await save("Allowlist", allowlistProxied);
  await save("ProxyAdminAllowlist", allowlistAdmin);
  await save("AllowlistImplementation", allowlistImpl);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
