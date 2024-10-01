async function main() {
  const { save } = deployments;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const signers = await ethers.getSigners();
  const deployerSigner = signers[0];
  // const guardian = process.env.GUARDIAN_WALLET!;
  // const managerAdmin = process.env.MANAGER_ADMIN_WALLET!; //PRICE_UPDATE_ROLE - addPrice - updatePrice

  console.log("The deployer is:", deployer.address);
  // console.log("The guargian is:", guardian);

  await deploy("HYFFactory", {
    from: deployer,
    args: [deployerSigner.address],
    log: true,
  });

  // ABBY deps
  const factory = await ethers.getContract("HYFFactory");
  const blocklist = await ethers.getContract("Blocklist");
  const allowlist = await ethers.getContract("Allowlist");

  // console.log("factory==>", factory)

  const tx = await factory
    .connect(deployerSigner)
    .deployHFY("HYF", "HYF", [
      blocklist.address,
      allowlist.address
    ]);

  //ABBY (AYF) - DEFAULT_ADMIN_ROLE, PAUSER_ROLE - guardian, owner - guardian
  //MINTER_ROLE - manager
  
  const receipt = await tx.wait();

  const abbyProxy = await factory.abbyProxy();
  const abbyProxyAdmin = await factory.abbyProxyAdmin();
  const abbyImplementation = await factory.abbyImplementation();

  console.log(`\nThe ABBY proxy is deployed @: ${abbyProxy}`);
  console.log(`The ABBY proxy admin is deployed @: ${abbyProxyAdmin}`);
  console.log(`The ABBY Implementation is deployed @: ${abbyImplementation}\n`);

  const abbyArtifact = await deployments.getExtendedArtifact("HYF");
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

  await save("HYF", abbyProxied);
  await save("ProxyAdminHYF", abbyAdmin);
  await save("HYFImplementation", abbyImpl);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
