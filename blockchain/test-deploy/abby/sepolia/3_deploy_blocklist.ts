async function main() {
  const { save } = deployments;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();

  const guardian = signers[1];

  // Deploy the Blocklist contract
  await deploy("Blocklist", {
    from: deployer,
    args: [],
    log: true,
  });

  // Get the deployed Blocklist contract instance
  const blocklist = await ethers.getContract("Blocklist");
  console.log("deployed block list contract address:", blocklist.address);

  try {
    // Transfer ownership to guardian
    await blocklist.transferOwnership(guardian.address, {
      gasLimit: 5000000, // Manually specify gas limit
    });

    // Accept ownership as guardian
    await blocklist.connect(guardian).acceptOwnership({
      gasLimit: 5000000, // Manually specify gas limit
    });

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
