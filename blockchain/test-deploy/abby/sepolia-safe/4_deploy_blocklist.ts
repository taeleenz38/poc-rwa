async function main() {
  const { save } = deployments;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  const deployerSigner = signers[0];
  // const guardian = process.env.GUARDIAN_WALLET!;
  const guardian = signers[1].address;
  const gasPrice = (await ethers.provider.getGasPrice()).mul(ethers.BigNumber.from(3)); // Increase gas price by 2 times
  const gasLimit = 6000000;
  
  console.log("The deployer is:", deployerSigner.address);
  console.log("The guardian is:", guardian);


  // Deploy the Blocklist contract
  await deploy("Blocklist", {
    from: deployer,
    args: [],
    log: true,
    gasLimit,
    gasPrice
  });

  // Get the deployed Blocklist contract instance
  const blocklist = await ethers.getContract("Blocklist");
  console.log("deployed block list contract address:", blocklist.address);

  try {
    // Transfer ownership to guardian
    await blocklist.transferOwnership(guardian, {
      gasLimit,
      gasPrice
    });

    // // Accept ownership as guardian
    // await blocklist.connect(guardian).acceptOwnership({
    //   gasLimit: 5000000, // Manually specify gas limit
    // });

    console.log("Ownership transfer and acceptance completed successfully.");
  } catch (error) {
    console.error("Error transferring or accepting ownership:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
