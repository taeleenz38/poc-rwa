export const API_KEY = 'KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe';
export const PRICING_ADDRESS = '0x4800eD2AC2e76bf6A7e9511A8c6b8DB312570098';
export const ALLOW_LIST_ADDRESS = '0x2f05251F216AEDC3FFeA3AC628ABC4307b67248c';
export const ABBY_MANAGER_ADDRESS = '0xE1f90FdA638712c29Df97b662564aC26a11e1C2f';
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