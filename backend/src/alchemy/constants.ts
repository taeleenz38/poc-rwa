export const API_KEY = 'KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe';
export const PRICING_ADDRESS = '0x51b4AC2092b76843322De03796705cb3368565cB';
export const ALLOW_LIST_ADDRESS = '0xcea6E0a53C29C595fF82944FAbAd2B43C05f10e8';
export const ABBY_MANAGER_ADDRESS = '0x0cED863C5C399C9d907A5B60350c516e042EE19d';
export const AUDC_ADDRESS = '0xFbf32643ee8C154C88470206F4EeD2539A0DE274';
export const ABBY_ADDRESS = '0x591B5fAd0d8B54e190B8B692ACe683aec93689Bb';
export const ASSET_SENDER_ADDRESS = '0x6223c2C68d1e786cd02A2eBbDF873e1f9d268D45';
export const FEE_RECIPIENT_ADDRESS = '0xB6E69B144Db3ca108EF0e15B946EA517e03d5804';
export const FROM_BLOCK = 6488984;
export const PRICE_ADDED_ABI = `[{
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "priceId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PriceAdded",
    "type": "event"
  }]`;

export const PRICE_CHANGED_ABI = `[{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "priceId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "oldPrice",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "newPrice",
      "type": "uint256"
    }
  ],
  "name": "PriceUpdated",
  "type": "event"
}]`;

export const ALLOW_LIST_ABI = `[{
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "hashedMessage",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "termIndex",
          "type": "uint256"
        }
      ],
      "name": "TermAdded",
      "type": "event"
    }]`;

export const ACCOUNT_STATUS_ABI = `[{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "termIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        }
      ],
      "name": "AccountStatusSetByAdmin",
      "type": "event"
}]`;

export const REDEMPTION_REQUESTED_ABI = `[{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "redemptionId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rwaAmountIn",
          "type": "uint256"
        }
      ],
      "name": "RedemptionRequested",
      "type": "event"
    }]`

export const REDEMPTION_COMPLETED_ABI = `[{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "redemptionId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rwaAmountRequested",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralAmountReturned",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "RedemptionCompleted",
      "type": "event"
    }]`

export const MINT_REQESTED_ABI = `[    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "depositId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralAmountDeposited",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "depositAmountAfterFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "feeAmount",
          "type": "uint256"
        }
      ],
      "name": "MintRequested",
      "type": "event"
    }]`;
export const MINT_COMPLETED_ABI = `[    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "depositId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rwaAmountOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralAmountDeposited",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "priceId",
          "type": "uint256"
        }
      ],
      "name": "MintCompleted",
      "type": "event"
    }]`;

    export const PRICEIDSETFORREDEMPTION_ABI = `[    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "redemptionIdSet",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "priceIdSet",
          "type": "uint256"
        }
      ],
      "name": "PriceIdSetForRedemption",
      "type": "event"
    }]`;
    
export const CLAIMABLETIMESTAMP_ABI = `[    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "claimTimestamp",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "depositId",
          "type": "bytes32"
        }
      ],
      "name": "ClaimableTimestampSet",
      "type": "event"
    }]`;
export const PRICEIDSETFORDEPOSIT_ABI = `[    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "depositIdSet",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "priceIdSet",
          "type": "uint256"
        }
      ],
      "name": "PriceIdSetForDeposit",
      "type": "event"
    }]`;

    export const REDEMPTION_APPROVAL_ABI = `[{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "redemptionId",
          "type": "bytes32"
        }
      ],
      "name": "RedemptionApproved",
      "type": "event"
    }]`;

    export const TRANSFER_ABI = `[{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }]`;

