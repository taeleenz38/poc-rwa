export const API_KEY = 'KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe';
export const PRICING_ADDRESS = '0xf3b3d4DfEfF2Efbd0370c78dBC277CD57CBf6210';
export const ALLOW_LIST_ADDRESS = '0x4c5b22d0d6e58C4dBE9D8137F2200413C71bD961';
export const ABBY_MANAGER_ADDRESS = '0xFb1d535fcb5FC74ec5F2e7a0df265B12d847b00B';
export const AUDC_ADDRESS = '0xa948C81C90faC96312f844E8b91dE190Dd3a9302';
export const ABBY_ADDRESS = '0x9ccb0F1950b1891691D48607Fe4a9E5C07fCc9D4';
export const ASSET_SENDER_ADDRESS = '0x0686b3a7B9bE2751bB51084a6E0E7DB7f1746eb1';
export const FEE_RECIPIENT_ADDRESS = '0x942D99f4560422159FC961C40f750189cAE17f86';
export const FROM_BLOCK = 6462930;
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

