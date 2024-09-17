import {
  SANCTION_ADDRESS,
  AUDC_ADDRESS,
} from "../../constants";
import { keccak256, parseUnits } from "ethers/lib/utils";
const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  const deployerSigner = signers[0];
  const guardian = process.env.GUARDIAN_WALLET!;
  const managerAdmin = process.env.MANAGER_ADMIN_WALLET!;
  const pauser = process.env.PAUSER_WALLET!;
  const assetSender = process.env.ASSET_SENDER_WALLET!;
  const instantMintAdmin = process.env.GUARDIAN_WALLET!;
  const feeRecipient = process.env.FEE_RECEIPIENT_WALLET!;

  const abby = await ethers.getContract("AFY");
  const blocklist = await ethers.getContract("Blocklist");

  console.log('parameters parsed to contract:', AUDC_ADDRESS, abby.address, managerAdmin, pauser, assetSender, feeRecipient, blocklist.address);


  await deploy("AFYManager", { //PRICE_ID_SETTER_ROLE, TIMESTAMP_SETTER_ROLE, PAUSER_ADMIN - managerAdmin
    from: deployer,
    args: [
      AUDC_ADDRESS, //_collateral
      abby.address, //rwa
      managerAdmin, //MANAGER_ADMIN - DEFAULT_ADMIN_ROLE
      pauser, //PAUSER_ADMIN
      assetSender, //setAssetSender - MANAGER_ADMIN
      feeRecipient, //setFeeRecipient - MANAGER_ADMIN
      parseUnits("1000", 6), //_minimumDepositAmount
      parseUnits("10", 18),// _minimumRedemptionAmount
      blocklist.address
    ],
    log: true,
    gasLimit: 6000000, // Manually specify gas limit for deployment
  });
  console.log('deployed ABBYManager!');
  const abbyManager = await ethers.getContract("AFYManager");
  const pricer = await ethers.getContract("AFY_Pricer");

  // Grant minting role to abby manager
  await abby
    .connect(deployerSigner)
    .grantRole(
      keccak256(Buffer.from("MINTER_ROLE", "utf-8")),
      abbyManager.address,
      {
        gasLimit: 200000, // Example: Manually specify gas limit for this transaction
      }
    );

  // Grant sub-roles to managerAdmin
  // await abbyManager
  //   .connect(managerAdmin)
  //   .grantRole(
  //     keccak256(Buffer.from("PRICE_ID_SETTER_ROLE", "utf-8")),
  //     managerAdmin.address,
  //     {
  //       gasLimit: 200000, // Example: Manually specify gas limit for this transaction
  //     }
  //   );

  // await abbyManager
  //   .connect(managerAdmin)
  //   .grantRole(
  //     keccak256(Buffer.from("TIMESTAMP_SETTER_ROLE", "utf-8")),
  //     managerAdmin.address,
  //     {
  //       gasLimit: 200000, // Example: Manually specify gas limit for this transaction
  //     }
  //   );

  // await abbyManager
  //   .connect(managerAdmin)
  //   .grantRole(
  //     keccak256(Buffer.from("PAUSER_ADMIN", "utf-8")),
  //     managerAdmin.address,
  //     {
  //       gasLimit: 200000, // Example: Manually specify gas limit for this transaction
  //     }
  //   );

  // await abbyManager
  //   .connect(managerAdmin)
  //   .grantRole(
  //     keccak256(Buffer.from("RELAYER_ROLE", "utf-8")),
  //     relayer.address,
  //     {
  //       gasLimit: 200000, // Example: Manually specify gas limit for this transaction
  //     }
  //   );

  // await abbyManager.connect(managerAdmin).setPricer(pricer.address, {
  //   gasLimit: 200000, // Example: Manually specify gas limit for this transaction
  // });

  console.log("ABBYManager deployment and setup completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});