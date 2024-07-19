import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  PROD_ORACLE,
  SANCTION_ADDRESS,
  USDC_MAINNET,
} from "../../mainnet_constants";
import { keccak256, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();

  const guardian = signers[1];
  const managerAdmin = signers[2];
  const pauser = signers[3];
  const assetSender = signers[4];
  const feeRecipient = signers[5];
  const instantMintAdmin = signers[6];
  const relayer = signers[7];

  const usdy = await ethers.getContract("USDY");
  const blocklist = await ethers.getContract("Blocklist");

  console.log('parameters parsed to contract:', USDC_MAINNET, usdy.address, managerAdmin.address, pauser.address, assetSender.address, feeRecipient.address, blocklist.address);


  await deploy("USDYManager", {
    from: deployer,
    args: [
      USDC_MAINNET,
      usdy.address,
      managerAdmin.address,
      pauser.address,
      assetSender.address,
      feeRecipient.address,
      parseUnits("1000", 6),
      parseUnits("10", 18),
      blocklist.address,
      SANCTION_ADDRESS,
    ],
    log: true,
    gasLimit: 6000000, // Manually specify gas limit for deployment
  });
  console.log('deployed USDYManager!');
  const usdyManager = await ethers.getContract("USDYManager");
  const pricer = await ethers.getContract("USDY_Pricer");

  // Grant minting role to usdy manager
  await usdy
    .connect(guardian)
    .grantRole(
      keccak256(Buffer.from("MINTER_ROLE", "utf-8")),
      usdyManager.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  // Grant sub-roles to managerAdmin
  await usdyManager
    .connect(managerAdmin)
    .grantRole(
      keccak256(Buffer.from("PRICE_ID_SETTER_ROLE", "utf-8")),
      managerAdmin.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  await usdyManager
    .connect(managerAdmin)
    .grantRole(
      keccak256(Buffer.from("TIMESTAMP_SETTER_ROLE", "utf-8")),
      managerAdmin.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  await usdyManager
    .connect(managerAdmin)
    .grantRole(
      keccak256(Buffer.from("PAUSER_ADMIN", "utf-8")),
      managerAdmin.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  await usdyManager
    .connect(managerAdmin)
    .grantRole(
      keccak256(Buffer.from("RELAYER_ROLE", "utf-8")),
      relayer.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  await usdyManager.connect(managerAdmin).setPricer(pricer.address, {
    gasLimit: 200000, // Example: Manually specify gas limit for this transaction
  });

  console.log("USDYManager deployment and setup completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});