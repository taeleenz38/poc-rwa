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

  const guardian = signers[0];
  const managerAdmin = signers[0];
  const pauser = signers[0];
  const assetSender = signers[0];
  const feeRecipient = signers[0];
  // const instantMintAdmin = signers[6];
  const relayer = signers[0];

  const abby = await ethers.getContract("ABBY");
  const blocklist = await ethers.getContract("Blocklist");

  console.log('parameters parsed to contract:', USDC_MAINNET, abby.address, managerAdmin.address, pauser.address, assetSender.address, feeRecipient.address, blocklist.address);


  await deploy("ABBYManager", {
    from: deployer,
    args: [
      USDC_MAINNET,
      abby.address,
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
  console.log('deployed ABBYManager!');
  const abbyManager = await ethers.getContract("ABBYManager");
  const pricer = await ethers.getContract("ABBY_Pricer");

  // Grant minting role to usdy manager
  await abby
    .connect(guardian)
    .grantRole(
      keccak256(Buffer.from("MINTER_ROLE", "utf-8")),
      abbyManager.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  // Grant sub-roles to managerAdmin
  await abbyManager
    .connect(managerAdmin)
    .grantRole(
      keccak256(Buffer.from("PRICE_ID_SETTER_ROLE", "utf-8")),
      managerAdmin.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  await abbyManager
    .connect(managerAdmin)
    .grantRole(
      keccak256(Buffer.from("TIMESTAMP_SETTER_ROLE", "utf-8")),
      managerAdmin.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  await abbyManager
    .connect(managerAdmin)
    .grantRole(
      keccak256(Buffer.from("PAUSER_ADMIN", "utf-8")),
      managerAdmin.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  await abbyManager
    .connect(managerAdmin)
    .grantRole(
      keccak256(Buffer.from("RELAYER_ROLE", "utf-8")),
      relayer.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  await abbyManager.connect(managerAdmin).setPricer(pricer.address, {
    gasLimit: 200000, // Example: Manually specify gas limit for this transaction
  });

  console.log("USDYManager deployment and setup completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});