import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-verify"
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "dotenv/config";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";

import { HardhatUserConfig } from "hardhat/config";

const deployer = process.env.DEPLOYER!; //0xD44B3b1e21d5F55f5b5Bb050E68218552aa4eAfC - 0
const guardian = process.env.GUARDIAN_PK_1!; //0x1E40767ddA91a06ee3e80E3d28BEB28CcF2F2565 - 1
const managerAdmin = process.env.MANAGER_ADMIN!; //0xB433CDEbaf52E83F6aF8ec318b09b48519DD8519 - 2
const pauser = process.env.PAUSER!; //0x69Efd0bb8a81CFB92c58222f7b6974EfC00E1Cb5 - 3
const assetSender = process.env.ASSET_SENDER!; //0x9F93Eab82877B46bADf70Bb88Ad370Bb5d6BFA1D - 4
const instantMintAdmin = process.env.INSTANT_MINT_ADMIN!; //0x0b8799749c6c13F4aCc3A92ADb8084fF1a97F1a1 - 5
const feeReceipent = process.env.FEE_RECEIPIENT!; //0x7C07198427A078D5a12c36CfF8afCBa5fe3b0907 - 6
const stableCoinUser = process.env.STABLE_COIN_USER_PK_1!; //0xb4F6942EFE7e953390b6BB1616205516CE9e0123 - 7

//asset receipent - 0xBbCBbd4b0dfEFdd5eeed2e5b07e305b0A7Bc6bF9

const relayer = process.env.RELAYER!; //0x1E40767ddA91a06ee3e80E3d28BEB28CcF2F2565
const user = process.env.USER!; //0xD44B3b1e21d5F55f5b5Bb050E68218552aa4eAfC

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.4.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe',
      accounts: [deployer, guardian, managerAdmin, pauser, assetSender, instantMintAdmin, feeReceipent, stableCoinUser],
      gasPrice: 10000000000,
    },
    sepoliaSafe: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe',
      accounts: [deployer, guardian, managerAdmin, pauser, assetSender, instantMintAdmin, feeReceipent, stableCoinUser],
      gasPrice: 10000000000,
    }
  },
  mocha: {
    timeout: 60 * 30 * 1000,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://eth-sepolia.g.alchemy.com/v2/KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe",
          browserURL: "https://sepolia.etherscan.io"
        }
      }
    ]

  },
  namedAccounts: {
    deployer: 0,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
};

export default config;
