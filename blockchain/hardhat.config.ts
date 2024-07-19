import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-verify"
//import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "dotenv/config";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";

// OMMF deployment Helpers
import "./scripts/ommf/1-ommf-prod";
import "./scripts/ommf/2-save-ommf-prod";
import "./scripts/ommf/3-wommf-prod";
import "./scripts/ommf/4-save-wommf-prod";
import "./scripts/ommf/5-ommfManager-prod";

// USDY deployment Helpers
import "./scripts/usdy/1-allowlist-prod";
import "./scripts/usdy/2-save-allowlist-prod";
import "./scripts/usdy/3-usdy-prod";
import "./scripts/usdy/4-save-usdy-prod";
import "./scripts/usdy/5-usdyManager-prod";

// Post Deploy Verification Scripts
import "./scripts/usdy/verification-scripts/assert_usdy_configuration";
import "./scripts/usdy/verification-scripts/assert_allowlist_configuration";
import "./scripts/usdy/verification-scripts/assert_blocklist_configuration";
import "./scripts/usdy/verification-scripts/assert_usdyManager_configuration";
import "./scripts/usdy/verification-scripts/assert_rwaOracle_rateCheck_configuration";
import "./scripts/usdy/verification-scripts/assert_pricer_usdy_configuration";
import "./scripts/utils/prod-subtasks.ts";

import { HardhatUserConfig } from "hardhat/config";

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
    hardhat: {
      accounts: { mnemonic: process.env.MNEMONIC },
      forking: {
        url: process.env.MAINNET_RPC_URL!,
        blockNumber: parseInt("6251309"),
      },
      chainId: process.env.FORKING_CHAIN_ID
        ? parseInt(process.env.FORKING_CHAIN_ID)
        : 1337,
      live: false,
      gas: 10_000_000,
      gasPrice: 103112366939,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
    },
    mainnet: {
      accounts: [process.env.MAINNET_PRIVATE_KEY!],
      url: process.env.MAINNET_RPC_URL!,
      gas: "auto",
      live: true,
    },
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/wgC_6RILBar_tWOU1IpbIxaRGZOb4JE6',
      accounts: ['957632735f6c053f8196c4bb0f7cca92c2717c22b3d9b2dba6996a26afadc93a', 'c1520fa18f6b8952f325cef584445734d7e56b952f1e31eeb31f87f7e6f53c89', '0f6a7b7874c25d188a36a376ca9459eb5093d922df35db28ef70cc849af22f0d', '2b3bd009d42a8b8ae242a510992b0103979ff39e235dba430c272457e13e00ab', 'd30ecb798427cbc503d138d35fc43b08f06cfcfccb46b082b689d0f15406d013', '4d305845d0bde748226e317a2352286206174ee5debf9e98528b8bc83df0f899', 'c1c5151cc9e8079b67a45066fe8a63f2138028abf3b1d8aee823c3fc1cd402c8', 'dc4e41081fa47236d07cac16fd6c68eb82cb8818a764698d1c6681b0689d9b82', '93e7ced8c2070859aa79894d1813aacdb8e6db4dc3f054c0cbf2dd3c2eb65a80'],
      gasPrice: 10000000000,
    }
   /* matic: {
      accounts: [process.env.MAINNET_PRIVATE_KEY!],
      url: process.env.MAINNET_RPC_URL_POLYGON!,
      gas: "auto",
      live: true,
    },*/
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
          apiURL: "https://eth-sepolia.g.alchemy.com/v2/wgC_6RILBar_tWOU1IpbIxaRGZOb4JE6",
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
