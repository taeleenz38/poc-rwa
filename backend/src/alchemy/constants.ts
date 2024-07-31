export const API_KEY = 'KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe';
export const PRICING_ADDRESS = '0x2246e0aA9E4d150cF67C89C63b3bF839fF5dAeB2';
export const ALLOW_LIST_ADDRESS = '0xad5440e27483d9C35041E330152bd1d4F6a98aC7';
export const ABBY_MANAGER_ADDRESS = '0x1B057BFB1D772fbb0A8e86EB150F6Ff57f55Bba1';
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
        "indexed": false,
        "internalType": "uint256",
        "name": "stage",
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
    }]`
